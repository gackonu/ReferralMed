<?php

namespace App\Controllers;

// Vendors
use \Firebase\JWT\JWT;
use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;

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

class Admin extends BaseController {

    use ResponseTrait;

    public function __construct(){
        $this->facilities           = new FacilitiesModel();
        $this->accounts             = new AccountsModel();
        $this->users                = new UsersModel();
        $this->verifications        = new VerificationModel();
        $this->procedures           = new ProceduresModel();
        $this->referrals            = new ReferralsModel();
        $this->hospital             = new HospitalsModel();
        $this->transactions         = new TransactionsModel();
        $this->reports              = new ReportsModel();
        $this->notifications        = new NotificationsModel();
    }

    public function homepage(){
        $stats = [
            'doctorpay'             => ($this->transactions->where('transactions_type', 'doctor')->where('transactions_status', 'unsettled')->select('transactions_amount')->selectsum('transactions_amount')->get()->getrow()->transactions_amount) - ($this->transactions->where('transactions_type', 'doctor')->where('transactions_status', 'settled')->select('transactions_amount')->selectsum('transactions_amount')->get()->getrow()->transactions_amount),
            'centerdue'             => ($this->transactions->where('transactions_type', 'facility')->where('transactions_status', 'unsettled')->select('transactions_amount')->selectsum('transactions_amount')->get()->getrow()->transactions_amount) - ($this->transactions->where('transactions_type', 'facility')->where('transactions_status', 'settled')->select('transactions_amount')->selectsum('transactions_amount')->get()->getrow()->transactions_amount)
        ];
        $this->notifications->markasread(1, '/admin/home');
        return $this->respond([
            'status'                => 200,
            'stats'                 => $stats,
            'pendingreferrals'      => $this->referrals->select('referral_id, referral_mode, referral_patient_name, referral_type, referral_procedures, referral_additional_notes, referral_patient_contact')->where('referral_status', 'pending')->find(),
            'ongoingreferrals'      => $this->referrals->where('referral_status', 'ongoing')->countallresults()
        ]);

        
    }

    public function referaldetails($id){
        $response = $this->referrals->select('referral_id, referral_slip_link, referral_patient_contact')->asObject()->find($id);
        $hospital = ($this->hospital->select('hospital_name')->findall());
        $i = 0;
        $hospitals = [];
        foreach ($hospital as $key => $value) {
            array_push($hospitals, $value['hospital_name']);
            $i++;
        }


        if(!empty($response)){
            return $this->respond([
                'status' => 200,
                'referraldets' => $response,
                'hospitals' => $hospitals
            ]);
        } else {
            return $this->respond([
                'status' => 204
            ]);
        }
    }

    public function sendreferral($procedureid, $facilityid){
        $this->referrals->update($procedureid, ['referral_facility_id' => $facilityid, 'referral_status' => 'ongoing']);


        $centeradminid = $this->getcenteradminid($facilityid);
        $doctorid = $this->referrals->select('referral_doctor_id')->asObject()->find($procedureid)->referral_doctor_id;
        $patientname = $this->referrals->select('referral_patient_name')->asObject()->find($procedureid)->referral_patient_name;

        $this->notifications->sendnotification($centeradminid, $patientname.' has been directed to your center', '/facility/referrals', 'unread');
        $this->notifications->sendnotification($doctorid, $patientname.' has been directed to center', '/doctor/history', 'unread');

        return $this->respond([
            'status' => 200
        ]);
    }

    public function procedurecomplete($id){
        
        $proceduredets = $this->referrals->select('referral_procedures, referral_doctor_id, referral_patient_name, referral_facility_id')->asObject()->find($id);
        $facilityid = intval($proceduredets->referral_facility_id);
        
        $ppr = intval($this->facilities->select('price_per_referral')->asObject()->find($facilityid)->price_per_referral);

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
                'report_referral_id' => $id,
                'report_facility_id'    => $facilityid,
                'report_doctor_id' => intval($proceduredets->referral_doctor_id),
                'report_procedure' => $item,
                'report_status' => $reportstart
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


        $centeradminid = $this->getcenteradminid($facilityid);
        $doctorid = $this->referrals->select('referral_doctor_id')->asObject()->find($id)->referral_doctor_id;
        $patientname = $this->referrals->select('referral_patient_name')->asObject()->find($id)->referral_patient_name;

        $this->notifications->sendnotification($centeradminid, $patientname.'\'s procedure has been marked as complete by admin', '/facility/completedreferrals', 'unread');
        $this->notifications->sendnotification($doctorid, $patientname.'\'s procedure has been marked as completed', '/doctor/history', 'unread');

        $this->transactions->insert($data);
        $this->referrals->update($id, ['referral_status' => 'completed']);
        $this->facilities->update($facilityid, ['due_payment' => $balanceafter]);
        $this->transactions->transComplete();
        return $this->respond([
            'status' => 200,
        ]);
    }

