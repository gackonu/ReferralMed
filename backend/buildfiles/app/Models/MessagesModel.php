<?php

namespace App\Models;

use CodeIgniter\Model;

class MessagesModel extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'messages';
    protected $primaryKey       = 'message_id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'name',
        'subject',
        'email',
        'message'
    ];


}
