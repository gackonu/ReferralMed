<?php

namespace App\Models;

use CodeIgniter\Model;

class ReferralsModel extends Model
{
    protected $DBGroup              = 'default';
    protected $table                = 'referrals';
    protected $primaryKey           = 'referral_id';
    protected $useAutoIncrement     = true;
    protected $insertID             = 0;
    protected $returnType           = 'array';
    protected $useSoftDeletes       = false;
    protected $protectFields        = true;
    protected $allowedFields        = [
        'referral_uid',
        'referral_type',
        'referral_mode',
        'referral_doctor_id',
        'referral_doctor_hospital',
        'referral_patient_name',
        'referral_patient_age',
        'referral_patient_gender',
        'referral_patient_contact',
        'referral_procedures',
        'referral_additional_notes',
        'referral_facility_id',
        'referral_status',
        'referral_pay',
        'referral_slip_link',
        'referral_doctor_earned',
        'referral_date',
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
}
