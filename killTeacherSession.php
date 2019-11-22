<?php  header('Access-Control-Allow-Origin: *');
	$page = isset($_POST['page']) ? intval($_POST['page']) : 1;
	$rows = isset($_POST['rows']) ? intval($_POST['rows']) : 10;
	$offset = ($page-1)*$rows;
	$teacherSessionId =  isset($_REQUEST['teacherSessionId'])? intval($_REQUEST['teacherSessionId']):(isset($_GET['teacherSessionId'])? intval($_GET['teacherSessionId']):0);
	
	include 'conn.php';
	if($teacherSessionId!=0)
	{
	 $sql = "update sessionschedule set status ='Cancelled' where id='$teacherSessionId'";
	  //echo $sql;
      $result = @mysql_query($sql);
      if ($result){
      	echo json_encode(array('success'=>true));
      } else {
      	echo json_encode(array('msg'=>'Some errors occured.'));
      }
	}
	else{
	echo json_encode(array('msg'=>'Some errors occured.'));
	}
?>