<?php
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
$sql ="insert into teacher (  name,    username, password, photo_src,certificate, university, loc, yrs, email, phone, mobile,description) VALUES 
( '$lblName', '$lblName', '$lblName', '$photo_src','$certi', '$lblUniversity', '$lblLocation', '$lblYearOfExp', '$lblEmail', '$lblPhone', '$lblMobileNo','$lblDescription')";
//echo $sql;
 $result = @mysql_query($sql);
      if ($result){
		  $tid=mysql_insert_id();
		  $sql2 ="insert into samplevideos ( teacher_id,  srcMP4 ) VALUES ( '$tid', '$sample_video')";
		  //echo $sql2;
		  $result2 = @mysql_query($sql2);	
		  
		   if ($result2){
		     //send email to the registered teacher
		     {
		  	   
		     }
			 echo json_encode(array('success'=>true));
		   }else{
			 echo json_encode(array('msg'=>'Video Upload errors occured.'));
		   }
      	
      } else {
		  echo $result;
      	echo json_encode(array('msg'=>'Some errors occured.'));
      }
?>