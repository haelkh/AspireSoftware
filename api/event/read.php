<?php
// Headers
include_once __DIR__ . '/../core/cors.php';
header('Content-Type: application/json');

include_once __DIR__ . '/../core/db_connect.php';
include_once __DIR__ . '/../models/Event.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

// Instantiate event object
$event = new Event($db);

// Event query
$result = $event->read();
// Get row count
$num = $result->rowCount();

// Check if any events
if ($num > 0) {
    // Events array
    $events_arr = array();
    $events_arr['data'] = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $event_item = array(
            'id' => $id,
            'title' => $title,
            'date' => $date,
            'location' => $location,
            'description' => $description,
            // For now, we hardcode a status. This will be dynamic later.
            'status' => 'upcoming'
        );

        // Push to "data"
        array_push($events_arr['data'], $event_item);
    }

    // Turn to JSON & output
    echo json_encode($events_arr);
} else {
    // No Events
    echo json_encode(
        array('message' => 'No Events Found')
    );
}
?> 