<?php

namespace App\Controllers;


// Vendors
use \Firebase\JWT\JWT;
use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;
use \Firebase\JWT\Key;


// Models
use App\Models\FacilitiesModel;
use App\Models\AccountsModel;
use App\Models\UsersModel;
use App\Models\VerificationModel;
use App\Models\ProceduresModel;
use App\Models\ReferralsModel;
use App\Models\HospitalsModel;
use App\Models\TransactionsModel;
use App\Models\ReportsModel;
use App\Models\NotificationsModel;


class Facility extends BaseController {

    use ResponseTrait;

    public function __construct(){
        $this->key              = getenv('JWT_SECRET');
        $this->accounts         = new AccountsModel();
        $this->users            = new UsersModel();
        $this->verifications    = new VerificationModel();
        $this->facilities       = new FacilitiesModel();
        $this->referrals        = new ReferralsModel();
        $this->procedure        = new ProceduresModel();
        $this->hospital         = new HospitalsModel();
        $this->transactions     = new TransactionsModel();
        $this->reports          = new ReportsModel();
        $this->notifications    = new NotificationsModel();
    }


    public function homepage(){
        $decode         = $this->decodetoken();
        $facilityid             = $this->facilityid($decode->id);

        $stats = [
            'referrals_today'   => $this->referrals->where('referral_facility_id', $facilityid)->where('referral_date', date('Y-m-d'))->countallresults(),
            'completed_today'   => $this->referrals->where('referral_facility_id', $facilityid)->where('referral_date', date('Y-m-d'))->where('referral_status', 'completed')->countallresults(),
            'incomplete_today'  => $this->referrals->where('referral_facility_id', $facilityid)->where('referral_date', date('Y-m-d'))->where('referral_status', 'ongoing')->countallresults(),
        ];

        $data = [
            'userdetails'       => $this->users->select('first_name, profile_picture')->asObject()->find($decode->id),
            'stats'             => $stats,
            'incoming'          => $this->referrals->where('referral_facility_id', $facilityid)->where('referral_status', 'ongoing')->select('referral_patient_name, referral_procedures, referral_id')->find(),
            'payment'           => $this->facilities->select('due_payment')->asObject()->find($facilityid)->due_payment
        ];

        return $this->respond([
            'status'            => 200,
            'data'              => $data
        ]);
    }

    public function procedurecomplete($id){

        $decode         = $this->decodetoken();
        $facilityid = $this->facilityid($decode->id);
        
        $ppr = intval($this->facilities->select('price_per_referral')->asObject()->find($facilityid)->price_per_referral);
        $proceduredets = $this->referrals->select('referral_procedures, referral_doctor_id, referral_patient_name')->asObject()->find($id);
        
        $doctortype = $this->users->select('user_id, health_worker')->asObject()->find(intval($proceduredets->referral_doctor_id))->health_worker;
        if($doctortype == 0){
            $reportstart = 'private';
        } else {
            $reportstart = 'incomplete';
        }


        $eachprocedure = explode(',', $proceduredets->referral_procedures);

        $this->transactions->transStart();
        $i = 0;
        foreach ($eachprocedure as $item) {
            $data[$i] = [
                'report_referral_id'    => $id,
                'report_facility_id'    => $facilityid,
                'report_doctor_id'      => intval($proceduredets->referral_doctor_id),
                'report_procedure'      => $item,
                'report_status'         => $reportstart
            ];
            $this->reports->insert($data[$i]);
            $i++;
        }

        $balanceafter = $this->transactions->select('transactions_amount')->where('transactions_status', 'unsettled')->where('transactions_facility_id', $facilityid)->selectsum('transactions_amount')->get()->getrow()->transactions_amount + $ppr;

        $data = [
            'transactions_type' => 'facility',
            'transactions_facility_id' => $facilityid,
            'transactions_patient_name' => $proceduredets->referral_patient_name,
            'transactions_procedures' => $proceduredets->referral_procedures,
            'transactions_amount' => $ppr,
            'transactions_amount_after' => $balanceafter,
            'transactions_status' => 'unsettled'
        ];
        
        $this->notifications->sendnotification($decode->id, 'You have marked '.$proceduredets->referral_patient_name.'\'s procedure as complete', '/facility/completedreferrals', 'unread');
        $this->notifications->sendnotification($proceduredets->referral_doctor_id, $proceduredets->referral_patient_name.'\'s procedure has been completed', '/doctor/history', 'unread');

        $this->transactions->insert($data);
        $this->referrals->update($id, ['referral_status' => 'completed']);
        $this->facilities->update($facilityid, ['due_payment' => $balanceafter]);
        $this->transactions->transComplete();
        return $this->respond([
            'status' => 200,
        ]);
    }

