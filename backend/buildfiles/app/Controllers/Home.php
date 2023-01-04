<?php

namespace App\Controllers;

class Home extends BaseController
{
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
}
