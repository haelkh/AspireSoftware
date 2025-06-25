<?php
class Event {
    private $conn;
    private $table = 'events';

    // Event Properties
    public $id;
    public $title;
    public $date;
    public $location;
    public $description;
    public $status;

    // Constructor with DB
    public function __construct($db) {
        $this->conn = $db;
    }

    // Get Events
    public function read($userId = null) {
        // Create query
        if ($userId) {
            $query = 'SELECT e.id, e.title, e.date, e.location, e.description, COALESCE(eus.status, \'upcoming\') as status
                      FROM ' . $this->table . ' e
                      LEFT JOIN event_user_status eus ON e.id = eus.event_id AND eus.user_id = :userId
                      ORDER BY e.date DESC';
        } else {
            $query = 'SELECT id, title, date, location, description, \'upcoming\' as status 
                      FROM ' . $this->table . ' ORDER BY date DESC';
        }

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        if ($userId) {
            $stmt->bindParam(':userId', $userId);
        }

        // Execute query
        $stmt->execute();

        return $stmt;
    }
}
?> 