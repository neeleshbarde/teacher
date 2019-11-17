<?php  header('Access-Control-Allow-Origin: *');
	$page = isset($_POST['page']) ? intval($_POST['page']) : 1;
	$rows = isset($_POST['rows']) ? intval($_POST['rows']) : 10;
	$offset = ($page-1)*$rows;
	$result = array();
	$langId =  isset($_REQUEST['langId'])? intval($_REQUEST['langId']):(isset($_GET['langId'])? intval($_GET['langId']):0);
	include 'conn.php';
	if($langId!=0)
	{
	$rs = mysql_query("select count(*) from language where id=$langId");
	$row = mysql_fetch_row($rs);
	$result["total"] = $row[0];
	$rs = mysql_query("select * from language where id=$langId limit $offset,$rows");
	$items = array();
	while($row = mysql_fetch_object($rs)){
		array_push($items, $row);
	}
	$result["rows"] = $items;
	}
	else
	{
		
	$rs = mysql_query("select count(*) from language");
	$row = mysql_fetch_row($rs);
	
	$result["total"] = $row[0];
	$rs = mysql_query("select * from language limit $offset,$rows");
	
	$items = array();
	while($row = mysql_fetch_object($rs)){
		array_push($items, $row);
	}
	$result["rows"] = $items;
   }
	echo json_encode($result);

?>