    public function cancelreferral($id){
        $this->referrals->update($id, ['referral_status' => 'cancelled']);
        $referraldetails = $this->referrals->select('referral_doctor_id, referral_patient_name, referral_facility_id')->asObject()->find($id);

        if(empty($referraldetails->referral_patient_name)){
            $message = 'Your image referral has been marked as unsuccessful by Reef Med';
        } else {
            $message = 'Your referral of '.$referraldetails->referral_patient_name.' was unsuccessful';
        }
        $this->notifications->sendnotification($referraldetails->referral_doctor_id, $message, '/doctor/history', 'unread');

        if(!empty($referraldetails->referral_facility_id)){
            $facilityamdin = $this->getcenteradminid($referraldetails->referral_facility_id);
            $this->notifications->sendnotification($facilityamdin, $referraldetails->referral_patient_name.'\'s referral to your center has been cancelled.');
        }

        
        return $this->respond([
            'status' => 200
        ]);
    }

    public function fetchprocedures($procedure){
        return $this->respond([
            'status' => 200,
            'procedures' => $this->procedures->where('category', $procedure)->find(),
        ]);
    }

    public function fetchdoctors(){
        $doctors = $this->users->where('facility_id', 0)->where('user_id !=', 1)->select('user_id, first_name, last_name, phone_number, profile_picture, account_balance')->find();
        $this->notifications->markasread(1, '/admin/doctors');
        return $this->respond([
            'status' => 200,
            'doctors' => $doctors
        ]);
    }

    public function restbalance($id, $amount){
        
        $doctorbalance =  intval($this->transactions->where('transactions_doctor_id', $id)
                                                    ->where('transactions_status', 'unsettled')
                                                    ->select('transactions_amount')
                                                    ->selectsum('transactions_amount')
                                                    ->get()
                                                    ->getrow()
                                                    ->transactions_amount) - 
                          intval($this->transactions->where('transactions_doctor_id', $id)
                                                    ->where('transactions_status', 'settled')
                                                    ->select('transactions_amount')
                                                    ->selectsum('transactions_amount')
                                                    ->get()
                                                    ->getrow()
                                                    ->transactions_amount);

        $doctornewbalance = $doctorbalance - $amount;

        $data = [
            'transactions_type' => 'doctor',
            'transactions_doctor_id' => $id,
            'transactions_amount' => intval($amount),
            'transactions_amount_after' => $doctornewbalance,
            'transactions_status' => 'settled'
        ];

        
        $this->transactions->insert($data);
        $this->notifications->sendnotification($id, 'Ghc '.$amount.' has been transferred from your Reef Med online wallet to your mobile device. Your balance after this transactions is Ghc '.$doctornewbalance, '/doctor/transcations', 'unread');
        $this->users->update($id, ['account_balance' => $doctornewbalance]);


        return $this->respond([
            'status' => 200
        ]);
    }

    public function getupaidlist(){
        $unpaidlist = $this->referrals->select('referral_id, referral_doctor_id, referral_patient_name, referral_pay, referral_procedures')->where('referral_status', 'completed')->where('referral_doctor_earned', 0.00)->find();

        return $this->respond([
            'status' => 200,
            'unpaidlist' => $unpaidlist
        ]);

    }

