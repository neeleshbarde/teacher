-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 12, 2019 at 01:48 AM
-- Server version: 10.2.26-MariaDB-cll-lve
-- PHP Version: 7.2.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `msquaresys_teacher`
--

-- --------------------------------------------------------

--
-- Table structure for table `langteachermap`
--

CREATE TABLE `langteachermap` (
  `id` int(11) NOT NULL,
  `lang_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `langteachermap`
--

INSERT INTO `langteachermap` (`id`, `lang_id`, `teacher_id`, `rating`, `status`) VALUES
(1000, 1, 11, 9, 'Y'),
(1001, 2, 11, 1, 'Y'),
(1002, 3, 11, 8, 'Y'),
(1003, 4, 11, 3, 'Y'),
(1004, 1, 12, 4, 'Y'),
(1005, 3, 12, 5, 'Y'),
(1006, 2, 13, 6, 'Y'),
(1007, 4, 13, 7, 'Y'),
(1008, 1, 14, 6, 'Y'),
(1009, 2, 15, 8, 'Y'),
(1010, 3, 16, 9, 'Y'),
(1011, 4, 17, 7, 'Y'),
(1012, 1, 18, 6, 'Y'),
(1013, 2, 19, 6, 'Y'),
(1014, 3, 20, 7, 'Y'),
(1015, 4, 21, 8, 'Y'),
(1016, 1, 22, 8, 'Y'),
(1017, 2, 23, 9, 'Y'),
(1018, 3, 24, 8, 'Y'),
(10159, 4, 25, 7, 'Y');

-- --------------------------------------------------------

--
-- Table structure for table `language`
--

CREATE TABLE `language` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `suffix` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `language`
--

INSERT INTO `language` (`id`, `name`, `suffix`) VALUES
(1, 'English', 'en'),
(2, 'Mandarian', 'ch'),
(3, 'Cantanes', 'zh'),
(4, 'Japanese', 'jp');

-- --------------------------------------------------------

--
-- Table structure for table `samplevideos`
--

CREATE TABLE `samplevideos` (
  `id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `srcMP4` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `samplevideos`
--

INSERT INTO `samplevideos` (`id`, `teacher_id`, `srcMP4`) VALUES
(1, 11, 'https://www.msquaresys.com/teacher/sampleVideo/big_buck_bunny_240p_10mb.mp4'),
(2, 11, 'https://www.msquaresys.com/teacher/sampleVideo/big_buck_bunny_240p_5mb.mp4');

-- --------------------------------------------------------

--
-- Table structure for table `samplevideosyoutube`
--

CREATE TABLE `samplevideosyoutube` (
  `id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `link` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `samplevideosyoutube`
--

INSERT INTO `samplevideosyoutube` (`id`, `teacher_id`, `link`) VALUES
(1, 11, 'https://www.msquaresys.com/teacher/sampleVideo/big_buck_bunny_240p_10mb.mp4'),
(2, 11, 'https://www.msquaresys.com/teacher/sampleVideo/big_buck_bunny_240p_5mb.mp4');

-- --------------------------------------------------------

--
-- Table structure for table `sessionschedule`
--

CREATE TABLE `sessionschedule` (
  `id` int(11) NOT NULL,
  `langteachermap_id` int(11) NOT NULL,
  `startTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `endTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sessionschedule`
--

INSERT INTO `sessionschedule` (`id`, `langteachermap_id`, `startTime`, `endTime`, `status`) VALUES
(10001, 1000, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10002, 1001, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10003, 1002, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10004, 1003, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10005, 1004, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10006, 1005, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10007, 1006, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10008, 1007, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10009, 1005, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10010, 1007, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10011, 1000, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10012, 1001, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10013, 1002, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10014, 1003, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10015, 1004, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10016, 1005, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10017, 1006, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED'),
(10018, 1007, '2019-11-09 16:00:00', '2019-11-14 16:00:00', 'SCHEDULED');

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE `teacher` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `photo_src` varchar(100) NOT NULL,
  `university` varchar(100) NOT NULL,
  `loc` varchar(100) NOT NULL,
  `yrs` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `mobile` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`id`, `name`, `username`, `password`, `photo_src`, `university`, `loc`, `yrs`, `email`, `phone`, `mobile`, `description`) VALUES
(11, 'Teacher1', 'Teacher1', 'Teacher1', 'http://www.msquaresys.com/teacher/teacherProfile/11.jpg', 'Teacher1 University', 'Teacher1 loc', '11 yrs', 'Teacher1@email.com', '123456789', '987654321', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(12, 'Teacher2', 'Teacher2', 'Teacher2', 'http://www.msquaresys.com/teacher/teacherProfile/12.jpg', 'Teacher2 University', 'Teacher2 loc', '12 yrs', 'Teacher2@email.com', '22222222', '202222222', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(13, 'Teacher3', 'Teacher3', 'Teacher3', 'http://www.msquaresys.com/teacher/teacherProfile/13.jpg', 'Teacher3 University', 'Teacher3 loc', '13 yrs', 'Teacher3@email.com', '33333333', '30303030', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(14, 'Teacher4', 'Teacher4', 'Teacher4', 'http://www.msquaresys.com/teacher/teacherProfile/14.jpg', 'Teacher4 University', 'Teacher4 loc', '14 yrs', 'Teacher4@email.com', '44444444', '4040404040', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(15, 'Teacher5', 'Teacher5', 'Teacher5', 'http://www.msquaresys.com/teacher/teacherProfile/15.jpg', 'Teacher5 University', 'Teacher5 loc', '15 yrs', 'Teacher5@email.com', '55555555', '5050505050', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(16, 'Teacher6', 'Teacher6', 'Teacher6', 'http://www.msquaresys.com/teacher/teacherProfile/16.jpg', 'Teacher6 University', 'Teacher6 loc', '16 yrs', 'Teacher6@email.com', '66666666', '6060606060', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(17, 'Teacher7', 'Teacher7', 'Teacher7', 'http://www.msquaresys.com/teacher/teacherProfile/17.jpg', 'Teacher7 University', 'Teacher7 loc', '17 yrs', 'Teacher7@email.com', '77777777', '7070707070', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(18, 'Teacher8', 'Teacher8', 'Teacher8', 'http://www.msquaresys.com/teacher/teacherProfile/18.jpg', 'Teacher8 University', 'Teacher8 loc', '18 yrs', 'Teacher8@email.com', '88888888', '8080808080', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(19, 'Teacher9', 'Teacher9', 'Teacher9', 'http://www.msquaresys.com/teacher/teacherProfile/19.jpg', 'Teacher9 University', 'Teacher9 loc', '19 yrs', 'Teacher9@email.com', '99999999', '9090909090', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(20, 'Teacher10', 'Teacher10', 'Teacher10', 'http://www.msquaresys.com/teacher/teacherProfile/20.jpg', 'Teacher10 University', 'Teacher10 loc', '21 yrs', 'Teacher10@email.com', '123456789', '987654321', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(21, 'Teacher11', 'Teacher11', 'Teacher11', 'http://www.msquaresys.com/teacher/teacherProfile/21.jpg', 'Teacher11 University', 'Teacher11 loc', '21 yrs', 'Teacher11@email.com', '123456789', '987654321', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(22, 'Teacher12', 'Teacher12', 'Teacher12', 'http://www.msquaresys.com/teacher/teacherProfile/22.jpg', 'Teacher12 University', 'Teacher12 loc', '22 yrs', 'Teacher12@email.com', '22222222', '202222222', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(23, 'Teacher23', 'Teacher23', 'Teacher23', 'http://www.msquaresys.com/teacher/teacherProfile/23.jpg', 'Teacher23 University', 'Teacher23 loc', '13 yrs', 'Teacher23@email.com', '33333333', '30303030', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(24, 'Teacher24', 'Teacher24', 'Teacher24', 'http://www.msquaresys.com/teacher/teacherProfile/24.jpg', 'Teacher24 University', 'Teacher24 loc', '14 yrs', 'Teacher24@email.com', '44444444', '4040404040', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(25, 'Teacher25', 'Teacher25', 'Teacher25', 'http://www.msquaresys.com/teacher/teacherProfile/25.jpg', 'Teacher25 University', 'Teacher25 loc', '15 yrs', 'Teacher25@email.com', '55555555', '5050505050', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(26, 'Teacher26', 'Teacher26', 'Teacher26', 'http://www.msquaresys.com/teacher/teacherProfile/26.jpg', 'Teacher26 University', 'Teacher26 loc', '16 yrs', 'Teacher26@email.com', '66666666', '6060606060', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(27, 'Teacher27', 'Teacher27', 'Teacher27', 'http://www.msquaresys.com/teacher/teacherProfile/27.jpg', 'Teacher27 University', 'Teacher27 loc', '17 yrs', 'Teacher27@email.com', '77777777', '7070707070', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(28, 'Teacher28', 'Teacher28', 'Teacher28', 'http://www.msquaresys.com/teacher/teacherProfile/28.jpg', 'Teacher28 University', 'Teacher28 loc', '18 yrs', 'Teacher28@email.com', '88888888', '8080808080', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
(29, 'Teacher29', 'Teacher29', 'Teacher29', 'http://www.msquaresys.com/teacher/teacherProfile/29.jpg', 'Teacher29 University', 'Teacher29 loc', '19 yrs', 'Teacher29@email.com', '99999999', '9090909090', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `langteachermap`
--
ALTER TABLE `langteachermap`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `language`
--
ALTER TABLE `language`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `samplevideos`
--
ALTER TABLE `samplevideos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `samplevideosyoutube`
--
ALTER TABLE `samplevideosyoutube`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessionschedule`
--
ALTER TABLE `sessionschedule`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `langteachermap`
--
ALTER TABLE `langteachermap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10160;

--
-- AUTO_INCREMENT for table `samplevideos`
--
ALTER TABLE `samplevideos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `samplevideosyoutube`
--
ALTER TABLE `samplevideosyoutube`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sessionschedule`
--
ALTER TABLE `sessionschedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10019;

--
-- AUTO_INCREMENT for table `teacher`
--
ALTER TABLE `teacher`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
