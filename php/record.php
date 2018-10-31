<?php

$conn = mysqli_connect('127.0.0.1', 'root', '', '2_module_spacex');
//$conn = mysqli_connect('sql205.epizy.com', 'epiz_22796060', 'unmHAgSvVhx', 'epiz_22796060_SpaceX'); // IF 1
//$conn = mysqli_connect('sql213.epizy.com', 'epiz_22632028', 'NKPDG2ZF', 'epiz_22632028_database'); // IF 2
//$conn = mysqli_connect('localhost', 'u9895013_databas', '7vwayVlc', 'u9895013_databas'); // BG

if (!$conn) {
	die("Database connection error\n" . mysqli_connect_error());
}

$username = $_POST['username'];
$score = $_POST['score'];
$time = $_POST['time'];

$query = mysqli_query($conn, "SELECT `username`, `score`, `time` FROM `record` WHERE `score` >= '$score' ORDER BY `score` DESC");

$top_records = null;
while ($record = mysqli_fetch_assoc($query)) {
	$top_records[] = $record;
}

echo json_encode($top_records);


//$username = 'username22';
//$score = '1500';
//$time = '31.10.18';

mysqli_query($conn, "INSERT INTO `record` (`username`, `score`, `time`) VALUE ('$username', '$score', '$time')");
