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
class Doctor extends BaseController {
    
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
        $stats = [
            'total'             => $this->referrals->where('referral_doctor_id', $decode->id)->countallresults(),
            'success'           => $this->referrals->where('referral_doctor_id', $decode->id)->where('referral_status', 'completed')->countallresults(),
            'pending'           => $this->referrals->where('referral_doctor_id', $decode->id)->where('referral_status', 'pending')->countallresults()
        ];

        $referrals = $this->referrals->select('referral_patient_name, referral_status, referral_mode')
                                     ->where('referral_date', date('Y-m-d'))
                                     ->where('referral_doctor_id', $decode->id)
                                     ->orderby('referral_id', 'DESC')->find();

        $this->notifications->markasread($decode->id, '/doctor');
        $this->notifications->markasread($decode->id, '/');

        return $this->respond([
            'status'            => 200,
            'verified'          => intval($this->accounts->select('verified')->asObject()->find($decode->id)->verified),
            'userdetails'       => $this->users->select('first_name, profile_picture, account_balance')->asObject()->find($decode->id),
            'stats'             => $stats,
            'referrals'         => $referrals
        ]);
    }

    public function fetchprocedures($procedure){
        $decode         = $this->decodetoken();
        $hospital = $this->users->select('hospital')->asObject()->find($decode->id)->hospital;
        if(!empty($hospital)){
            // $hospital = null;
            $hospital = explode(', ', $this->users->select('hospital')->asObject()->find($decode->id)->hospital);
        }
        return $this->respond([
            'status' => 200,
            'procedures' => $this->procedure->where('category', $procedure)->find(),
            'hospital'  => $hospital
        ]);
    }

    public function makereferral(){

        helper('text');
        $decode         = $this->decodetoken();

        $data = [
            'referral_uid'              => random_string('alnum', 20).substr(md5(microtime()), rand(0,26), 10),
            'referral_type'             => $this->request->getvar('proceduretype'),
            'referral_doctor_id'        => intval($decode->id),
            'referral_model'            => $this->request->getvar('mode'),
            'referral_doctor_hospital'  => $this->request->getvar('hospital'),
            'referral_patient_name'     => $this->request->getvar('patientname'),
            'referral_patient_age'      => $this->request->getvar('patientage'),
            'referral_patient_gender'   => $this->request->getvar('gender'),
            'referral_patient_contact'  => $this->request->getvar('patientcontact'),
            'referral_date'             => date('Y-m-d'),
            'referral_procedures'       => implode(', ', $this->request->getvar('procedure')),
            'referral_addition_notes'   => $this->request->getvar('additionalnotes'),
        ];

        $this->referrals->insert($data);
        $doctorname = $this->getmyname($decode->id);
        $this->notifications->sendnotification($decode->id, $data['referral_patient_name'].'\'s referral has been sent to Reef Med System', '/doctor/history', 'unread');
        $this->notifications->sendnotification(1, $doctorname.' referred '.$data['referral_patient_name'], '/admin/home', 'unread');

        return $this->respond([
            'status' => 200,
        ]);
    }

    // Database Name: medikafu_referal_med
    // Database Username: medikafui
    // Database Username: medikafui
    // Database Password: Tmorgyfb34
    // Url: nifty-haslett.51-210-240-92.plesk.page

    public function uploadpicture(){

        helper(['form', 'image', 'filesystem', 'text']);
        $validation =  \Config\Services::validation();
        $rules = [
            'file' => [
                'rules' => 'is_image[file]|uploaded[file]'
            ]
        ];

        if(!$this->validate($rules)){
            // $errors = $validation->listErrors('custom_list');
            return $this->respond([
                'status' => 203,
            ]);
        }
        $decode         = $this->decodetoken();

        if($this->request->getfile('file')){
            $data = [
                'referral_uid'              => random_string('alnum', 20).substr(md5(microtime()), rand(0,26), 10),
                'referral_doctor_id'        => intval($decode->id),
                'referral_mode'            => 'quick',
                'referral_patient_contact'  => '0'.$this->request->getvar('contact'),
                'referral_date'             => date('Y-m-d'),
            ];

            $path 	= './uploads/referralpictures/';
            $file = $this->request->getfile('file');
            $image = service('image');

            if($file->isValid() && !$file->hasMoved()){

                $newName = $file->getRandomName();
                $file->move($path, $newName);
                $fileName = $file->getName();

                $image->withFile(referralpics($fileName))
                      ->fit('600', '600', 'center')
                      ->save($path.'thumbs/'.$fileName);
                
                $data += [
                    'referral_slip_link' => $fileName
                ];
            }
            $this->referrals->insert($data);
            $doctorname = $this->getmyname($decode->id);
            $this->notifications->sendnotification($decode->id, 'Image referral has been sent to Reef Med System', '/doctor/history', 'unread');
            $this->notifications->sendnotification(1, $doctorname.' sent an image referral', '/admin/home', 'unread');
            return $this->respond([
                'status' => 200,
            ]);


        } else {
            return $this->respond([
                'status' => 202
            ]);
        }


        // return $this->respond([
        //     'status' => 200
        // ]);



        // // if ($decoded_string->isValid() && !$decoded_string->hasMoved()) {
        //     // $newName = $decoded_string->getRandomName();
        //     // $decoded_string->move($path, $newName);
        //     // $fileName = $decoded_string->getName();
        // // }

        // return $this->respond([
        //     'status' => 200
        // ]);

        // if(base64_decode($finalimage)->isValid()){
        //     return $this->respond([
        //         'status' => 200
        //     ]);
        // }



        // return $this->respond([
        //     'status' => 200,
        //     'data'  => $this->request->getvar('image'),
        //     'final' => $finalimage
        // ]);
    }

    public function getreports(){
        $decoded         = $this->decodetoken();

        $reports = $this->reports->select('report_id, report_procedure, referral_patient_name, referral_date')
                                 ->where('report_doctor_id', $decoded->id)
                                 ->where('report_status', 'complete')
                                 ->orderby('report_id', 'DESC')
                                 ->limit(200)
                                 ->join('referrals', 'referrals.referral_id = reports.report_referral_id')
                                 ->find();
        
        foreach ($reports as $key => $value) {
            $reports[$key]['date'] = date('jS F Y', strtotime($reports[$key]['referral_date']));
        }
        return $this->respond([
            'status' => 200,
            'reports' => $reports
        ]);
    }

    public function reportdetails($id){
        $reportdetails = $this->reports->select('report_id, report_procedure, referral_patient_gender, referral_patient_age, referral_patient_name, referral_date, report_image')->join('referrals', 'referrals.referral_id = reports.report_referral_id')->find($id);
        $decode         = $this->decodetoken();
        $this->notifications->markasread($id, '/doctor/reportsingle/'.$decode->id);
        return $this->respond([
            'status' => 200,
            'reportdetails' => $reportdetails
        ]);
    }

    public function mytransactions(){
        $decode         = $this->decodetoken();

        $transactions = $this->transactions->select('transactions_amount, transactions_amount_after, transactions_status, transactions_patient_name, transactions_date')->where('transactions_doctor_id', $decode->id)->orderby('transactions_id', 'DESC')->limit(50)->find();
        
        foreach ($transactions as $key => $value) {
            $transactions[$key]['month']     = date('M', strtotime($transactions[$key]['transactions_date']));
            $transactions[$key]['day']       = date('d', strtotime($transactions[$key]['transactions_date']));
            $transactions[$key]['year']      = date('Y', strtotime($transactions[$key]['transactions_date']));
        }

        return $this->respond([
            'status' => 200,
            'transactions' => $transactions
        ]);
    }

    public function history(){
        $decode         = $this->decodetoken();

        $history = $this->referrals->select('referral_patient_name, referral_procedures, referral_status, referral_doctor_earned, referral_date, referral_mode')->where('referral_doctor_id', $decode->id)->orderby('referral_id', 'DESC')->limit(40)->find();
        foreach ($history as $key => $value) {
            $history[$key]['month']     = date('M', strtotime($history[$key]['referral_date']));
            $history[$key]['day']       = date('d', strtotime($history[$key]['referral_date']));
            $history[$key]['year']      = date('Y', strtotime($history[$key]['referral_date']));
            if(intval($history[$key]['referral_doctor_earned']) == 0.00){
                $history[$key]['doctor_earned'] = null;
            } else {
                $history[$key]['doctor_earned'] = $history[$key]['referral_doctor_earned'];
            }
        }

        $this->notifications->markasread($decode->id, '/doctor/history');

        return $this->respond([
            'status' => 200,
            'history' => $history
        ]);

    }

    public function profile(){

        $decode         = $this->decodetoken();

        $info = $this->users->select('first_name, last_name, phone_number, profile_picture, account_balance, hospital')->asObject()->find($decode->id);
        $info->email = $this->accounts->select('email')->asObject()->find($decode->id)->email;
        if(empty($info->hospital)){
            $info->hospital = null;
        } else {
            $info->hospital = $info->hospital;
        }

        return $this->respond([
            'status' => 200,
            'info' => $info,
            'hospitals' => $this->hospital->findall()
        ]);
    }

    public function updateprofile(){
        $decode         = $this->decodetoken();

        $data = [
            'first_name'    => explode(' ', trim($this->request->getvar('name')))[0],
            'last_name'     => trim(strstr($this->request->getvar('name'), ' ')),
            'phone_number'  => $this->request->getvar('phonenumber'),
            'hospital'      => implode(', ', $this->request->getvar('hospital')),
        ];


        $this->users->update($decode->id, $data);

        return $this->respond([
            'status' => 200,
            'date' => $data
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

    
}
