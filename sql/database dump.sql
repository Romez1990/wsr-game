-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 04, 2020 at 03:57 PM
-- Server version: 8.0.15
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spacex`
--

-- --------------------------------------------------------

--
-- Table structure for table `scoreboard`
--

CREATE TABLE `scoreboard` (
  `id` int(11) NOT NULL,
  `player_name` varchar(255) NOT NULL,
  `score` int(11) NOT NULL,
  `datetime` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `scoreboard`
--

INSERT INTO `scoreboard` (`id`, `player_name`, `score`, `datetime`) VALUES
(1, 'Карина', 60, '2018-11-02 06:39:59'),
(2, 'Карина', 61, '2018-11-02 06:41:04'),
(3, 'Карина', 57, '2018-11-02 06:44:24'),
(4, 'Карина', 63, '2018-11-02 06:45:31'),
(5, 'Карина', 66, '2018-11-02 06:47:03'),
(6, 'Карина', 95, '2018-11-02 06:49:26'),
(7, 'Карина', 50, '2018-11-02 06:50:48'),
(8, 'Карина', 74, '2018-11-02 06:56:03'),
(9, 'Sorokina', 76, '2018-11-02 07:47:47'),
(10, 'Sorokina', 93, '2018-11-02 07:49:29'),
(11, 'Sorokina', 72, '2018-11-02 08:32:10'),
(12, 'Karina', 84, '2018-11-02 08:33:53'),
(13, 'Karina', 91, '2018-11-02 08:35:30'),
(14, 'Karina', 33, '2018-11-02 08:36:18'),
(15, 'Karina', 116, '2018-11-02 08:38:25'),
(16, 'OLesya', 42, '2018-11-02 09:53:39'),
(17, 'Romez1990', 25, '2018-11-03 01:09:15'),
(18, 'roma1337 2228', 23, '2018-11-06 07:23:50'),
(19, '4ekatilo', 25, '2018-11-06 07:24:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `scoreboard`
--
ALTER TABLE `scoreboard`
  ADD PRIMARY KEY (`id`),
  ADD KEY `score` (`score`),
  ADD KEY `date` (`datetime`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `scoreboard`
--
ALTER TABLE `scoreboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
