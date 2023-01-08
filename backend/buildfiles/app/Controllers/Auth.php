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
use App\Models\NotificationsModel;
use App\Models\Resetpassword;

class Auth extends BaseController{
    
    use ResponseTrait;

    public function __construct(){
        $this->accounts         = new AccountsModel();
        $this->users            = new UsersModel();
        $this->verifications    = new VerificationModel();
        $this->facilities       = new FacilitiesModel();
        $this->notifications    = new NotificationsModel();
        $this->resetpassword    = new Resetpassword();
    }


    public function signup(){
        helper('text');
        


        $validation =  \Config\Services::validation();
        $rules = [
            'fullname' => [
                'rules' => 'required|min_length[6]|max_length[30]|alpha_space',
                'errors' => [
                    'required' => 'Your name is required',
                    'alpha_space' => 'Name contains unsupported characters.'
                ]
            ],
            'phonenumber' => [
                'rules' => 'required|min_length[10]|is_natural',
                'errors' => [
                    'is_natural' => 'Phone number should be only digits.'
                ]
            ],
            'email' => [
                'rules' => 'required|is_unique[accounts.email]',
                'errors' => [
                    'is_unique' => 'Email already taken.'
                ]
            ],
            'password' => [
                'rules' => 'required|min_length[6]|max_length[20]'
            ],

            'cpassword' => [
                'rules' => 'matches[password]',
                'errors' => [
                    'matches' => 'Passwords do not match.'
                ]
            ]
        ];

        if(!$this->validate($rules)){

            $errors = [];
            
            if ($validation->hasError('email')) {
                $errors += [$validation->getError('email')];
            }

            if ($validation->hasError('cpassword')) {
                $errors += [$validation->getError('cpassword')];
            }
            
            if($validation->hasError('phonenumber')){
                $errors += [$validation->getError('phonenumber')];
            }

            return $this->respond([
                'status' => 'validationerror',
                'errors' => $errors
            ]);
        }


        $data = [
            'first_name'    => explode(' ', trim($this->request->getvar('fullname')))[0],
            'last_name'     => strstr($this->request->getvar('fullname'), ' '),
            'phone_number'  => $this->request->getvar('phonenumber'),
            'email'         => $this->request->getvar('email'),
            'password'      => password_hash($this->request->getvar('password'), PASSWORD_DEFAULT),
            'token'         =>  random_string('alnum', 20).substr(md5(microtime()), rand(0,26), 10),
            'health_worker' => $this->request->getvar('healthworker')
        ];
        
        
            $this->accounts->transStart();
                $this->accounts->insert($data);
                $this->users->insert($data);
                $this->verifications->insert($data);
                
                
                $email = \Config\Services::email();
                $email->setTo($data['email']);
                $email->setSubject("Welcome Message");
                // $email->setMessage('Hello');
                $template = view("emailtemplates/signupsuccessful", [
                    'name'          => $data['first_name'], 
                    'baseurl'       => 'https://reefapp.xyz',
                    'frontendurl'   => getenv('frontendurl'),
                    'token'         => $data['token']
                ]);
                $email->setMessage($template);

                

            if ($email->send()) {
            // if (1) {
                
                $accountdets = $this->accounts->where('email', $data['email'])->asObject()->first();
                $key = getenv('JWT_SECRET');
                $ait = time();
                $nbf = $ait + 0;
                $exp = $ait + 1;
                $payload = [
                    'iss' => 'Referral Med App',
                    'aud' => 'doctor',
                    'ait' => $ait,
                    'nbf' => $nbf,
                    'exp' => $exp,
                    'id'  => $accountdets->account_id
                ];

                $token = JWT::encode($payload, $key, 'HS256');
                $this->notifications->sendnotification($accountdets->account_id, 'Welcome to Referral Med. Please verify your email for full access to your wallet', '/doctor' , 'unread');
                $this->notifications->sendnotification(1, $data['first_name'].' '.$data['last_name'].' created a new account. Awaiting Email Verification', '/admin/doctors', 'unread');
                $this->accounts->transComplete();
                return $this->respond([
                    'status' => 200,
                    'token' => $token
                ]);
            } else {
                return $this->respond([
                    'status' => 400,
                    'message' => 'Something Went Wrong. Please try again later'
                ]);
            }
    }

