<?php  header('Access-Control-Allow-Origin: *');
 	$page = isset($_POST['page']) ? intval($_POST['page']) : 1;
	$rows = isset($_POST['rows']) ? intval($_POST['rows']) : 10;
	$offset = ($page-1)*$rows;
	$result = array();
	$teacherId =  isset($_REQUEST['teacherId'])? intval($_REQUEST['teacherId']):(isset($_GET['teacherId'])? intval($_GET['teacherId']):0);
	include 'conn.php';
	if($teacherId!=0)
	{
	$rs = mysql_query("select count(*) from teacher where id=$teacherId");
	$row = mysql_fetch_row($rs);
	$result["total"] = $row[0];
	$rs = mysql_query("select * from teacher where id=$teacherId limit $offset,$rows");
 
	$items = array();
	 

	while($row = mysql_fetch_object($rs)){
		$sampleVideos = array();
		$subrs = mysql_query("SELECT id , srcMP4 FROM samplevideos WHERE teacher_id =$teacherId limit $offset,$rows");
		$subrow = mysql_fetch_object($subrs);
		 while($subrow = mysql_fetch_object($subrs)){
		 array_push($sampleVideos, $subrow);
		 }
		$row->sampleVideos= $sampleVideos;
		
		$sampleVideos = array();
		$subrs = mysql_query("SELECT link FROM sampleVideosYouTube WHERE teacher_id =$teacherId limit $offset,$rows");
		$subrow = mysql_fetch_object($subrs);
		 while($subrow = mysql_fetch_object($subrs)){
		 array_push($sampleVideos, $subrow->link);
		 }
		$row->sampleVideosYouTube= $sampleVideos;
		array_push($items, $row);
	}
	$result["rows"] = $items;
	echo json_encode($result); 
	}
	else
	{
	$rs = mysql_query("select count(*) from teacher");
	$row = mysql_fetch_row($rs);
	$result["total"] = $row[0];
	$rs = mysql_query("select * from teacher limit $offset,$rows");
	
	$items = array();
	while($row = mysql_fetch_object($rs)){
		array_push($items, $row);
	}
   }
 	$result["rows"] = $items;
 	//echo json_encode($result);
?>