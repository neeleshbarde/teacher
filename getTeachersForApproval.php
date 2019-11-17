<?php  header('Access-Control-Allow-Origin: *');
 	$page = isset($_POST['page']) ? intval($_POST['page']) : 1;
	$rows = isset($_POST['rows']) ? intval($_POST['rows']) : 10;
	$offset = ($page-1)*$rows;
	$result = array();
 	$teacherId =  isset($_REQUEST['teacherId'])? intval($_REQUEST['teacherId']):(isset($_GET['teacherId'])? intval($_GET['teacherId']):0);
	include 'conn.php';
	$items = array();
	$result["total"]=0;
	if($teacherId!=0)
	{
	$rs = mysql_query("select count(*) from teacher where status='N' and 'Y' = (select isAdmin from teacher where id= '$teacherId' ");
	$row = mysql_fetch_row($rs);
	$result["total"] = $row[0];
	$rs = mysql_query("select * from teacher where status='N' and 'Y' = (select isAdmin from teacher where id= '$teacherId') limit $offset,$rows");
 	
	while($row = mysql_fetch_object($rs)){
		array_push($items, $row);
	}
	}
	$result["rows"] = $items;
	echo json_encode($result); 
	 
?>