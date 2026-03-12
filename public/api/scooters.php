<?php
$allowed_operators = [
    'voi'  => 'https://api.entur.io/mobility/v2/gbfs/v3/voistavanger/vehicle_status',
    'ryde' => 'https://api.entur.io/mobility/v2/gbfs/v3/rydestavanger/vehicle_status',
];

$path_info = trim($_SERVER['PATH_INFO'] ?? '', '/');

if (!isset($allowed_operators[$path_info])) {
    http_response_code(400);
    exit;
}

$url    = $allowed_operators[$path_info];
$result = @file_get_contents($url);

if ($result === false) { http_response_code(502); exit; }

header('Content-Type: application/json');
echo $result;
