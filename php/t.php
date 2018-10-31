<?php

//$conn = mysqli_connect('127.0.0.1', 'root', '', '2_module_spacex');
//$conn = mysqli_connect('sql205.epizy.com', 'epiz_22796060', 'unmHAgSvVhx', 'epiz_22796060_SpaceX'); // IF 1
//$conn = mysqli_connect('sql213.epizy.com', 'epiz_22632028', 'NKPDG2ZF', 'epiz_22632028_database'); // IF 2
$conn = mysqli_connect('localhost', 'u9895013_databas', '7vwayVlc', 'u9895013_databas'); // BG

if (!$conn) {
	die("Database connection error\n" . mysqli_connect_error());
}

echo 123;
