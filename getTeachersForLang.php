<?php  header('Access-Control-Allow-Origin: *');
	$page = isset($_POST['page']) ? intval($_POST['page']) : 1;
	$rows = isset($_POST['rows']) ? intval($_POST['rows']) : 10;
	$offset = ($page-1)*$rows;
	$result = array();
	$teacherId =  isset($_REQUEST['teacherId'])? intval($_REQUEST['teacherId']):(isset($_GET['teacherId'])? intval($_GET['teacherId']):0);
	$langId =  isset($_REQUEST['langId'])? intval($_REQUEST['langId']):(isset($_GET['langId'])? intval($_GET['langId']):0);
 
	include 'conn.php';
	if($langId!=0 && $teacherId!=0)
	{
	$rs = mysql_query("select count(*) from langteachermap where lang_id=$langId and teacher_id=$teacherId");
	
	$row = mysql_fetch_row($rs);
	$result["total"] = $row[0];
	
	$rs = mysql_query(" SELECT  * FROM langteachermap where lang_id=$langId and teacher_id=$teacherId limit $offset,$rows");
	
	$items = array();
	while($row = mysql_fetch_object($rs)){
		
		array_push($items, $row);
	}
	$result["rows"] = $items;
	}
	
	else if($langId!=0)
	{
	$rs = mysql_query("select count(*) from langteachermap m,teacher t where m.teacher_id=t.id and  m.lang_id=$langId");
	$row = mysql_fetch_row($rs);
	$result["total"] = $row[0];
	
	$rs = mysql_query(" SELECT m.*,t.* FROM langteachermap m,teacher t where m.teacher_id=t.id and  m.lang_id=$langId limit $offset,$rows");
	
	$items = array();
	while($row = mysql_fetch_object($rs)){
		array_push($items, $row);
	}
	$result["rows"] = $items;
	}
	else if($teacherId!=0)
	{

	$rs = mysql_query("select count(*) from langteachermap m,teacher t where m.teacher_id=t.id and t.id=$teacherId");
	$row = mysql_fetch_row($rs);
	$result["total"] = $row[0];
	
	$rs = mysql_query(" SELECT  m.*,t.* FROM langteachermap m,teacher t where m.teacher_id=t.id and t.id=$teacherId limit $offset,$rows");
	
	$items = array();
	while($row = mysql_fetch_object($rs)){
		
		array_push($items, $row);
	}
	$result["rows"] = $items;
	}
	else
	{
	$rs = mysql_query("select count(*) from langteachermap");
	$row = mysql_fetch_row($rs);
	$result["total"] = $row[0];
	$rs = mysql_query(" SELECT * from langteachermap limit $offset,$rows");
	
	$items = array();
	while($row = mysql_fetch_object($rs)){
		array_push($items, $row);
	}
	$result["rows"] = $items;
   }
	echo json_encode($result);
?>