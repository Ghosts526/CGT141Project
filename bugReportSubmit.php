<?php
// Start by checking if the form was submitted 
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Collect form data safely
    $name = $_POST["name"] ?? "";
    $email = $_POST["email"] ?? "";
    $bugType = $_POST["bugType"] ?? "";
    $subject = $_POST["subject"] ?? "";
    $description = $_POST["description"] ?? "";
    
    // Database connection settings
    require_once "/var/www/secure/config.php";

    try {
        // Connect using PDO
        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Prepare SQL insert statement
        $sql = "INSERT INTO bugReport (name, email, bugType, subject, description)
            Values (:name, :email, :bugType, :subject, :description)";

        $stmt = $pdo->prepare($sql);

        // Bind values
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":bugType", $bugType);
        $stmt->bindParam(":subject", $subject);
        $stmt->bindParam(":description", $description);

        // Execute insert
        $stmt->execute();

        // Redirect or show success message
        echo "Bug Report Submitted Successfully!";
        // header("Location: thankyou.html"); // optional redirect
        exit;
    } catch (PDOException $e) {
        die("Database Error: " . $e->getMessage());
    }
} else {
    echo "Invalid Request!";
}
?>