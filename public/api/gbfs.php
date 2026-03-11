<?php
$allowed_operators = ['oslobysykkel.no', 'bergenbysykkel.no', 'trondheimbysykkel.no'];
$allowed_feeds     = ['station_information.json', 'station_status.json'];

$path_info = trim($_SERVER['PATH_INFO'] ?? '', '/');
$parts     = explode('/', $path_info);

if (count($parts) !== 2) { http_response_code(400); exit; }
[$operator, $feed] = $parts;

if (!in_array($operator, $allowed_operators, true) || !in_array($feed, $allowed_feeds, true)) {
    http_response_code(400);
    exit;
}

$url    = "https://gbfs.urbansharing.com/{$operator}/{$feed}";
$result = file_get_contents($url);

if ($result === false) { http_response_code(502); exit; }

header('Content-Type: application/json');
echo $result;
