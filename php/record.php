<?php

$conn = mysqli_connect('127.0.0.1', 'root', '', '2_module_spacex');

if (!$conn) {
	die("Database connection error\n" . mysqli_connect_error());
}

$username = $_POST['username'];
$score = $_POST['score'];
$time = $_POST['time'];

mysqli_query($conn, "INSERT INTO `record` (`username`, `score`, `time`) VALUE ('$username', '$score', '$time')");
$id = mysqli_insert_id($conn);

mysqli_query($conn, "SELECT `username`, `score`, `time` FROM `record` LIMIT 10");
