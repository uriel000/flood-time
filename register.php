<?php
include 'config.php';



if(isset($_POST['submit'])){
  $name = mysqli_real_escape_string($conn, $_POST['name']);
  $email = mysqli_real_escape_string($conn, $_POST['email']);
  $password = mysqli_real_escape_string($conn, md5($_POST['password']));
  $cpassword = mysqli_real_escape_string($conn, md5($_POST['cpassword']));

  $select_users = mysqli_query($conn, "SELECT * FROM `users` WHERE user_email='$email' AND user_password='$password'") or die("Register query failed");

  if(mysqli_num_rows($select_users)>0){
        $message[]= "This user account already exists";
  }else{
        if($password != $cpassword){
        $message[]= "Password does not match";
        }else{
            mysqli_query($conn, "INSERT INTO `users` (user_name, user_email, user_password) VALUES ('$name', '$email', '$password')") or die("Query failed");
            $message[]= "Account is registered successfully!";
        }
    }
}

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="assets/css/style.css" />
    <title>Register</title>

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
    <div class="register-container">
      <div class="form" id="register-form" >
        <h1>Welcome to <span class="title">Flood-Time</span></h1>
        <p class="second-title">Create an account</p>
        <form method="post">
          <label for="name">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            required
          />
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
          <label for="cpassword">Confirm Password</label>
          <input
            type="password"
            name="cpassword"
            placeholder="Confirm your password"
            required
          />
          <input type="submit" value="Register" name="submit" class="btn" />
        </form>
        <p>Already have an account? <a href="login.php">Login</a></p>
        <p class="terms">
          By creating an account you agree to our
          <span style="color: var(--blue)">Terms of Service</span> and
          <span style="color: var(--blue)">Privacy Policy</span>.
        </p>
      </div>
      <div class="rain">
        <img src="assets/images/background.jpg" alt="" />
      </div>
    </div>
  </body>
</html>