    public function upgradequickreferral(){
        $doctorid = $this->referrals->select('referral_doctor_id')->asObject()->find(intval($this->request->getvar('referralid')))->referral_doctor_id;
        $data = [
            'referral_type'             => $this->request->getvar('type'),
            'referral_doctor_hosptial'  => $this->request->getvar('hospital'),
            'referral_patient_name'     => $this->request->getvar('patientname'),
            'referral_patient_age'      => $this->request->getvar('patientage'),
            'referral_patient_gender'   => $this->request->getvar('gender'),
            'referral_procedures'       => implode(', ', $this->request->getvar('procedure')),
            'referral_additional_notes' => $this->request->getvar('additionalnotes'),
        ];

        $this->notifications->sendnotification($doctorid, 'Your image referral has been update. Patient Name is '.$data['referral_patient_name'].' and procedure(s) to be performed are '.$data['referral_procedures'], '/doctor/history', 'unread');
        $this->referrals->update(intval($this->request->getvar('referralid')), $data);

        return $this->respond([
            'status' => 200
        ]);
    }

    public function paydoctor($referralid, $amount){
        $referral_details = $this->referrals->select('referral_doctor_id, referral_patient_name')->asObject()->find($referralid);

        $id = $referral_details->referral_doctor_id;

        $doctorbalance =  intval($this->transactions->where('transactions_doctor_id', $id)
                                                    ->where('transactions_status', 'unsettled')
                                                    ->select('transactions_amount')
                                                    ->selectsum('transactions_amount')
                                                    ->get()
                                                    ->getrow()
                                                    ->transactions_amount) - 
                          intval($this->transactions->where('transactions_doctor_id', $id)
                                                    ->where('transactions_status', 'settled')
                                                    ->select('transactions_amount')
                                                    ->selectsum('transactions_amount')
                                                    ->get()
                                                    ->getrow()
                                                    ->transactions_amount);

        $doctornewbalance = $doctorbalance + $amount;

        $data = [
            'transactions_type' => 'doctor',
            'transactions_doctor_id' => $id,
            'referral_patient_name' => $referral_details->referral_patient_name,
            'transactions_amount' => intval($amount),
            'transactions_amount_after' => $doctornewbalance,
            'transactions_status' => 'unsettled'
        ];

        
        $this->transactions->insert($data);
        $this->users->update($id, ['account_balance' => $doctornewbalance]);
        $this->referrals->update($referralid, ['referral_doctor_earned' => intval($amount)]);

        $this->notifications->sendnotification($id, 'You have been paid Ghc '.$amount.' for your successful referral of '.$data['referral_patient_name'].' your balance after this transaction is '.$data['transactions_amount_after'], '/doctor/transcations', 'unread');

        return $this->respond([
            'status' => 200
        ]);
    }

    public function centers() {
        $centercount = [
            'labs'          => $this->getfacilitycount('lab'),
            'scan'          => $this->getfacilitycount('Scan'),
            'logisitics'    => $this->getfacilitycount('Logistics'),
        ];

        $centers = $this->facilities->orderby('facility_id ', 'DESC')->asObject()->findall();

        return $this->respond([
            'status' => 200,
            'center' => $centers,
            'count' => $centercount
        ]);
    }

    public function facilitypayment($centerid, $amount){
        $amount     = intval($amount);
        $centerid   = intval($centerid);
        $currentbalance =  $this->transactions->select('transactions_amount')
                                            ->where('transactions_facility_id', $centerid)
                                            ->where('transactions_status', 'unsettled')
                                            ->selectsum('transactions_amount')
                                            ->get()
                                            ->getrow()
                                            ->transactions_amount - 
                         $this->transactions->select('transactions_amount')
                                            ->where('transactions_facility_id', $centerid)
                                            ->where('transactions_status', 'settled')
                                            ->selectsum('transactions_amount')
                                            ->get()
                                            ->getrow()
                                            ->transactions_amount;

        $data = [
            'transactions_type'         => 'facility',
            'transactions_facility_id'  => $centerid,
            'transactions_amount'       => $amount,
            'transactions_amount_after' => $currentbalance - $amount,
            'transactions_status'       => 'settled'
        ];
        
        $facilityadminid = $this->getcenteradminid($centerid);
        $this->notifications->sendnotification($facilityadminid, 'Your facility paid Ghc '.$amount.' to Reef Med. Arrears after this transaction is Ghc '.$data['transactions_amount_after'], '/facility/transactions', 'unread');
        $this->transactions->insert($data);
        $this->facilities->update($centerid, ['due_payment' => $currentbalance - $amount]);

        return $this->respond([
            'status' => 200
        ]);
    }

