<?php
$input = file_get_contents('php://input');
if ($input === false || $input === '') { http_response_code(400); exit; }

$ch = curl_init('https://api.entur.io/journey-planner/v3/graphql');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $input,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'ET-Client-Name: team8-stavanger-mobility',
    ],
    CURLOPT_TIMEOUT        => 10,
]);

$result = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($result === false) { http_response_code(502); exit; }

http_response_code($status);
header('Content-Type: application/json');
echo $result;
