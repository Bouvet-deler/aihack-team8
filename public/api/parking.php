<?php
$url = 'https://opencom.no/dataset/36ceda99-bbc3-4909-bc52-b05a6d634b3f/resource/d1bdc6eb-9b49-4f24-89c2-ab9f5ce2acce/download/parking.json';
$json = file_get_contents($url);
header('Content-Type: application/json');
echo $json;
