# Event Scheduler

A web application for scheduling and managing events with an AI-powered feature to simplify event creation.

## Features

- **User Authentication:** Secure registration and login system for users.
- **Event Management:** Create, view, and manage your events.
- **AI-Powered Event Creation:** Automatically parse event details from a simple text description.
- **Summarize with AI:** Generate a summary for long event descriptions.
- **Dashboard View:** See all your upcoming events at a glance.
- **Responsive Design:** The application is usable on different screen sizes.

## Tech Stack

- **Frontend:** Angular
- **Backend:** PHP
- **Database:** MySQL
- **Web Server:** Apache (usually bundled with XAMPP/WAMP)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **XAMPP (or equivalent):** A web server solution that includes Apache, MySQL, and PHP. You can download it from [apachefriends.org](https://www.apachefriends.org).
- **Node.js and npm:** Required for the Angular frontend. You can download it from [nodejs.org](https://nodejs.org).
- **Angular CLI:** The command-line interface for Angular. Install it globally using npm:
  ```bash
  npm install -g @angular/cli
  ```

## Installation and Setup

Follow these steps to get the application up and running on your local machine.

### 1. Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Move to `htdocs`:**
    Move the entire project folder into the `htdocs` directory of your XAMPP installation (e.g., `C:/xampp/htdocs/`).

3.  **Start XAMPP:**
    Open the XAMPP Control Panel and start the **Apache** and **MySQL** modules.

4.  **Create the Database:**

    - Open your web browser and go to `http://localhost/phpmyadmin`.
    - Create a new database named `event_scheduler`.
    - Select the `event_scheduler` database and go to the **Import** tab.
    - Click **Choose File** and select the `schema.sql` file from the root of the project directory.
    - Click **Go** to import the database schema.

5.  **Configure Database Connection:**
    - Open the file `api/config/database.php`.
    - Update the database credentials if they are different from the default XAMPP settings.
    ```php
    // api/config/database.php
    class Database {
        private $host = "localhost";
        private $db_name = "event_scheduler";
        private $username = "root"; // Your MySQL username
        private $password = "";     // Your MySQL password
        public $conn;
        // ...
    }
    ```

### 2. Frontend Setup

1.  **Navigate to Project Directory:**
    Open a terminal or command prompt and navigate to the project's root directory.

2.  **Install Dependencies:**
    Run the following command to install all the necessary frontend packages.

    ```bash
    npm install
    ```

3.  **Run the Development Server:**
    Start the Angular development server.

    ```bash
    ng serve
    ```

4.  **Access the Application:**
    Open your web browser and navigate to `http://localhost:4200/`. The application should now be running.

## How to Use the Application

### Registration

1.  Click on the **Sign Up** button on the toolbar.
2.  Fill in the registration form with your details (username, email, password).
3.  Click **Sign Up**.

### Login

1.  Click on the **Login** button on the toolbar.
2.  Enter your registered email and password.
3.  Click **Login**.

### User Roles

The application has two user roles: `User` and `Admin`.

- **User:** Standard users can create, view, and manage their own events after logging in.
- **Admin:** Admin users have the ability to view and manage all events created by any user in the system. To make a user an admin, you must manually change their `role` from `'user'` to `'admin'` in the `users` table in the `event_scheduler` database using a tool like phpMyAdmin.

### Dashboard

- After logging in, you will be taken to the dashboard.
- The dashboard displays a list of your events.

### Creating an Event

1.  Click on the **Add Event** or similar button on the dashboard.
2.  This will open the event creation form.
3.  You can either fill in the event details manually (title, description, date, etc.) or use the AI feature.

#### Using the AI Feature

1.  In the event form, find the text area for AI-powered creation.
2.  Type a natural language description of your event. For example: `Meeting with the team tomorrow at 3 PM to discuss the project update.`
3.  Click the **Parse Event** button. The AI will analyze the text and automatically fill in the fields like title, date, and time.
4.  Review the auto-filled details and make any necessary adjustments.
5.  Click **Save Event**.
