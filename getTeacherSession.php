<?php  header('Access-Control-Allow-Origin: *');
	$page = isset($_POST['page']) ? intval($_POST['page']) : 1;
	$rows = isset($_POST['rows']) ? intval($_POST['rows']) : 10;
	$offset = ($page-1)*$rows;
	$result = array();
	$teacherId =  isset($_REQUEST['teacherId'])? intval($_REQUEST['teacherId']):(isset($_GET['teacherId'])? intval($_GET['teacherId']):0);
	$langId =  isset($_REQUEST['langId'])? intval($_REQUEST['langId']):(isset($_GET['langId'])? intval($_GET['langId']):0);
	include 'conn.php';
	if($teacherId!=0 && $langId!=0)
	{
	$rs = mysql_query("SELECT count(*) FROM sessionschedule s,langteachermap m, language l, teacher t where s.langteachermap_id =m.id and m.lang_id=l.id and m.teacher_id=t.id and t.id=$teacherId and l.id=$langId");
	$row = mysql_fetch_row($rs);
	$result["total"] = $row[0];
	
	$rs = mysql_query("SELECT s.id as s_id, m.id as m_id,m.teacher_id ,m.lang_id,  l.name as l_name,t.name as t_name,startTime,endTime FROM sessionschedule s,langteachermap m, language l, teacher t where s.langteachermap_id =m.id and m.lang_id=l.id and m.teacher_id=t.id and t.id=$teacherId and l.id=$langId limit $offset,$rows");
	
	$items = array();
	while($row = mysql_fetch_object($rs)){
		
		array_push($items, $row);
	}
	$result["rows"] = $items;
	}
	else if($teacherId!=0)
	{
	
	$rs = mysql_query("SELECT count(*) FROM sessionschedule s,langteachermap m, language l, teacher t where s.langteachermap_id =m.id and m.lang_id=l.id and m.teacher_id=t.id and t.id=$teacherId");
	$row = mysql_fetch_row($rs);
	$result["total"] = $row[0];
	
	$rs = mysql_query("SELECT s.id as s_id, m.id as m_id,m.teacher_id ,m.lang_id,  l.name as l_name,t.name as t_name,startTime,endTime FROM sessionschedule s,langteachermap m, language l, teacher t where s.langteachermap_id =m.id and m.lang_id=l.id and m.teacher_id=t.id and t.id=$teacherId limit $offset,$rows");
	
	
	$items = array();
	while($row = mysql_fetch_object($rs)){
		
		array_push($items, $row);
	}
	$result["rows"] = $items;
	}
	else if($langId!=0)
	{
	$rs = mysql_query("SELECT count(*) FROM sessionschedule s,langteachermap m, language l, teacher t where s.langteachermap_id =m.id and m.lang_id=l.id and m.teacher_id=t.id and l.id=$langId");
	$row = mysql_fetch_row($rs);
	$result["total"] = $row[0];
	
	$rs = mysql_query("SELECT s.id as s_id, m.id as m_id,m.teacher_id ,m.lang_id,  l.name as l_name,t.name as t_name,startTime,endTime FROM sessionschedule s,langteachermap m, language l, teacher t where s.langteachermap_id =m.id and m.lang_id=l.id and m.teacher_id=t.id and l.id=$langId limit $offset,$rows");
	
	$items = array();
	while($row = mysql_fetch_object($rs)){
		
		array_push($items, $row);
	}
	$result["rows"] = $items;
	}
	else 
	{
	$rs = mysql_query("SELECT count(*) FROM sessionschedule s,langteachermap m, language l, teacher t where s.langteachermap_id =m.id and m.lang_id=l.id and m.teacher_id=t.id");
	$row = mysql_fetch_row($rs);
	$result["total"] = $row[0];
	
	$rs = mysql_query("SELECT s.id as s_id, m.id as m_id,m.teacher_id ,m.lang_id,  l.name as l_name,t.name as t_name,startTime,endTime FROM sessionschedule s,langteachermap m, language l, teacher t where s.langteachermap_id =m.id and m.lang_id=l.id and m.teacher_id=t.id limit $offset,$rows");
	
	$items = array();
	while($row = mysql_fetch_object($rs)){
		
		array_push($items, $row);
	}
	$result["rows"] = $items;
	}
	 
	echo json_encode($result);

?>