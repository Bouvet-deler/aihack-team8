<?php
$url = 'https://opencom.no/dataset/3e1b1ea2-1155-4058-8f92-8cbc9f547e72/resource/d0023623-128b-4a4a-be9b-cd8419cd3120/download/citybikesstvg_entur_processed.json';
$json = file_get_contents($url);
header('Content-Type: application/json');
echo $json;
