const express = require("express");

const router  = express.Router();

const course_controller = require("../controllers/CourseController");

// Course Route
/* 
    ส่งค่า : ส่งผ่าน body ด้วย tags [courseId, name, year, department, credit]
    อธิบาย :  เพิ่มข้อมูลที่ถูกส่งเข้า table course
    คืนค่า : course_id ล่าสุด
*/
router.post('/', course_controller.cCourse);

/* 
    ส่งค่า : ส่งผ่าน Body ด้วย tags [id, [, name, year, department, credit]]
    อธิบาย : แก้ไขข้อมูลที่ถูกเก็บใน Table course ตาม id ที่ได้รั
    คืนค่า : String ของรายละเอียดการแก้ไข
*/
router.put('/:id', course_controller.uCourse);

/* 
    ส่งค่า : ส่งผ่าน parameter ids ถ้ามีมากกว่า 1 id ให้คั่นด้วย comma(,)
    อธิบาย : ลบ course ออกจาก Table ตาม ids ที่กำหนด
    คืนค่า : จำนวน course ที่ได้รับผลของคำสั่ง {affectedCourse}
*/
router.delete('/:ids', course_controller.dCourse);

// Submit Routes
/* 
    ส่งค่า : ส่งผ่าน parameters sid, cid (student_id, course_id)
    อธิบาย :  เพิ่มข้อมูลที่ถูกส่งเข้า table submit
    คืนค่า : boolean 
*/
router.post('/submit/:sid/:cid', course_controller.cSubmit);

/* 
    ส่งค่า : ส่งผ่าน parameters sid, cid (student_id, course_id)
    อธิบาย : ตรวจสอบข้อมูลสถานะการส่งงาน(Submit)ใน submit โดยอ้างอิงจาก sid และ cid
    คืนค่า : {submited : boolean} ที่เป็น true เมื่อ student_id นั้นได้ทำการ submit งานใน course_id นั้น นอกนั้นเป็น false
*/
router.get('/submit/:sid/:cid', course_controller.checkSubmit);

/* 
    ส่งค่า : ส่งผ่าน parameters sid, cid (student_id, course_id)
    อธิบาย : ลบ submit ออกจาก Table ตาม sid และ cid ที่กำหนด
    คืนค่า : จำนวน submit ที่ได้รับผลของคำสั่ง {affectedSubmit}
*/
router.delete('/submit/:sid/:cid', course_controller.dSubmit);

module.exports = router;