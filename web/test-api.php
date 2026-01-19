<?php
// Полностью отключаем Yii для теста
session_write_close();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    echo json_encode([
        'success' => true,
        'message' => 'Direct test endpoint works!',
        'data_received' => $data,
        'timestamp' => time(),
        'headers' => [
            'content_type' => $_SERVER['CONTENT_TYPE'] ?? '',
            'request_method' => $_SERVER['REQUEST_METHOD'],
        ]
    ]);
    exit;
}

echo json_encode(['error' => 'Method not allowed']);