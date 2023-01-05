<?php

namespace App\Controllers;


use App\Models\MessagesModel;
use CodeIgniter\API\ResponseTrait;

class Home extends BaseController {

    use ResponseTrait;

    public function index() {

        $email = \Config\Services::email();
        $email->setTo('ackonugoodness@gmail.com');
        $email->setSubject("Welcome Message");
        $email->setMessage('Hello');

        if($email->send()){
            return 'Sent';
        } else {
            print_r(error_get_last());
            return 'Not';
        }
        // $email->setMessage($template);
        
        // set NODE_OPTIONS=--openssl-legacy-provider
        return view('welcome_message');
    }

    public function  sendmessage(){
    
        $model = new MessagesModel();

        $model->insert($this->request->getvar());

        return $this->respond([
            'status' => 200
        ]);


    }
}
