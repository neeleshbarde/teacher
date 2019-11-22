<?php
/*   $to_email = "neelesh87@gmail.com";
   $subject = "Simple Email Test via PHP";
   $body = "Hi,nn This is test email send by PHP Script";
   $headers = "From: sender@example.com";
 
   if ( mail($to_email, $subject, $body, $headers)) {
      echo("Email successfully sent to $to_email...");
   } else {
      echo("Email sending failed...");
   }
 */  
   
    mail("neelesh87@gmail.com",
        "This is the message subject",
        "This is the message body",
        "From: contact@msquaresys.com" . "\r\n" . "Content-Type: text/plain; charset=utf-8",
        "-fcontact@msquaresys.com");
   
    require 'Mail.php';

    // Define basic e-mail parameters:
    $recipient = 'neelesh87@gmail.com';
    $headers['From'] = 'contact@msquaresys.com';
    $headers['Reply-to'] = 'contact@msquaresys.com';
    $headers['To'] = 'neelesh87@msquaresys.com';
    $headers['Subject'] = 'This is the message subject';
    $headers['Date'] = date('r');
    //$headers['Message-Id'] = '<' . uniqid() . '@example.com>';
    $headers['Content-Type'] = 'text/plain; charset=utf-8';
    $body = 'This is the message body';

    // Define SMTP authentication parameters:
    $smtp_params['host'] = 'www.msquaresys.com';
    $smtp_params['auth'] = true;
    $smtp_params['username'] = 'contact';
    $smtp_params['password'] = 'bardez4$';

    // Create a Mail class instance with the above parameters, and then send the message:
    $message = Mail::factory('smtp', $smtp_params);
    $message->send($recipient, $headers, $body);
	 echo("Email successfully sent to $recipient...");
 
?>