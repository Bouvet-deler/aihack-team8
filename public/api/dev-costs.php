<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');
readfile(__DIR__ . '/../dev-costs.json');
