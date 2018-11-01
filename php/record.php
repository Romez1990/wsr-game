<?php

$conn = mysqli_connect('127.0.0.1', 'root', 'root', '2_module_spacex');

if (!$conn) {
	die("Database connection error\n" . mysqli_connect_error());
}

$username = $_POST['username'];
$score = $_POST['score'];
$time = $_POST['time'];

$query = mysqli_query($conn, "SELECT `username`, `score`, `date` AS `time` FROM `record` WHERE `score` >= '$score' ORDER BY `score` DESC, `date` DESC");

$top_records = null;
while ($record = mysqli_fetch_assoc($query)) {
	$record['time'] = date("d.m.y", strtotime($record['time']));
	
	$top_records[] = $record;
}

echo json_encode($top_records);

//$username = 'username22';
//$score = '1500';
//$time = '31.10.18';

//	mysqli_query($conn, "INSERT INTO `record` (`username`, `score`, `time`) VALUE ('$username', '$score', '$time')");

/*

SELECT (SET @i := @i + 1) AS num, `id`, `username`, `score`, `time` FROM `record` ORDER BY `score` DESC

 */