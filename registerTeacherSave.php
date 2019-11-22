<?php
$tid= $_GET['tid'];
$lblName= $_GET['lblName'];
$lblUniversity= $_GET['lblUniversity'];
$lblLocation= $_GET['lblLocation'];
$lblYearOfExp= $_GET['lblYearOfExp'];
$lblEmail= $_GET['lblEmail'];
$lblPhone= $_GET['lblPhone'];
$lblMobileNo= $_GET['lblMobileNo'];
$photo_src= $_GET['photo_src'];
$sample_video= $_GET['sample_video'];
$certi=$_GET['certi'];
$lblDescription=$_GET['lblDescription'];
include "conn.php";
$sql ="insert into teacher (id,   name,    username, password, photo_src,certificate, university, loc, yrs, email, phone, mobile,description) VALUES 
('$tid', '$lblName', '$lblName', '$lblName', '$photo_src','$certi', '$lblUniversity', '$lblLocation', '$lblYearOfExp', '$lblEmail', '$lblPhone', '$lblMobileNo','$lblDescription')";
//echo $sql;
 $result = @mysql_query($sql);
      if ($result){
		  //send email to the registered teacher
		  {
			  
		  }
      	echo json_encode(array('success'=>true));
      } else {
		  echo $result;
      	echo json_encode(array('msg'=>'Some errors occured.'));
      }
?>