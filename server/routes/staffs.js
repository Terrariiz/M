const express = require('express');
const router  = express.Router();

const staff_controller = require('../controllers/StaffController');

/* 
    ส่งค่า : ส่งผ่าน body ด้วย tags [username, password, email, fname, lname, position]
    อธิบาย : เพิ่มข้อมูลที่ถูกส่งเข้าสู่ Table staff 
    คืนค่า : staff_id ล่าสุด
*/
router.post('/', staff_controller.cStaff);
/* 
    ส่งค่า : ไม่มีการส่งค่า
    อธิบาย : ร้องขอข้อมูลของ Account โดยอ้างอิงจาก token ที่ถุกเก็บอยู่บน request header 
    คืนค่า : ข้อมูลของ Account ที่ประกอบไปด้วย {staff_id, username, email, first_name, last_name, position}
*/
router.get('/', staff_controller.rStaff);
/* 
    ส่งค่า : ส่งผ่าน body ด้วย tags [staff_id, old_password [, new_password, email, fname, lname, position]]
    อธิบาย : แก้ไขข้อมูลที่ถูกเก็บใน Account ตาม staff_id ที่ได้รับ 
    คืนค่า :  String ของรายละเอียดการแก้ไข
*/
router.put('/', staff_controller.uStaff);
/* 
    ส่งค่า : ส่งผ่าน parameter staff_id 
    อธิบาย : ลบ Staff account ออกจากฐานข้อมูลตาม staff_id ที่ได้รับ
    คืนค่า : จำนวน account ที่ได้รับผลของคำสั่ง {affectedStaff} มีค่าเป็น 0 หรือ 1
*/
router.delete('/:staff_id', staff_controller.dStaff);
/* 
    ส่งค่า : ส่งผ่าน body ด้วย tags [username, password]
    อธิบาย : ตรวจสอบ username, password ที่ถูกส่งเข้ามากับฐานข้อมูล
    คืนค่า : token 
*/
router.post('/signin', staff_controller.signin);
/* 
    ส่งค่า : ไม่มีการส่งค่า
    อธิบาย : ตรวจสอบความถูกต้องของ token ที่ถูกเก็บอยู่ในส่วน Authorization บน request header มีชนิดเป็น Bearer : https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
    คืนค่า : decode ของ payload ที่ประกอบไปด้วย {username, staff_id, iat, exp}
*/
router.get('/verify', staff_controller.verifyToken);

module.exports = router;