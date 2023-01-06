<?php

namespace App\Controllers;


use App\Models\MessagesModel;
use CodeIgniter\API\ResponseTrait;

class Home extends BaseController {

    use ResponseTrait;

    public function index() {
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
