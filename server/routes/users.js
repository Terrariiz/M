const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/UserController');

/* 
    ส่งค่า : ส่งผ่าน body ด้วย tags [studentId, email, password, fname, lname, curriculumId]
    อธิบาย : เพิ่มข้อมูลที่ถูกส่งเข้าสู่ Table student 
    คืนค่า : Boolean
*/
router.post('/', user_controller.cStudent);

/* 
    ส่งค่า : ไม่มีการส่งค่า
    อธิบาย : ร้องขอข้อมูลของ Account โดยอ้างอิงจาก token ที่ถุกเก็บอยู่บน request header 
    คืนค่า : ข้อมูลของ Account ที่ประกอบไปด้วย {student_id, email, first_name, last_name, curriculum_id}
*/
router.get('/', user_controller.rStudent);

/* 
    ส่งค่า : ส่งผ่าน body ด้วย tags [student_id, old_password [, new_password, email, fname, lname, curriculum_id]]
    อธิบาย : แก้ไขข้อมูลที่ถูกเก็บใน Account ตาม student_id ที่ได้รับ 
    คืนค่า :  String ของรายละเอียดการแก้ไข
*/
router.put('/', user_controller.uStudent);

/* 
    ส่งค่า : ส่งผ่าน parameter student_id
    อธิบาย : ลบ Student account ออกจากฐานข้อมูลตาม student_id ที่ได้รับ
    คืนค่า : จำนวน account ที่ได้รับผลของคำสั่ง {affectedStudent} มีค่าเป็น 0 หรือ 1
*/
router.delete('/:student_id', user_controller.dStudent);

/* 
    ส่งค่า : ส่งผ่าน body ด้วย tags [email, password]
    อธิบาย : ตรวจสอบ username, password ที่ถูกส่งเข้ามากับฐานข้อมูล
    คืนค่า : token 
*/
router.post('/signin', user_controller.signin);

/* 
    ส่งค่า : ไม่มีการส่งค่า
    อธิบาย : ตรวจสอบความถูกต้องของ token ที่ถูกเก็บอยู่ในส่วน Authorization บน request header มีชนิดเป็น Bearer : https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
    คืนค่า : decode ของ payload ที่ประกอบไปด้วย {email,student_id, iat, exp}
*/
router.get('/verify', user_controller.verifyToken);

module.exports = router;