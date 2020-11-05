const express = require('express');
const router  = express.Router();

const keyword_controller = require('../controllers/KeywordController');

/* 
    ส่งค่า : ส่งผ่าน parameter keyword เป็น String ของ Keyword ถ้ามีมากกว่า 1 Keyword ให้คั่นด้วย Comma เช่น "Keyword1,Keyword2" หรือ "Keyword1"
    อธิบาย : เพิ่ม Keyword ใหม่ลงใน table keyword
    คืนค่า : ข้อมูล Keyword ที่เพิ่มสำเร็จโดยประกอบไปด้วย {keywords, count}
*/
router.post('/:keyword', keyword_controller.cKeyword);
/* 
    ส่งค่า : ส่งผ่าน parameter keyword_id เป็น String ของ keyword_id ถ้ามีมากกว่า 1 keyword_id ให้คั่นด้วย Comma เช่น "keyword_id1,keyword_id2" หรือ "keyword_id1",
           ส่งผ่าน parameter keyword เป็น String ของ Keyword ถ้ามีมากกว่า 1 Keyword ให้คั่นด้วย Comma เช่น "Keyword1,Keyword2" หรือ "Keyword1"
    อธิบาย : แก้ไข Keyword ใน table keyword ตาม keyword_id ที่กำหนด
    คืนค่า : ข้อมูล Keyword ที่แก้ไขสำเร็จโดยประกอบไปด้วย {updated_ids, count}
*/
router.put('/:keyword_id/:keyword', keyword_controller.uKeyword);
/* 
    ส่งค่า : ส่งผ่าน parameter keyword_id เป็น String ของ keyword_id ถ้ามีมากกว่า 1 keyword_id ให้คั่นด้วย Comma เช่น "keyword_id1,keyword_id2" หรือ "keyword_id1"
    อธิบาย : ลบ Keyword ออกจาก table keyword ตาม keyword_id ที่กำหนด
    คืนค่า : ข้อมูล Keyword ที่ลบสำเร็จโดยประกอบไปด้วย {ids, count}
*/
router.delete('/:keyword_id', keyword_controller.dKeyword);

module.exports = router;