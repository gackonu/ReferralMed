<?php 

namespace App\validation;

use App\Models\AccountsModel;


class Passwords {

    public function verify_password(string $str, string $fields, array $data){
    
        $accounts_model = new AccountsModel();
        $account_information = $accounts_model->getAccountInformation('email', $data['email']);

        if(!$account_information){
            return false;
        }

        return password_verify($data['password'], $account_information->account_password);


    }

}