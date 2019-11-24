<?php
if(is_array($_FILES)) {
if(is_uploaded_file($_FILES['userVideo']['tmp_name'])) {
$sourcePath = $_FILES['userVideo']['tmp_name'];
$targetPath = "uploads/".$_FILES['userVideo']['name'];
if(move_uploaded_file($sourcePath,$targetPath)) {
?>
<video class="image-preview upload-preview" width="100%" height="auto" controls preload="none" style="padding:5px;"><source id ="regTeacherVideoSample" src="<?php echo $targetPath; ?>" type="video/mp4" /></video>'
<?php
}
}
}
?>