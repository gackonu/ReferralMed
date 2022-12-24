<?php

namespace App\Models;

use CodeIgniter\Model;

class NotificationsModel extends Model
{
    protected $DBGroup              = 'default';
    protected $table                = 'notifications';
    protected $primaryKey           = 'notification_id';
    protected $useAutoIncrement     = true;
    protected $insertID             = 0;
    protected $returnType           = 'array';
    protected $useSoftDeletes       = false;
    protected $protectFields        = true;
    protected $allowedFields        = [
        'notification_reciever_id',
        'notification_message',
        'notification_link',
        'notification_status'
    ];

    // Dates
    protected $useTimestamps        = false;
    protected $dateFormat           = 'datetime';
    protected $createdField         = 'created_at';
    protected $updatedField         = 'updated_at';
    protected $deletedField         = 'deleted_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks       = true;
    protected $beforeInsert         = [];
    protected $afterInsert          = [];
    protected $beforeUpdate         = [];
    protected $afterUpdate          = [];
    protected $beforeFind           = [];
    protected $afterFind            = [];
    protected $beforeDelete         = [];
    protected $afterDelete          = [];

    public function sendnotification($reciever, $message, $link, $status){
        $data = [
            'notification_reciever_id' => $reciever,
            'notification_message' => $message,
            'notification_link' => $link,
            'status' => $status
        ];
        $this->insert($data);
        return;
    }

    public function getnotifications($id){
        return $this->where('notification_reciever_id', $id)->select('notification_message, notification_date, notification_status, notification_link')->orderby('notification_id', 'DESC')->limit(60)->find();
    }

    public function markasread($id, $link){
        $this->db->table('notifications')->where('notification_reciever_id', $id)->where('notification_link', $link)->set(['notification_status' => 'read'])->update();
    }

}
