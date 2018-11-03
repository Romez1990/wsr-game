<?php

$conn = mysqli_connect('localhost', 'root', 'root', '2_module_spacex');
//$conn = mysqli_connect('sql205.epizy.com', 'epiz_22796060', 'unmHAgSvVhx', 'epiz_22796060_SpaceX');

if (!$conn) {
	die('Database connection error' . "\n" . mysqli_connect_error());
}

$username = $_POST['username'];
$score = $_POST['score'];

mysqli_query($conn, "INSERT INTO `record` (`username`, `score`) VALUE ('$username', '$score')");
$id = mysqli_insert_id($conn);

mysqli_query($conn, "SET @i = 0");
$top_10_records = mysqli_query($conn, "SELECT (@i := @i + 1) AS `place`, `id`, `username`, `score`, `time` FROM `record` ORDER BY `score` DESC, time DESC LIMIT 10");

$current_found = false;
$top_records = null;
for ($i = 0; $i < 10 && $record = mysqli_fetch_assoc($top_10_records); $i++) {
	if ($record['id'] === $id) {
		$current_found = true;
	}
	
	unset($record['id']);
	$record['time'] = date("d.m.y", strtotime($record['time']));
	$top_records[] = $record;
}

if (!$current_found) {
	mysqli_query($conn, "SET @i = 10");
	$remaining_records = mysqli_query($conn, "SELECT (@i := @i + 1) AS `place`, `id`, `username`, `score`, `time` FROM `record` WHERE `score` >= 0 ORDER BY `score` DESC, time DESC LIMIT 10, 1000000000");
	while ($record = mysqli_fetch_assoc($remaining_records)) {
		if ($record['id'] != $id) continue;
		
		unset($record['id']);
		$record['time'] = date("d.m.y", strtotime($record['time']));
		$top_records[9] = $record;
		break;
	}
}

echo json_encode($top_records);
