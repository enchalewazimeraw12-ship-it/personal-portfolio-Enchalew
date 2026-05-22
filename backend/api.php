<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$path = __DIR__ . '/data.json';
if (!file_exists($path)) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "data.json not found"]);
    exit;
}

$json = file_get_contents($path);
if ($json === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Unable to read data.json"]);
    exit;
}

echo $json;
