/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50553
Source Host           : localhost:3306
Source Database       : nl-web

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2017-03-29 15:26:48
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for template_config
-- ----------------------------
DROP TABLE IF EXISTS `template_config`;
CREATE TABLE `template_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_no` int(11) DEFAULT NULL,
  `template_name` varchar(255) DEFAULT NULL,
  `template_description` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `logo_background_color` varchar(255) DEFAULT NULL,
  `payment_checkout` varchar(255) DEFAULT NULL,
  `payment_type` varchar(255) DEFAULT NULL,
  `tax_rate` double(255,0) DEFAULT NULL,
  `main_pic_1` varchar(255) DEFAULT NULL,
  `main_pic_2` varchar(255) DEFAULT NULL,
  `main_pic_3` varchar(255) DEFAULT NULL,
  `main_pic_4` varchar(255) DEFAULT NULL,
  `main_pic_5` varchar(255) DEFAULT NULL,
  `main_background_color` varchar(255) DEFAULT NULL,
  `main_trim_color` varchar(255) DEFAULT NULL,
  `button_color` varchar(255) DEFAULT NULL,
  `create_user` varchar(255) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT NULL,
  `update_user` varchar(255) DEFAULT NULL,
  `update_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `is_actived` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for template_item
-- ----------------------------
DROP TABLE IF EXISTS `template_item`;
CREATE TABLE `template_item` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for template_item_add
-- ----------------------------
DROP TABLE IF EXISTS `template_item_add`;
CREATE TABLE `template_item_add` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `template_item_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for template_item_more
-- ----------------------------
DROP TABLE IF EXISTS `template_item_more`;
CREATE TABLE `template_item_more` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL,
  `template_item_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for template_item_remove
-- ----------------------------
DROP TABLE IF EXISTS `template_item_remove`;
CREATE TABLE `template_item_remove` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL,
  `group_name` varchar(255) DEFAULT NULL,
  `template_item_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for template_left_config
-- ----------------------------
DROP TABLE IF EXISTS `template_left_config`;
CREATE TABLE `template_left_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_config_id` int(11) NOT NULL,
  `background_color` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for template_left_item_config
-- ----------------------------
DROP TABLE IF EXISTS `template_left_item_config`;
CREATE TABLE `template_left_item_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_left_config_id` int(11) NOT NULL,
  `label` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for template_main_menu_config
-- ----------------------------
DROP TABLE IF EXISTS `template_main_menu_config`;
CREATE TABLE `template_main_menu_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `parent_id` int(255) NOT NULL,
  `template_left_item_config_id` int(11) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `add_submenu` tinyint(4) DEFAULT NULL,
  `modifter` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
SET FOREIGN_KEY_CHECKS=1;
