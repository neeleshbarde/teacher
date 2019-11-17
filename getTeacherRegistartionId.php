<?php  header('Access-Control-Allow-Origin: *');
	$result = array();
	include 'conn.php';
	$rs = mysql_query("select max(id)+1 from teacher");
	$row = mysql_fetch_row($rs);
	$result["total"] = $row[0];
	echo json_encode($result); 
	
?>