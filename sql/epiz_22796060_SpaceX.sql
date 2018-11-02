-- phpMyAdmin SQL Dump
-- version 3.5.8.2
-- http://www.phpmyadmin.net
--
-- Host: sql205.epizy.com
-- Generation Time: Nov 02, 2018 at 01:19 PM
-- Server version: 5.6.41-84.1
-- PHP Version: 5.3.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `epiz_22796060_SpaceX`
--

-- --------------------------------------------------------

--
-- Table structure for table `record`
--

CREATE TABLE IF NOT EXISTS `record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `score` (`score`),
  KEY `date` (`time`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=17 ;

--
-- Dumping data for table `record`
--

INSERT INTO `record` (`id`, `username`, `score`, `time`) VALUES
(1, 'ÐšÐ°Ñ€Ð¸Ð½Ð°', 60, '2018-11-02 06:39:59'),
(2, 'ÐšÐ°Ñ€Ð¸Ð½Ð°', 61, '2018-11-02 06:41:04'),
(3, 'ÐšÐ°Ñ€Ð¸Ð½Ð°', 57, '2018-11-02 06:44:24'),
(4, 'ÐšÐ°Ñ€Ð¸Ð½Ð°', 63, '2018-11-02 06:45:31'),
(5, 'ÐšÐ°Ñ€Ð¸Ð½Ð°', 66, '2018-11-02 06:47:03'),
(6, 'ÐšÐ°Ñ€Ð¸Ð½Ð°', 95, '2018-11-02 06:49:26'),
(7, 'ÐšÐ°Ñ€Ð¸Ð½Ð°', 50, '2018-11-02 06:50:48'),
(8, 'ÐšÐ°Ñ€Ð¸Ð½Ð°', 74, '2018-11-02 06:56:03'),
(9, 'Sorokina', 76, '2018-11-02 07:47:47'),
(10, 'Sorokina', 93, '2018-11-02 07:49:29'),
(11, 'Sorokina', 72, '2018-11-02 08:32:10'),
(12, 'Karina', 84, '2018-11-02 08:33:53'),
(13, 'Karina', 91, '2018-11-02 08:35:30'),
(14, 'Karina', 33, '2018-11-02 08:36:18'),
(15, 'Karina', 116, '2018-11-02 08:38:25'),
(16, 'OLesya', 42, '2018-11-02 09:53:39');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
