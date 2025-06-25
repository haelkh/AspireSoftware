<?php
class User {
    private $conn;
    private $table = 'users';

    public $id;
    public $username;
    public $password;
    public $role;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Register User
    public function register() {
        $query = 'INSERT INTO ' . $this->table . ' SET username = :username, password_hash = :password_hash, role = :role';

        $stmt = $this->conn->prepare($query);

        // Sanitize data
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->role = 'user'; // Default role

        // Hash password
        $password_hash = password_hash($this->password, PASSWORD_BCRYPT);

        // Bind data
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':password_hash', $password_hash);
        $stmt->bindParam(':role', $this->role);

        if ($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    // Login User
    public function login() {
        $query = 'SELECT id, username, password_hash, role FROM ' . $this->table . ' WHERE username = :username LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $this->username);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($this->password, $user['password_hash'])) {
            $this->id = $user['id'];
            $this->role = $user['role'];
            return true;
        }

        return false;
    }
}
?> 