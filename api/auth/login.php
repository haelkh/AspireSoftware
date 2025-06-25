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

if ($user->login()) {
    http_response_code(200);
    echo json_encode([
        'message' => 'Login successful.',
        'user' => [
            'id' => $user->id,
            'username' => $user->username,
            'role' => $user->role
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Login failed. Invalid credentials.']);
}
?> 