    public function signin(){
        $accountdets = $this->accounts->where('email', $this->request->getvar('email'))->asObject()->first();
        if(empty($accountdets)){
            $response = [
                'status' => 'error',
                'message' => 'Incorrect Email or Password Combination'
            ];
        } else {

            if(!password_verify($this->request->getvar('password'), $accountdets->password)){
                $response = [
                    'status' => 'error',
                    'message' => 'Incorrect Email or Password Combination'
                ];
            } else {
                $key = getenv('JWT_SECRET');
                $ait = time();
                $nbf = $ait + 0;
                $exp = $ait + 1;
                $payload = [
                    'iss' => 'Referral Med App',
                    'aud' => $accountdets->role,
                    'ait' => $ait,
                    'nbf' => $nbf,
                    'exp' => $exp,
                    'id'  => $accountdets->account_id
                ];

                $token = JWT::encode($payload, $key, 'HS256');
                $response = [
                    'status' => 'success',
                    'token' => $token
                ];

            }
        }
        return $this->respond($response, 200);
    }

    public function verify($token){

        $verification = $this->verifications->where('token', $token)->asObject()->first();
        
        if(!empty($verification)){
            
            if($verification->role == 'facility'){
                if($verification->status == 0){
                    $facilitydets = $this->users->select('facility_id')->where('user_id', $verification->id)->asObject()->first()->facility_id;
                    return $this->respond([
                        'status' => 202,
                        'details' => $this->facilities->asObject()->find($facilitydets)
                    ]);
                } else {
                    return $this->respond([
                        'status' => 200,
                        'heading' => 'Email Verification. Status: <span>Active</span>',
                        'message' => 'Hello '.$this->users->select('first_name')->where('user_id', $verification->id)->asObject()->first()->first_name.'. Your email has already been verified and your facility is active. You now have full access to all products and features available to this service. We are extremely excited to have you on board and hope to increase your revenue with our services. For further questions or enquiries, kindly reach us on 0555229204'
                    ]);
                }
            }

            if($verification->status == 0){
                $this->accounts->update($verification->id, ['verified' => true]);
                $this->verifications->update($verification->id, ['status' => true]);
                $userdetails = $this->users->select('first_name, last_name')->asObject()->find($verification->id);
                $this->notifications->sendnotification($verification->id, 'Your email has been successfully verified. You have full access to your wallet now', '/doctor', 'unread');
                $this->notifications->sendnotification(1, $userdetails->first_name.' '.$userdetails->last_name.' successfully verified his/her email', '/admin/doctors', 'unread');
                return $this->respond([
                    'status'    => 200,
                    'message' => 'Hello '.$this->users->select('first_name')->where('user_id', $verification->id)->asObject()->first()->first_name.'. Your email has succefully been verified. You now have full access to all products and features availble to this service. We are extremely excited to have you on board and hope to easy your patient referral process. For further questions or enquiries, kindly reach us on 0555229204',                    
                    'heading' => 'Email Verification. Status: <span>Successful</span>',
                ]);
            } else {
                return $this->respond([
                    'status' => 200,
                    'heading' => 'Email Verification. Status: <span>Active</span>',
                    'message' => 'Hello '.$this->users->select('first_name')->where('user_id', $verification->id)->asObject()->first()->first_name.'. Your email has already been verified. You have full access to all products and features availble to this service. We hope you\'re having a pleasant time on our app. For further questions or enquiries, kindly reach us on 0555229204'
                ]);
            }
        } else {
            return $this->respond([
                'status' => 200, 
                'heading' => 'Invalid or Expired Activation Code',
                'message' => 'Sorry, Invalid email activation link. Please check and try again. For further questions or enquiries, kindly reach us on 0555229204'
            ]);
        }
        
    }

    public function activatefacility(){
        $token = $this->request->getvar('token');
        $verification = $this->verifications->where('token', $token)->asObject()->first();

        $validation =  \Config\Services::validation();

        if($verification->role == 'facility'){

            if($verification->status == 0){
                $rules = [
                    'confirmpassword' => [
                        'rules' => 'matches[password]',
                        'errors' => [
                            'matches' => 'Passwords do not match.'
                        ]
                    ]
                ];
    
                if(!$this->validate($rules)){
                    $errors = $validation->listErrors('custom_list');
                    return $this->respond([
                        'status' => 'validationerror',
                        'errors' => explode('.',trim(preg_replace('/\t+/', '', $errors)))
                    ]);
                }
                $data = [
                    'first_name' => $this->request->getvar('firstname'),
                    'last_name' => $this->request->getvar('lastname'),
                    'phone_number' => $this->request->getvar('phonenumber'),
                    'password' => password_hash($this->request->getvar('password'), PASSWORD_DEFAULT),
                    'verified' => true,
                    'status' => 'active'
                ];

                $this->users->transStart();
                    $this->users->update($verification->id, $data);
                    $this->accounts->update($verification->id, $data);
                    $this->verifications->update($verification->id, ['status' => 1]);
                $this->users->transComplete();

                return $this->respond([
                    'status' => 200,
                    'heading' => 'Email Verification. Status: <span>Successful</span>',
                    'message' => 'Hello '.$this->users->select('first_name')->where('user_id', $verification->id)->asObject()->first()->first_name.'. Your email has been verified successfully and your facility is now active. You now have full access to all products and features available to this service. We are extremely excited to have you on board and hope to increase your revenue with our services. For further questions or enquiries, kindly reach us on 0555229204'
                ]);
            } else {
                return $this->respond([
                    'status' => 200,
                    'heading' => 'Email Verification. Status: <span>Actived</span>',
                    'message' => 'Hello '.$this->users->select('first_name')->where('user_id', $verification->id)->asObject()->first()->first_name.'. Your email has already been verified and your facility is already active. You now have full access to all products and features available to this service. We are extremely excited to have you on board and hope to increase your revenue with our services. For further questions or enquiries, kindly reach us on 0555229204'
                ]);
            }
        }

        return $this->respond([
            'status' => 200,
            'heading' => 'Success',
            'message' => 'Action was successful. For further questions or enquiries, kindly reach us on 0555229204 '
        ]);
    }

