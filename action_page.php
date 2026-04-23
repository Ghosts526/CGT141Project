<!DOCTYPE html>
<html>
<body>

<p>Thank you <?php echo $_POST["name"]; ?> </p>
<p>We will send you an conformation email on your issue at <?php echo $_POST["email"]; ?></p>
<p>Bug Type: <?php echo $_POST["bugType"]; ?></p>
<p>Description: <?php echo $_POST["description"]; ?></p>

</body>
</html>