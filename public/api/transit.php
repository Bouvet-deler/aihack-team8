<?php
$body = file_get_contents('php://input');
$ch = curl_init('https://api.entur.io/journey-planner/v3/graphql');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'ET-Client-Name: team8-stavanger-mobility',
]);
$result = curl_exec($ch);
curl_close($ch);
header('Content-Type: application/json');
echo $result;
