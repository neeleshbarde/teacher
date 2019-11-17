<?php  header('Access-Control-Allow-Origin: *');
 	$page = isset($_POST['page']) ? intval($_POST['page']) : 1;
	$rows = isset($_POST['rows']) ? intval($_POST['rows']) : 10;
	$offset = ($page-1)*$rows;
	$result = array();
	$username =  isset($_REQUEST['username'])? ($_REQUEST['username']):(isset($_GET['username'])? ($_GET['username']):'');
	$password =  isset($_REQUEST['password'])? ($_REQUEST['password']):(isset($_GET['password'])? ($_GET['password']):'');
	include 'conn.php';
	if($username!=''&&$password!='')
	{
	$rs = mysql_query("select 'true', id from teacher where username='$username' and password='$password'");
	$row = mysql_fetch_row($rs);
	
	$result["login"] = $row[0];
	$result["id"] = $row[1];
	}
	else{
	$result["login"] = false;
	}
 	echo json_encode($result);
?>