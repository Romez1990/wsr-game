<?php

$conn = mysqli_connect('127.0.0.1', 'root', '', 'spacex');

$name = $_POST['name'] !== null ? $_POST['name'] : $_GET['name'];
$score = $_POST['score'] !== null ? $_POST['score'] : $_GET['score'];
$read_only = strlen($name) <= 4 || strlen($name) >= 20 || intval($score) <= 0; // Not need to insert record to db

if (!$read_only) {
	// Insertions
	$current_datetime = time() - date('Z');
	mysqli_query($conn, "INSERT INTO scoreboard (nickname, score, `datetime`) VALUE ('$name', '$score', '$current_datetime')");
}

// Get first 10
$top_records = null;
$position = 1;
$top_records_db = mysqli_query($conn, "SELECT nickname, score, `datetime` FROM scoreboard ORDER BY score DESC, `datetime` DESC LIMIT 10");
while ($record = mysqli_fetch_assoc($top_records_db)) {
	$record['position'] = $position++;
	$record['datetime'] = strtotime($record['datetime']);
	$top_records[] = $record;
}

if (!$read_only) {
	// Set the last record
	$count = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) AS `count` FROM scoreboard WHERE score > '$score'"))['count'];
	if ($count > 10) {
		$top_records[9] = [
			'position' => $count + 1,
			'nickname' => $name,
			'score' => $score,
			'datetime' => $current_datetime
		];
	}
}

echo json_encode($top_records);