    public function requestpasswordreset(){
        $email = $this->request->getvar('email');
        $userdetails = $this->accounts->where('email', $email)->asObject()->first();

        if(empty($userdetails)){
            return $this->respond([
                'status' => 201,
                'message' => 'Sorry, email unknown. Please check and try again'
            ]);
        }

        helper('text');
        $username = $this->users->where('user_id', $userdetails->account_id)->select('first_name')->asObject()->first()->first_name;
        if(!empty($this->resetpassword->where('user_email', $email)->asObject()->first())){
            $token = $this->resetpassword->where('user_email', $email)->asObject()->first();
            $data = [
                'date_requested' => date('Y-m-d')
            ];
            $this->resetpassword->update($token->reset_password_id, $data);
        } else {
            $token = random_string('alnum', 20).substr(md5(microtime()), rand(0,26), 10);
            $data = [
                'user_email' => $email,
                'reset_token' => $token,
                'user_id' => $userdetails->account_id
            ];
            $this->resetpassword->insert($data);
        }

        $email = \Config\Services::email();
        $email->setTo($this->request->getvar('email'));
        $email->setSubject("Reset Password");
        $template = view("emailtemplates/resetpassword", [
            'name'          => $username, 
            'baseurl'       => base_url(), 
            'frontendurl'   => getenv('frontendurl'),
            'token'         => $token->reset_token
        ]);
        $email->setMessage($template);

        if ($email->send()) {
        // if (1) {
            return $this->respond([
                'status' => 200,
                'name' => $username
            ]);
        }

    }

    public function verifyresettoken($token){
        $verification = $this->resetpassword->where('reset_token', $token)->asObject()->first();
        if(!empty($verification)){
            if(date('Y-m-d') < date('Y-m-d', strtotime('+1 day', strtotime($verification->date_requested)))){
                $userdetails = $this->users->select('first_name, last_name')->asObject()->find($verification->user_id);
                return $this->respond([
                    'status' => 202,
                    'userdetails' => $userdetails
                ]);
            } else {
                return $this->respond([
                    'status' => 200,
                    'heading' => 'Error',
                    'message' => 'Sorry, Validation token is invalid or expired'
                ]);
            }
            exit();
        } else {
            return $this->respond([
                'status' => 200,
                'heading' => 'Error',
                'message' => 'Sorry, Validation token is invalid or expired'
            ]);
        }
    }

    public function resetpassword(){
        $rules = [
            'confirmpassword' => [
                'rules' => 'matches[password]',
                'errors' => [
                    'matches' => 'Passwords do not match.'
                ]
            ]
        ];
        $validation =  \Config\Services::validation();
        if(!$this->validate($rules)){
            $errors = $validation->listErrors('custom_list');
            return $this->respond([
                'status' => 'validationerror',
                'errors' => explode('.',trim(preg_replace('/\t+/', '', $errors)))
            ]);
        }

        $token = $this->request->getvar('token');
        $user = $this->resetpassword->where('reset_token', $token)->asObject()->first();
        $this->notifications->sendnotification($user->user_id, 'You successfully reset your password.', '/', 'read');
        $this->accounts->update($user->user_id, ['password' => password_hash($this->request->getvar('password'), PASSWORD_DEFAULT)]);
        $this->resetpassword->delete($user->reset_password_id);

        return $this->respond([
            'status' => 200,
            'heading' => 'Password Rest',
            'message' => 'Password Reset Successfully. You can now login to your account with your new password'
        ]);
    }


}
