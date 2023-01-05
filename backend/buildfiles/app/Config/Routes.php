<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (is_file(SYSTEMPATH . 'Config/Routes.php')) {
    require SYSTEMPATH . 'Config/Routes.php';
}

/*
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
// The Auto Routing (Legacy) is very dangerous. It is easy to create vulnerable apps
// where controller filters or CSRF protection are bypassed.
// If you don't want to define all routes, please use the Auto Routing (Improved).
// Set `$autoRoutesImproved` to true in `app/Config/Feature.php` and set the following to true.
// $routes->setAutoRoute(false);

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
$routes->get('/', 'Home::index');

$routes->group('api', function ($routes) {
    $routes->post('signup',                             'Auth::signup');
    $routes->post('signin',                             'Auth::signin');
    $routes->post('requestpasswordreset',               'Auth::requestpasswordreset');
    
    // Admin Routes
    $routes->group('admin', function ($routes){
        $routes->get('homepage',                        'Admin::homepage');
        $routes->get('referaldetails/(:any)',           'Admin::referaldetails/$1');
        $routes->get('facility',                        'Admin::centers');
        $routes->get('facilitypayment/(:any)/(:any)',   'Admin::facilitypayment/$1/$2');
        $routes->get('cancelreferral/(:any)',           'Admin::cancelreferral/$1');
        $routes->get('fetchdoctors',                    'Admin::fetchdoctors');
        $routes->get('restbalance/(:any)/(:any)',       'Admin::restbalance/$1/$2');
        $routes->post('addcenter',                      'Admin::addcenter');
        $routes->get('fetchprocedures/(:any)',          'Admin::fetchprocedures/$1');
        $routes->post('upgradequickreferral',           'Admin::upgradequickreferral');
        $routes->get('allprocedures',                   'Admin::allprocedures');
        $routes->get('procedurecomplete/(:any)',        'Admin::procedurecomplete/$1');
        $routes->post('addprocedure',                   'Admin::addprocedure');
        $routes->get('deleteprocedure/(:any)',          'Admin::deleteprocedure/$1');
        $routes->get('cancelreferral/(:any)',           'Admin::cancelreferral/$1');
        $routes->get('fetchcenters/(:any)',             'Admin::fetchcenters/$1');
        $routes->get('sendreferral/(:any)/(:any)',      'Admin::sendreferral/$1/$2');
        $routes->get('ongoingreferrals',                'Admin::ongoingreferrals');
        $routes->get('getupaidlist',                    'Admin::getupaidlist');
        $routes->get('paydoctor/(:any)/(:any)',         'Admin::paydoctor/$1/$2');
        $routes->get('notifications',                   'Admin::notifications');
    });


    // Doctor Routes
    $routes->group('doctor', function ($routes){
        $routes->get('homepage',                        'Doctor::homepage');
        $routes->get('mytransactions',                  'Doctor::mytransactions');
        $routes->get('fetchprocedures/(:any)',          'Doctor::fetchprocedures/$1');
        $routes->post('makereferral',                   'Doctor::makereferral');
        $routes->get('history',                         'Doctor::history');
        $routes->get('getreports',                      'Doctor::getreports');
        $routes->get('reportdetails/(:any)',            'Doctor::reportdetails/$1');
        $routes->get('profile',                         'Doctor::profile');
        $routes->post('updateprofile',                  'Doctor::updateprofile');
        $routes->post('uploadpicture',                  'Doctor::uploadpicture');
        $routes->get('notifications',                   'Doctor::notifications');
    });

    // Facility Routes
    $routes->group('facility', function ($routes){
        $routes->get('homepage',                        'Facility::homepage');
        $routes->get('allincoming',                     'Facility::allincoming');
        $routes->get('procedurecomplete/(:any)',        'Facility::procedurecomplete/$1');
        $routes->get('settings',                        'Facility::settings');
        $routes->get('pendingreports',                  'Facility::pendingreports');
        $routes->get('reportsdetails/(:any)',           'Facility::reportsdetails/$1');
        $routes->get('transactions',                    'Facility::transactions');
        $routes->post('addprocedure',                   'Facility::addprocedure');
        $routes->post('updatereport',                   'Facility::updatereport');
        $routes->get('notifications',                   'Facility::notifications');

    });
});

$routes->group('web', function ($routes) {
    $routes->get('verifyaccount/(:any)',                'Auth::verify/$1');
    $routes->post('activatefacility',                   'Auth::activatefacility');
    $routes->get('verifyresettoken/(:any)',             'Auth::verifyresettoken/$1');
    $routes->post('resetpassword',                      'Auth::resetpassword');
    $routes->post('sendmessage',                        'Home::sendmessage');
});
   


/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need it to be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */
if (is_file(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
    require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
