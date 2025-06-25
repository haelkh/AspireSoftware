<?php
include_once __DIR__ . '/../core/cors.php';
include_once __DIR__ . '/../core/db_connect.php';
include_once __DIR__ . '/../models/User.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->connect();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if (empty($data->username) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Username and password are required.']);
    exit;
}

$user->username = $data->username;
$user->password = $data->password;

try {
    if ($user->register()) {
        http_response_code(201);
        echo json_encode(['message' => 'User was registered.']);
    } else {
        http_response_code(503);
        echo json_encode(['message' => 'Unable to register user.']);
    }
} catch (PDOException $e) {
    // Check for duplicate entry
    if ($e->getCode() == 23000) {
        http_response_code(409); // Conflict
        echo json_encode(['message' => 'Username already exists.']);
    } else {
        http_response_code(503);
        echo json_encode(['message' => 'An internal error occurred.']);
    }
}
?> 