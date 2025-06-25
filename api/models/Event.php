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

    // Constructor with DB
    public function __construct($db) {
        $this->conn = $db;
    }

    // Get Events
    public function read() {
        // Create query
        $query = 'SELECT id, title, date, location, description FROM ' . $this->table . ' ORDER BY date DESC';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        return $stmt;
    }
}
?> 