    public function pendingreports(){
        $decode         = $this->decodetoken();
        $facilityid = $this->facilityid($decode->id);

        $pendingreports = $this->reports->select('report_id, report_procedure, report_status, report_date, referral_patient_name')
                                        ->where('report_status', 'incomplete')
                                        ->where('report_facility_id', $facilityid)
                                        ->orwhere('report_status', 'private')
                                        ->where('report_facility_id', $facilityid)
                                        ->join('referrals', 'referrals.referral_id = reports.report_referral_id')
                                        ->orderby('report_id', 'DESC')
                                        ->find();

        return $this->respond([
            'status' => 200,
            'pendingreports' => $pendingreports
        ]);

    }

    public function reportsdetails($id){

        $report = $this->reports->select('referral_id, report_referral_id, report_procedure, report_text, report_image, report_status, report_date, referral_patient_name, referral_patient_gender, referral_patient_age')->join('referrals', 'referrals.referral_id = reports.report_referral_id')->asObject()->find($id);
        
        if(empty($report)){
            return $this->respond([
                'status' => 201
            ]);
        }

        return $this->respond([
            'status' => 200,
            'reportdetails' => $report
        ]);
    }

    public function updatereport(){

        helper(['form', 'image', 'filesystem', 'text']);
        $validation =  \Config\Services::validation();
        $rules = [
            'file' => [
                'rules' => 'is_image[file]|uploaded[file]'
            ]
        ];
        
        if(!$this->validate($rules)){
            return $this->respond([
                'status' => 203,
            ]);
        }

        $path = './uploads/reportpictures';
        $file = $this->request->getfile('file');
        
        if($file->isValid() && !$file->hasMoved()){
            $newName = $file->getRandomName();
            $file->move($path, $newName);
            $filename = $file->getName();
        }
        $reportid = $this->request->getvar('reportid');
        $reportstatus = $this->reports->select('report_status')->asObject()->find($reportid)->report_status;


        if($reportstatus === 'private'){
            $this->reports->update($reportid, ['report_image' => $filename, 'report_status' => 'private_complete']);
        } else {
            $this->reports->update($reportid, ['report_image' => $filename, 'report_status' => 'complete']);
            
            $doctorid = $this->reports->select('report_doctor_id')->asObject()->find($reportid)->report_doctor_id;
            $reportreferralid = $this->reports->select('report_referral_id')->asObject()->find($reportid)->report_referral_id;
            $patientname = $this->referrals->select('referral_patient_name')->asObject()->find($reportreferralid)->referral_patient_name;

            $this->notifications->sendnotification($doctorid, $patientname.'\'s report is ready', '/doctor/reportsingle/'.$reportid, 'unread');
        }

        return $this->respond([
            'status' => 200
        ]);
    }

    public function allincoming(){
        $decode         = $this->decodetoken();
        $facilityid = $this->facilityid($decode->id);

        return $this->respond([
            'status' => 200,
            'incoming'          => $this->referrals->where('referral_facility_id', $facilityid)->where('referral_status', 'ongoing')->select('referral_patient_name, referral_procedures, referral_id')->find(),
        ]);

    }

    public function settings(){
        
        $decode         = $this->decodetoken();
        $facilityid             = $this->users->select('facility_id')->asObject()->find($decode->id)->facility_id;
        $facilityinfo           = $this->facilities->where('facility_id', $facilityid)->asObject()->first();

        return $this->respond([
            'status'            => 200,
            'facilityinfo'      => $facilityinfo,
            'procedures'        => []
        ]);
    }

    public function addprocedure(){
        $decode         = $this->decodetoken();
        $facilityid             = $this->users->select('facility_id')->asObject()->find($decode->id)->facility_id;

        return $this->respond([
            'status'            => 200,
        ]);
    }

    public function transactions(){
        $decoded         = $this->decodetoken();
        $facilityid = $this->facilityid($decoded->id);
        $transactions = $this->transactions->select('transactions_patient_name, transactions_procedures, transactions_amount, transactions_amount_after, transactions_status')->where('transactions_facility_id', $facilityid)->orderby('transactions_id', 'DESC')->limit(200)->find();

        return $this->respond([
            'status' => 200,
            'transactions' => $transactions,
            'amountdue'           => $this->facilities->select('due_payment')->asObject()->find($facilityid)->due_payment
        ]);

    }

    public function notifications(){
        $decode         = $this->decodetoken();

        $notifications = $this->notifications->getnotifications($decode->id);
        return $this->respond([
            'status' => 200,
            'notifications' => $notifications
        ]);
    }

    private function getmyname($id){
        $username = $this->users->select('first_name, last_name')->asObject()->find($id);
        return $username->first_name.''.$username->last_name;
    }

    private function decodetoken(){
        return JWT::decode($this->request->getheaderLine('token'), new Key(getenv('JWT_SECRET'), 'HS256'));
    }

    private function facilityid($id){
        return $this->users->select('facility_id')->asObject()->find($id)->facility_id;
    }

}
