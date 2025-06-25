<?php
include_once __DIR__ . '/../core/cors.php';
include_once __DIR__ . '/../core/db_connect.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->connect();

$data = json_decode(file_get_contents("php://input"));

if (
    !isset($data->userId) ||
    !isset($data->eventId) ||
    !isset($data->status)
) {
    http_response_code(400);
    echo json_encode(['message' => 'User ID, Event ID, and status are required.']);
    exit;
}

$userId = $data->userId;
$eventId = $data->eventId;
$status = $data->status;

// Validate status
$allowed_statuses = ['attending', 'maybe', 'declined'];
if (!in_array($status, $allowed_statuses)) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid status.']);
    exit;
}

$query = "INSERT INTO event_user_status (user_id, event_id, status) 
          VALUES (:user_id, :event_id, :status)
          ON DUPLICATE KEY UPDATE status = :status";

$stmt = $db->prepare($query);

$stmt->bindParam(':user_id', $userId);
$stmt->bindParam(':event_id', $eventId);
$stmt->bindParam(':status', $status);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(['message' => 'Event status updated successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to update event status.']);
}
?> 