<?php

$conn = mysqli_connect('localhost', 'root', 'root', '2_module_spacex');
//$conn = mysqli_connect('sql213.epizy.com', 'epiz_22632028', 'NKPDG2ZF', 'epiz_22632028_database');

if (!$conn) {
	die("Database connection error\n" . mysqli_connect_error());
}

$username = $_POST['username'];
$score = $_POST['score'];

mysqli_query($conn, "INSERT INTO `record` (`username`, `score`) VALUE ('$username', '$score')");
$id = mysqli_insert_id($conn);

$all_records = mysqli_query($conn, "SELECT `username`, `score`, `time` FROM `record` WHERE `score` >= '$score' ORDER BY `score` DESC, time DESC");

$top_records = null;

if (mysqli_num_rows($all_records) <= 10) {
	while ($record = mysqli_fetch_assoc($all_records)) {
		$record['time'] = date("d.m.y", strtotime($record['time']));
		$top_records[] = $record;
	}
} else {
	for ($i = 0; $i < 10; $i++) {
		$record = mysqli_fetch_assoc($all_records);
		$record['time'] = date("d.m.y", strtotime($record['time']));
		$top_records[] = $record;
	}
}

echo json_encode($top_records);

/*

SELECT (SET @i := @i + 1) AS num, `id`, `username`, `score`, `time` FROM `record` ORDER BY `score` DESC

 */