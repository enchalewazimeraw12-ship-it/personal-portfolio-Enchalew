<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$file = dirname(__DIR__, 2) . '/backend/profile.json';

if (file_exists($file)) {
    echo file_get_contents($file);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'profile.json not found']);
}
