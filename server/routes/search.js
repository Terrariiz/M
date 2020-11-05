
const express = require('express');
const router  = express.Router();

const search = require('../controllers/SearchController');

/* 
    ส่งค่า : 
        ส่งผ่าน parameter indicator สำหรับกำหนดรูปแบบการค้นหา โดยมีรายการ indicator ดังนี้
            keyword : ค้น document_id จาก keyword_name หรือ ลิสต์ keyword_name ทั้งหมด
            title : ค้น document_id จาก document title
            author : ค้น document_id จาก first_name และหรือ last_name ของ student
            date : ค้น document_id ตั้งแต่วันที่กำหนด from จนถึงวันที่กำหนด to
            curriculum : ค้น document_id จาก curriculum name หรือ ลิสต์ curriculum table
            documents : เข้าถึงข้อมูลของ document จากรายการ document_id ที่กำหนด หรือ ลิสต์ข้อมูล document
            advisers : เข้าถึงข้อมูลของ lecturer จากรายการ adviser_id ที่กำหนด หรือ ลิสต์ข้อมูลของ lecturer
            authors : ค้น author_list ของ document จาก document_id
            students : เข้าถึงข้อมูลของ student จากรายการ student_id ที่กำหนด หรือ ลิสต์ข้อมูล student
            courses : เข้าถึงข้อมูลของ course จากรายการ course_id ที่กำหนด หรือ ลิสต์ course table
        และส่งผ่าน query ตามแต่ indicator ที่กำหนดโดยมีรายชื่อ query ตาม indicator แต่ละประเภทดังนี้
            keyword:
                query: 
                    list : boolean
                    limit : int
                    keyword1, ... , keyword10 : string
                examples:
                    search : /search/keyword?keyword1=MachineLearning&keyword2=ImageProcessing
                    list(auth require) : /search/keyword?list=true&limit=5
            title:
                query:
                    title : string
                example:
                    search : /search/title?title=CoronaPrediction
            author:
                query:
                    fname : string
                    lname : string
                example:
                    search : /search/author?fname=Somchai&lname=Jaidee
            date:
                query:
                    from : string
                    to : string
                    limit : int
                example:
                    search : /search/date?from='2019-06-13'&to='2020-03-11'&limit=20
            curriculum:
                query:
                    name : string
                    list : boolean
                    limit : int
                examples:
                    search : /search/curriculum?name=AppliedComputerScience
                    list(auth require) : /search/curriculum?list=true&limit=5
            documents:
                query:
                    ids : string
                    list : boolean
                    limit : int
                examples:
                    search : /search/documents?ids=1,2,3
                    list(auth require) : /search/documents?list=true&limit=20
            advisers:
                query:
                    ids : string
                    list : boolean
                    limit : int
                examples:
                    search : /search/advisers?ids=1,2,3
                    list(auth require) : /search/advisers?list=true&limit=20
            authors:
                query:
                    documentID : int
                example:
                    search : /search/authors?documentID=1
            students:
                query:
                    ids : string
                    list : boolean
                    limit : int
                examples:
                    search : /search/students?ids=1,2,3
                    list(auth require) : /search/students?list=true&limit=20
            courses:
                query:
                    ids : string
                    list : boolean
                    limit : int
                examples:
                    search : /search/courses?ids=1,2,3
                    list(auth require) : /search/courses?list=true&limit=20
*/
router.get('/:indicator', search.searchAdapter);

module.exports = router;