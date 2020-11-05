const express = require('express');
const router = express.Router();

const document_controller = require('../controllers/DocumentController');

/* 
    ส่งค่า : ส่งผ่าน body ด้วย tags 
           [name, abstract, [keywords], courseId, adviserId [, coadvisers[, commitees[, [students] ]]]
           และส่งไฟล์ thesis ในรูปแบบ pdf ขนาดไม่เกิน 10MB ผ่าน input box ที่กำหนด id และ name ชื่อ thesis
    อธิบาย : เขียนไฟล์ลงใน Server และทำการเก็บข้อมูลลงใน document, commitee, coadviser, keyword_list, author_list
    คืนค่า : document_id ล่าสุด
*/
router.post('/', document_controller.cDocument);

/* 
    ส่งค่า : ส่งผ่าน body ด้วย tags และส่ง document_id ผ่าน params โดยกำหนดเป็น id
           [name, abstract, [keywords], courseId, adviserId [, coadvisers[, commitees[, [students] ]]]
           โดยหากต้องการแก้ไขไฟล์ thesis ให้ทำการส่งไฟล์ thesis ในรูปแบบ pdf ขนาดไม่เกิน 10MB ผ่าน input box ที่กำหนด id และ name ชื่อ thesis
           สำหรับการแก้ไข้สมาชิกผู้เขียน thesis (author_list) จำเป็นต้องกำหมด courseId มาด้วยทุกครั้ง
    อธิบาย : อัพเดทข้อมูลใน Table document และ Table อื่นๆที่เกี่ยวข้องทั้งหมด
    คืนค่า : ไม่มีการคืนค่า
*/
router.put('/:id', document_controller.uDocument);

/* 
    ส่งค่า : ส่ง document_id ผ่าน params โดยกำหนดเป็น id
    อธิบาย : ลบ document และข้อมูลอื่นๆที่เกี่ยวข้องกับ document ออกตาม document_id ที่กำหนด
    คืนค่า : ไม่มีการคืนค่า
*/
router.delete('/:id', document_controller.dDocument);


module.exports = router;