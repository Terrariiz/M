const express = require('express');
const router  = express.Router();

const lecturer_controller = require('../controllers/LecturerController');

// internal_lecturer CUD
/* 
    ส่งค่า : ส่งผ่าน Body ด้วย tags [fname, lname, position]
    อธิบาย :  เพิ่มข้อมูลที่ถูกส่งเข้า Table internal_lecturer
    คืนค่า : lecturer_id ล่าสุด
*/
router.post('/internal', lecturer_controller.cInternalLecturer);
/* 
    ส่งค่า : ส่งผ่าน Body ด้วย tags [lecturer_id, [, fname, lname, position]]
    อธิบาย : แก้ไขข้อมูลที่ถูกเก็บใน Table internal_lecturer ตาม lecturer_id ที่ได้รับ
    คืนค่า : String ของรายละเอียดการแก้ไข
*/
router.put('/internal', lecturer_controller.uInternalLecturer);
/* 
    ส่งค่า : ส่งผ่าน parameter lecturer_id ถ้ามีมากกว่า 1 id ให้คั่นด้วย comma(,)
    อธิบาย : ลบ Lecturer ออกจาก Table ตาม lecturer_id ที่กำหนด
    คืนค่า : จำนวน Lecturer ที่ได้รับผลของคำสั่ง {affectedInternalLecturer}
*/
router.delete('/internal/:lecturer_id', lecturer_controller.dInternalLecturer);

// external_lecturer CUD
/* 
    ส่งค่า : ส่งผ่าน Body ด้วย tags [fname, lname, position, department, faculty, university]
    อธิบาย :  เพิ่มข้อมูลที่ถูกส่งเข้า Table external_lecturer
    คืนค่า : lecturer_id ล่าสุด
*/
router.post('/external', lecturer_controller.cExternalLecturer);
/* 
    ส่งค่า : ส่งผ่าน Body ด้วย tags [lecturer_id, [, fname, lname, position, department, faculty, university]]
    อธิบาย : แก้ไขข้อมูลที่ถูกเก็บใน Table external_lecturer ตาม lecturer_id ที่ได้รับ
    คืนค่า : String ของรายละเอียดการแก้ไข
*/
router.put('/external', lecturer_controller.uExternalLecturer);
/* 
    ส่งค่า : ส่งผ่าน parameter lecturer_id ถ้ามีมากกว่า 1 id ให้คั่นด้วย comma(,)
    อธิบาย : ลบ Lecturer ออกจาก Table ตาม lecturer_id ที่กำหนด
    คืนค่า : จำนวน Lecturer ที่ได้รับผลของคำสั่ง {affectedExternalLecturer}
*/
router.delete('/external/:lecturer_id', lecturer_controller.dExternalLecturer);

/* 
    ส่งค่า : ส่งผ่าน params type และ id 
    อธิบาย : type ใช้บอกประเภท lecturer ว่าเป็น internal(0) หรือ external(1) และ id คือ lecturer_id
    คืนค่า : adviser_id
*/
router.post('/adviser/:type/:id', lecturer_controller.establishAdviser);

/* 
    ส่งค่า : ส่งผ่าน params ids ถ้ามีมากกว่า 1 id ให้คั่นด้วย comma(,)
    อธิบาย : ลบ Adviser ออกจาก Table ตาม adviser_id ที่กำหนด
    คืนค่า : ไม่มีการคืนค่า
*/
router.delete('/adviser/:ids', lecturer_controller.disestablishAdviser);

module.exports = router;