    public function addcenter(){
        helper('text');
        $validation =  \Config\Services::validation();

        $rules = [
            'adminemail' => [
                'rules' => 'required|is_unique[accounts.email]',
                'errors' => [
                    'is_unique' => 'Email already taken'
                ]
            ]
        ];

        if(!$this->validate($rules)){
            return $this->respond([
                'status' => 403
            ]);
        }


        $data = [
            'name'                  => $this->request->getvar('name'),
            'type'                  => $this->request->getvar('type'),
            'location'              => $this->request->getvar('location'),
            'contact'               => $this->request->getvar('contact'),
            'price_per_referral'    => $this->request->getvar('priceperreferral'),
            'email'                 => $this->request->getvar('adminemail'),
            'token'                 =>  random_string('alnum', 20).substr(md5(microtime()), rand(0,26), 10),
            'role'                  => 'facility'
        ];

        
        $this->facilities->transStart();
            $this->facilities->insert($data);
            $this->accounts->insert($data);
            $this->verifications->insert($data);


            $email = \Config\Services::email();
            $email->setTo($data['email']);
            $email->setSubject("Facility Registered");
            $template = view("emailtemplates/facilityregistered", [
                'baseurl'       => base_url(), 
                'frontendurl'   => getenv('frontendurl'),
                'token'         => $data['token']
            ]);
            $email->setMessage($template);

            if($email->send()){
            // if(1){
            $this->facilities->transComplete();
            $facilitydetails = $this->facilities->where('name', $data['name'])->asObject()->first();
            $details = [
                'facility_id' => $facilitydetails->facility_id,
            ];
            $this->users->insert($details);
            }
            
            return $this->respond([
                'status' => 200
            ]);


        
    }

    public function allprocedures(){
        $procedures = $this->procedures->orderby('category')->findall();
        if(!empty($procedures)){
            return $this->respond([
                'status' => 200,
                'procedures' => $procedures
            ]);
        } 

        return $this->respond([
            'status' => 204
        ]);
        
    }

    public function addprocedure(){
        $validation =  \Config\Services::validation();

        $rules = [
            'name' => [
                'rules' => 'is_unique[procedures.name]'
            ]
        ];

        if(!$this->validate($rules)){
            return $this->respond([
                'status' => 304
            ]);
        }


        $data = [
            'name' => $this->request->getvar('procedure'),
            'category'  => $this->request->getvar('category')
        ];
        $this->procedures->insert($data);

        return $this->respond([
            'status' => 200
        ]);

    }

    public function deleteprocedure($id){
        $this->procedures->delete($id);
        return $this->respond([
            'status' => 200
        ]);
    }

    public function fetchcenters($type){
        $facilities = $this->facilities->where('type', $type)->findall();

        return $this->respond([
            'status' => 200,
            'type' => ucfirst($type),
            'facilities' => $facilities
        ]);

    }

    public function ongoingreferrals(){
        $ongoingreferral = $this->referrals->select('referral_id, referral_patient_name, referral_doctor_hospital, referral_patient_contact, referral_procedures, name, location, contact')->where('referral_status', 'ongoing')->join('facilities', 'referrals.referral_facility_id = facilities.facility_id')->find();
        return $this->respond([
            'status' => 200,
            'ongoingreferrals' => $ongoingreferral
        ]); 
    }

    public function notifications(){

        $notifications = $this->notifications->getnotifications(1);
        return $this->respond([
            'status' => 200,
            'notifications' => $notifications
        ]);

    }

    // Private Functions
    // Private Functions

    private function getcenteradminid($facilityid){
       return $this->users->select('user_id')->where('facility_id', $facilityid)->asObject()->first()->user_id;
    }

    private function getmyname($id){
        $username = $this->users->select('first_name, last_name')->asObject()->find($id);
        return $username->first_name.''.$username->last_name;
    }

    private function getfacilitycount($facilitytype){
        return $this->facilities->where('type', $facilitytype)->countallresults();
    }

    private function sendnotification(){
        
    }
}
