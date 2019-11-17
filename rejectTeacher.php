<?php  header('Access-Control-Allow-Origin: *');
 	$page = isset($_POST['page']) ? intval($_POST['page']) : 1;
	$rows = isset($_POST['rows']) ? intval($_POST['rows']) : 10;
	$offset = ($page-1)*$rows;
 
	$teacherId =  isset($_REQUEST['teacherId'])? intval($_REQUEST['teacherId']):(isset($_GET['teacherId'])? intval($_GET['teacherId']):0);
	include 'conn.php';
	if($teacherId!=0)
	{
	  $sql = "update teacher set status='R' where id='$teacherId'";
	  //echo $sql;
      $result = @mysql_query($sql);
      if ($result){
      	echo json_encode(array('success'=>true));
      } else {
      	echo json_encode(array('msg'=>'Some errors occured.'));
      }
	}
	else
	{
		echo json_encode(array('msg'=>'Some errors occured.'));
	}
	 
 
?>