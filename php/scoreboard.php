<?php

$db = mysqli_connect('127.0.0.1', 'root', '', 'spacex');

$data = validate_parameters($_POST);
$current_datetime = time() - date('Z');

$insert_record_id = insert_record($data['player_name'], $data['score']);
$count = get_count_of_records_above($data['score']);
if ($count > 9) {
    $top_records = get_top_records(9, function (): bool {
        return false;
    });
    $top_records[] = [
        'position' => $count + 1,
        'player_name' => $data['player_name'],
        'score' => $data['score'],
        'datetime' => $current_datetime,
        'current_player' => true,
    ];
} else {
    $top_records = get_top_records(10, function ($record): bool {
        global $insert_record_id;
        return $record['id'] == $insert_record_id;
    });
}

response_with_json($top_records);

function validate_parameters(array $parameters): array
{
    $data = [];
    $errors = [];

    $player_name = $parameters['player_name'];
    if (is_null($player_name))
        $errors['player_name'] = 'this field is required';
    else if (strlen($player_name) < 4)
        $errors['player_name'] = 'player name must be more than four characters';
    else
        $data['player_name'] = $player_name;

    $score = intval($parameters['score']);
    if (is_null($parameters['score']))
        $errors['score'] = 'this field is required';
    else if ($score < 0)
        $errors['score'] = 'score cannot be negative';
    else
        $data['score'] = $score;

    if (!empty($errors)) {
        http_response_code(400);
        response_with_json($errors);
        exit();
    }

    return $data;
}

function insert_record(string $player_name, int $score): int
{
    global $db, $current_datetime;
    $datetime = date('Y-m-d H:i:s', $current_datetime);
    $result = mysqli_query($db, "INSERT INTO scoreboard (player_name, score, `datetime`) VALUE ('$player_name', $score, '$datetime')");
    if (!$result)
        die('insert failed');
    return mysqli_insert_id($db);
}

function get_count_of_records_above(int $score): int
{
    global $db;
    $count_result = mysqli_query($db, "SELECT COUNT(*) AS `count` FROM scoreboard WHERE score > '$score'");
    return mysqli_fetch_row($count_result)[0];
}

function get_top_records(int $limit, Closure $is_current_player): array
{
    global $db;
    $top_records = [];
    $position = 1;
    $top_records_result = mysqli_query($db, "SELECT * FROM scoreboard ORDER BY score DESC, `datetime` LIMIT $limit");
    while ($db_record = mysqli_fetch_assoc($top_records_result)) {
        $record = [];
        $record['position'] = $position++;
        $record['player_name'] = $db_record['player_name'];
        $record['score'] = intval($db_record['score']);
        $record['datetime'] = strtotime($db_record['datetime']);
        $record['current_player'] = $is_current_player($db_record);
        $top_records[] = $record;
    }
    return $top_records;
}

function response_with_json($array): void {
    header('Content-Type: application/json');
    echo json_encode($array);
}
