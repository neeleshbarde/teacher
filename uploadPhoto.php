<?php
if(is_array($_FILES)) {
if(is_uploaded_file($_FILES['userPhoto']['tmp_name'])) {
$sourcePath = $_FILES['userPhoto']['tmp_name'];
$targetPath = "uploads/".$_FILES['userPhoto']['name'];
if(move_uploaded_file($sourcePath,$targetPath)) {
?>
<img class="image-preview" src="<?php echo $targetPath; ?>" class="upload-preview" />
<?php
}
}
}
?>