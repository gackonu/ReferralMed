<?php

namespace App\Models;

use CodeIgniter\Model;

class HospitalsModel extends Model
{
    protected $DBGroup              = 'default';
    protected $table                = 'hospitals';
    protected $primaryKey           = 'hospital_id';
    protected $useAutoIncrement     = true;
    protected $insertID             = 0;
    protected $returnType           = 'array';
    protected $useSoftDeletes       = false;
    protected $protectFields        = true;
    protected $allowedFields        = ['hospital_name', 'hospital_location_id', 'hospital_location'];

} 