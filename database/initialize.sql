CREATE DATABASE research_report CHARACTER SET utf8 COLLATE utf8_unicode_ci;

USE research_report;

CREATE TABLE course
(
  course_id CHAR(6) NOT NULL,
  name VARCHAR(100) NOT NULL,
  year CHAR(6) NOT NULL,
  department VARCHAR(100) NOT NULL,
  credit INTEGER(1) NOT NULL,
  PRIMARY KEY (course_id)
);

CREATE TABLE curriculum
(
  curriculum_id INTEGER(3) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  degree VARCHAR(100) NOT NULL,
  PRIMARY KEY (curriculum_id)
);

CREATE TABLE student
(
  student_id CHAR(11) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password CHAR(60) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  curriculum_id INTEGER(3) UNSIGNED ZEROFILL NOT NULL,
  PRIMARY KEY (student_id),
  FOREIGN KEY (curriculum_id) REFERENCES curriculum(curriculum_id)
);

CREATE TABLE external_lecturer
(
  lecturer_id INTEGER(4) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  position VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  faculty VARCHAR(100) NOT NULL,
  university VARCHAR(100) NOT NULL,
  PRIMARY KEY(lecturer_id)
);

CREATE TABLE internal_lecturer
(
  lecturer_id INTEGER(4) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  position VARCHAR(100) NOT NULL,
  PRIMARY KEY(lecturer_id)
);

CREATE TABLE adviser
(
  adviser_id INTEGER(4) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  i_lecturer_id INTEGER(4) UNSIGNED ZEROFILL,
  e_lecturer_id INTEGER(4) UNSIGNED ZEROFILL,
  FOREIGN KEY (i_lecturer_id) REFERENCES internal_lecturer(lecturer_id),
  FOREIGN KEY (e_lecturer_id) REFERENCES external_lecturer(lecturer_id),
  PRIMARY KEY (adviser_id)
);

CREATE TABLE submit
(
  student_id CHAR(11) NOT NULL,
  course_id CHAR(6) NOT NULL,
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES student(student_id),
  FOREIGN KEY (course_id) REFERENCES course(course_id)
);

CREATE TABLE keyword
(
  keyword_id INTEGER(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  keyword VARCHAR(50) NOT NULL,
  PRIMARY KEY (keyword_id)
);

CREATE TABLE document
(
  document_id INTEGER(12) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  name VARCHAR(300) NOT NULL,
  abstract VARCHAR(1000) NOT NULL,
  file_path VARCHAR(300) NOT NULL,
  upload_dt DATE NOT NULL,
  adviser_id INTEGER(4) UNSIGNED ZEROFILL NOT NULL,
  course_id CHAR(6) NOT NULL,
  status INTEGER(1) UNSIGNED NOT NULL,
  PRIMARY KEY (document_id),
  FOREIGN KEY (adviser_id) REFERENCES adviser(adviser_id),
  FOREIGN KEY (course_id) REFERENCES course(course_id)
);

CREATE TABLE coadviser
(
  document_id INTEGER(12) UNSIGNED ZEROFILL NOT NULL,
  avs_1 INTEGER(4) UNSIGNED ZEROFILL,
  avs_2 INTEGER(4) UNSIGNED ZEROFILL,
  PRIMARY KEY (document_id),
  FOREIGN KEY (avs_1) REFERENCES adviser(adviser_id),
  FOREIGN KEY (avs_2) REFERENCES adviser(adviser_id),
  FOREIGN KEY (document_id) REFERENCES document(document_id)
);

CREATE TABLE keyword_list
(
  document_id INTEGER(12) UNSIGNED ZEROFILL NOT NULL,
  kid_1 INTEGER(5) UNSIGNED ZEROFILL NOT NULL,
  kid_2 INTEGER(5) UNSIGNED ZEROFILL,
  kid_3 INTEGER(5) UNSIGNED ZEROFILL,
  kid_4 INTEGER(5) UNSIGNED ZEROFILL,
  kid_5 INTEGER(5) UNSIGNED ZEROFILL,
  kid_6 INTEGER(5) UNSIGNED ZEROFILL,
  kid_7 INTEGER(5) UNSIGNED ZEROFILL,
  kid_8 INTEGER(5) UNSIGNED ZEROFILL,
  kid_9 INTEGER(5) UNSIGNED ZEROFILL,
  kid_10 INTEGER(5) UNSIGNED ZEROFILL,
  PRIMARY KEY (document_id),
  FOREIGN KEY (document_id) REFERENCES document(document_id),
  FOREIGN KEY (kid_1) REFERENCES keyword(keyword_id),
  FOREIGN KEY (kid_2) REFERENCES keyword(keyword_id),
  FOREIGN KEY (kid_3) REFERENCES keyword(keyword_id),
  FOREIGN KEY (kid_4) REFERENCES keyword(keyword_id),
  FOREIGN KEY (kid_5) REFERENCES keyword(keyword_id),
  FOREIGN KEY (kid_6) REFERENCES keyword(keyword_id),
  FOREIGN KEY (kid_7) REFERENCES keyword(keyword_id),
  FOREIGN KEY (kid_8) REFERENCES keyword(keyword_id),
  FOREIGN KEY (kid_9) REFERENCES keyword(keyword_id),
  FOREIGN KEY (kid_10) REFERENCES keyword(keyword_id)
);

CREATE TABLE author_list
(
  document_id INTEGER(12) UNSIGNED ZEROFILL NOT NULL,
  std_1 CHAR(11) NOT NULL,
  std_2 CHAR(11),
  std_3 CHAR(11),
  PRIMARY KEY (document_id),
  FOREIGN KEY (std_1) REFERENCES student(student_id),
  FOREIGN KEY (std_2) REFERENCES student(student_id),
  FOREIGN KEY (std_3) REFERENCES student(student_id),
  FOREIGN KEY (document_id) REFERENCES document(document_id)
);

CREATE TABLE commitee
(
  document_id INTEGER(12) UNSIGNED ZEROFILL NOT NULL,
  name_1 VARCHAR(100),
  name_2 VARCHAR(100),
  name_3 VARCHAR(100),
  PRIMARY KEY (document_id),
  FOREIGN KEY (document_id) REFERENCES document(document_id)
);

CREATE TABLE staff
(
  staff_id INTEGER(4) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  username VARCHAR(30),
  password CHAR(60),
  email VARCHAR(50),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  position VARCHAR(100),
  PRIMARY KEY (staff_id)
);
