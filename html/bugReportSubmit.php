<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Operation Breakpoint: Bug Report Submitted</title>
    <link rel="stylesheet" href="css/master.css">
</head>

<body>
    <header>
        <h1>Bug Report</h1>
    </header>

    <main id="content">
        <a href="index.html" class="buttonLink smallButton" id="headerLeft">Back</a>

        <div id="phpEcho" class="alignTextCenter">
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
            require_once "/var/www/html/config.php";

            try {
                // Connect using PDO
                $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                // Prepare SQL insert statement
                $sql = "INSERT INTO bugReport (name, email, bugType, subject, description, gameVersion)
                    Values (:name, :email, :bugType, :subject, :description, :gameVersion)";

                $stmt = $pdo->prepare($sql);

                // Bind values
                $stmt->bindParam(":name", $name);
                $stmt->bindParam(":email", $email);
                $stmt->bindParam(":bugType", $bugType);
                $stmt->bindParam(":subject", $subject);
                $stmt->bindParam(":description", $description);
                $stmt->bindParam(":gameVersion", $gameVersion);

                // Execute insert
                $stmt->execute();

                // Redirect or show success message
                echo "<p>Bug Report Submitted Successfully!<br>
                    <br>Thank you for your feedback!</p>";
                // header("Location: thankyou.html"); // optional redirect
                exit;
            } catch (PDOException $e) {
                die("Database Error: " . $e->getMessage());
            }
        } else {
            echo "<p>Invalid Request!</p>";
        }
        ?>
        </div>
    </main>

    <div id="rotate">
        <img src="images/RotateScreen.gif" alt="rotateScreen">
        <p id="rotateMessage">Rotate Device</p>
    </div>
</body>

</html>