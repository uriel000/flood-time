<?php
include 'config.php';


if(isset($_POST['submit'])){
  $email = mysqli_real_escape_string($conn, $_POST['email']);
  $password = mysqli_real_escape_string($conn, md5($_POST['password']));
  $select_users = mysqli_query($conn, "SELECT * FROM `users` WHERE user_email='$email' AND user_password='$password'") or die("Login query failed");
    if(mysqli_num_rows($select_users)>0){
        header("location:home.html");
    }else{
         $message[] = "Incorrect email or password. Try again";
    }
}

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="assets/css/style.css" />
    <title>Login</title>
            <!-- font awesome cdn link -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
  </head>
  <body>
      <?php
    if(isset($message)){
        foreach($message as $message){
            echo '
            <div class="message">
            <span>'.$message.'</span>
            <i class="fas fa-times" onclick="this.parentElement.remove();"></i>
            </div>

            ';
        }
    }
    ?>
    <div class="login-container">
      <div class="form">
        <h1>Welcome to <span class="title">Flood-Time</span></h1>
        <p class="second-title">Login account</p>
        <form method="post">
          <label for="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="youremail@email.com"
            required
          />
          <label for="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />
          <input type="submit" value="Login" class="btn" name="submit" />
        </form>
        <p>
          Do not have an account yet? <a href="register.php">Register now</a>
        </p>
      </div>
      <div class="rain">
        <img src="assets/images/background.jpg" alt="" />
      </div>
    </div>
  </body>
</html>
