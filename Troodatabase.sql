-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 18, 2017 at 12:22 PM
-- Server version: 5.7.18-0ubuntu0.16.04.1
-- PHP Version: 7.0.18-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Troodatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `Course`
--

CREATE TABLE `Course` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Course`
--

INSERT INTO `Course` (`id`, `title`, `description`, `duration`, `createdAt`, `updatedAt`) VALUES
(4, '152', '4545', '9898sd', '2017-07-15 20:45:36', '2017-07-15 23:06:19'),
(6, 'Bingo', 'Its working now', '5h', '2017-07-15 20:53:09', '2017-07-15 20:53:09'),
(7, 'bjlkk;k;l', 'asdasd', 'asdasd', '2017-07-15 21:19:03', '2017-07-15 21:19:03'),
(8, 'bjlkk;k;l', 'asdasd', 'asdasd', '2017-07-15 21:19:32', '2017-07-15 21:19:32'),
(9, '152', '4545', '9898sd', '2017-07-15 21:19:46', '2017-07-15 23:00:58'),
(10, '152', '4545', '9898sd', '2017-07-15 21:23:01', '2017-07-15 22:58:43'),
(11, 'asdasd', 'asdasdas', '50s', '2017-07-15 21:24:57', '2017-07-15 21:24:57'),
(13, 'asasdasd1dasd', 'asdasdas', '9898sd', '2017-07-15 21:32:21', '2017-07-15 21:32:21'),
(14, 'asasdasd1dasd', '4545', '9898sd', '2017-07-15 21:36:00', '2017-07-15 21:36:00'),
(15, '1', '4545', '9898sd', '2017-07-15 21:37:15', '2017-07-15 21:37:15'),
(16, '12', '4545', '9898sd', '2017-07-15 21:40:10', '2017-07-15 21:40:10'),
(17, '152', '4545', '9898sd', '2017-07-15 22:49:50', '2017-07-15 22:49:50'),
(18, '1', '2', '3', '2017-07-15 23:06:53', '2017-07-15 23:06:53'),
(19, 'NEWtwo', 'nkjdfkjdhfj', '32', '2017-07-17 03:44:44', '2017-07-17 03:48:46'),
(20, 'NEW', 'nkjdfkjdhfj', '32', '2017-07-17 05:47:26', '2017-07-17 05:47:26');

-- --------------------------------------------------------

--
-- Table structure for table `Feedback`
--

CREATE TABLE `Feedback` (
  `id` int(5) NOT NULL,
  `loginid` int(5) NOT NULL,
  `videoid` int(5) NOT NULL,
  `feedback` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `MapVideo`
--

CREATE TABLE `MapVideo` (
  `id` int(5) NOT NULL,
  `courseid` int(5) NOT NULL,
  `videoid` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Member`
--

CREATE TABLE `Member` (
  `id` int(5) NOT NULL,
  `loginid` int(5) NOT NULL,
  `plan` varchar(10) NOT NULL,
  `duration` varchar(5) NOT NULL,
  `courseid` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Payment`
--

CREATE TABLE `Payment` (
  `id` int(5) NOT NULL,
  `memberid` int(5) NOT NULL,
  `mode` varchar(10) NOT NULL,
  `courseid` int(5) NOT NULL,
  `amount` varchar(5) NOT NULL,
  `transactionid` varchar(250) NOT NULL,
  `status` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` int(5) NOT NULL,
  `name` varchar(30) NOT NULL,
  `mobile` varchar(10) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(15) NOT NULL,
  `level` int(1) NOT NULL,
  `token` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `name`, `mobile`, `email`, `password`, `level`, `token`) VALUES
(1, 'user1', '9999999999', 'a@gmail.com', 'pass', 1, 'token');

-- --------------------------------------------------------

--
-- Table structure for table `Video`
--

CREATE TABLE `Video` (
  `id` int(5) NOT NULL,
  `title` varchar(20) NOT NULL,
  `description` mediumtext NOT NULL,
  `author` varchar(30) NOT NULL,
  `duration` varchar(5) NOT NULL,
  `file` longblob NOT NULL,
  `uploadedat` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ispublic` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Course`
--
ALTER TABLE `Course`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Feedback`
--
ALTER TABLE `Feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `loginid` (`loginid`),
  ADD KEY `videoid` (`videoid`);

--
-- Indexes for table `MapVideo`
--
ALTER TABLE `MapVideo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courseid` (`courseid`),
  ADD KEY `videoid` (`videoid`),
  ADD KEY `courseid_2` (`courseid`,`videoid`);

--
-- Indexes for table `Member`
--
ALTER TABLE `Member`
  ADD PRIMARY KEY (`id`),
  ADD KEY `loginid` (`loginid`,`courseid`),
  ADD KEY `courseid` (`courseid`);

--
-- Indexes for table `Payment`
--
ALTER TABLE `Payment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transactionid` (`transactionid`) USING BTREE,
  ADD KEY `memberid` (`memberid`,`courseid`),
  ADD KEY `courseid` (`courseid`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `Video`
--
ALTER TABLE `Video`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Course`
--
ALTER TABLE `Course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `Feedback`
--
ALTER TABLE `Feedback`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `MapVideo`
--
ALTER TABLE `MapVideo`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Member`
--
ALTER TABLE `Member`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Payment`
--
ALTER TABLE `Payment`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `Video`
--
ALTER TABLE `Video`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Feedback`
--
ALTER TABLE `Feedback`
  ADD CONSTRAINT `Feedback_ibfk_1` FOREIGN KEY (`loginid`) REFERENCES `User` (`id`),
  ADD CONSTRAINT `Feedback_ibfk_2` FOREIGN KEY (`videoid`) REFERENCES `Video` (`id`);

--
-- Constraints for table `MapVideo`
--
ALTER TABLE `MapVideo`
  ADD CONSTRAINT `MapVideo_ibfk_1` FOREIGN KEY (`courseid`) REFERENCES `Course` (`id`),
  ADD CONSTRAINT `MapVideo_ibfk_2` FOREIGN KEY (`videoid`) REFERENCES `Video` (`id`);

--
-- Constraints for table `Member`
--
ALTER TABLE `Member`
  ADD CONSTRAINT `Member_ibfk_1` FOREIGN KEY (`loginid`) REFERENCES `User` (`id`),
  ADD CONSTRAINT `Member_ibfk_2` FOREIGN KEY (`courseid`) REFERENCES `Course` (`id`);

--
-- Constraints for table `Payment`
--
ALTER TABLE `Payment`
  ADD CONSTRAINT `Payment_ibfk_1` FOREIGN KEY (`memberid`) REFERENCES `Member` (`id`),
  ADD CONSTRAINT `Payment_ibfk_2` FOREIGN KEY (`courseid`) REFERENCES `Course` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
