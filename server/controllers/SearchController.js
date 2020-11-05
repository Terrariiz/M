/* eslint-disable */
/*eslint no-console: ["error", { allow: ["warn", "error", "info", "log"] }] */
/* eslint no-unused-vars: 0 */
const SqlConnect           = require("./SqlConnect");
const validator            = require("validator");
const Authenication        = require("./StaffAuthenication");
const StudentAuthenication = require("./StudentAuthenication");
const verify               = Authenication.verify;
const studentVerify        = StudentAuthenication.verify;

const searchAdapter = async (req, res) => {
    const indicator = req.params.indicator;
    let result, code;
    switch(indicator) {
        case "keyword":
            [code, result] = await keywordSearch(req.query, req.token)
            break;
        case "title":
            [code, result] = await titleSearch(req.query)
            break;
        case "author":
            [code, result] = await authorSearch(req.query)
            break;
        case "date":
            [code, result] = await dateSearch(req.query)
            break;
        case "curriculum":
            [code, result] = await curriculumSearch(req.query, req.token)
            break;
        case "documents":
            [code, result] = await documentsSearch(req.query, req.token)
            break;
        case "advisers":
            [code, result] = await advisersSearch(req.query, req.token)
            break;
        case "authors":
            [code, result] = await authorsSearch(req.query)
            break;
        case "students":
            [code, result] = await studentsSearch(req.query, req.token)
            break;
        case "courses":
            [code, result] = await coursesSearch(req.query, req.token)
            break;
    }
    if (code === 0) 
        return res.status(400).json({
            success: false,
            message: "Bad Request",
            data : {}
        })
    else if (code === 1) 
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data : {}
        })
    else
        return res.status(code).json(result);
};

const keywordSearch = async (keywords, token) => {
    const re        = /^keyword(?:[1-9]|10)$/, // Check query string name pattern = keyword1 ... keyword10 ?
          kws       = [],
          list      = typeof keywords['list'] === 'undefined' ? false : (keywords['list'] === 'true'),
          limit     = typeof keywords['limit'] === 'undefined' ? '' : keywords['limit'];
    let   statement = "\
            SELECT DISTINCT document_id FROM\
                (keyword_list JOIN keyword ON \
                    keyword_list.kid_1 = keyword.keyword_id OR \
                    keyword_list.kid_2 = keyword.keyword_id OR \
                    keyword_list.kid_3 = keyword.keyword_id OR \
                    keyword_list.kid_4 = keyword.keyword_id OR \
                    keyword_list.kid_5 = keyword.keyword_id OR \
                    keyword_list.kid_6 = keyword.keyword_id OR \
                    keyword_list.kid_7 = keyword.keyword_id OR \
                    keyword_list.kid_8 = keyword.keyword_id OR \
                    keyword_list.kid_9 = keyword.keyword_id OR \
                    keyword_list.kid_10 = keyword.keyword_id\
                )\
            WHERE";
    if (list){
        let [code, json] = await requirePermission(token)
        if (code !== 0) return [code, json]
        statement = "SELECT DISTINCT * FROM keyword"
        if (limit && validator.isInt(limit)) statement += ` LIMIT ${limit}`
        return query(statement)
    } else {
        for (let key in keywords) {
            if (re.test(key)) {
                statement += ` keyword.keyword = ? OR`
                kws.push(keywords[key])
            }
        }
        statement = statement.slice(0, -3)
        if (kws.length === 0) return [0, 0]
        else return query(statement, kws);
    }
}

const titleSearch = async (title) => {
        title      = typeof title['title'] === 'undefined' ? '' : title['title']
    let statement  = "SELECT document_id FROM document WHERE name = ?";
    if (title === '') return [0, 0];
    return query(statement, [title]);
}

const authorSearch = async (author) => {
    const author_fname = typeof author['fname'] === 'undefined' ? '*' : author['fname'],
          author_lname = typeof author['lname'] === 'undefined' ? '*' : author['lname'];
    let   statement    = "\
            SELECT DISTINCT document_id FROM\
                (author_list JOIN student ON \
                    (\
                        author_list.std_1 = student.student_id OR \
                        author_list.std_2 = student.student_id OR \
                        author_list.std_3 = student.student_id\
                    )\
                    AND \
                    (\
                        student.first_name = ? \
                        OR student.last_name = ?\
                    )\
            )";
    if (author_fname === '*' && author_lname === '*') return [0, 0];
    return query(statement, [author_fname, author_lname]);
}

const dateSearch = async (date) => {
    const today      = `${(new Date()).getFullYear()}-${(new Date()).getMonth()+1}-${(new Date()).getDate()}`
          from_date  = typeof date['from'] === 'undefined' ? today : date['from'],
          to_date    = typeof date['to'] === 'undefined' ? today : date['to'];
    let   statement  = "SELECT DISTINCT document_id FROM document WHERE upload_dt >= ? AND upload_dt < ?"
    if (typeof date['limit'] !== 'undefined' && validator.isInt(date['limit'])) statement += ` LIMIT ${date['limit']}`
    return query(statement, [from_date, to_date]);
}

const curriculumSearch = async (curriculum, token) => {
    const curriculum_name = typeof curriculum['name'] === 'undefined' ? '' : curriculum['name'],
          list            = typeof curriculum['list'] === 'undefined' ? false : (curriculum['list'] === 'true'),
          limit           = typeof curriculum['limit'] === 'undefined' ? '' : curriculum['limit'];
    let   statement       = "\
            SELECT DISTINCT document_id FROM\
                (\
                    curriculum JOIN\
                    ( \
                        author_list JOIN student \
                        ON std_1 = student_id OR \
                            std_2 = student_id OR \
                            std_3 = student_id\
                    ) \
                    ON curriculum.curriculum_id = student.curriculum_id\
                ) \
            WHERE curriculum.name = ?";
    if (list){
        let [code, json] = await requirePermission(token)
        if (code !== 0) return [code, json]
        statement = "SELECT DISTINCT * FROM curriculum"
        if (limit && validator.isInt(limit)) statement += ` LIMIT ${limit}`
        return query(statement)
    } else {
        if (curriculum_name === '') return [0, 0];
        if (limit !== '' && validator.isInt(limit)) statement += ` LIMIT ${limit}`
        return query(statement, [curriculum_name]);
    }
}

const documentsSearch = async (documents, token) => {
    const documents_id = typeof documents['ids'] === 'undefined' ? [] : documents['ids'].split(','),
          list         = typeof documents['list'] === 'undefined' ? false : (documents['list'] === 'true'),
          limit        = typeof documents['limit'] === 'undefined' ? '' : documents['limit']
    let   whereX       = "WHERE",
          whereY       = "WHERE";
    if ((documents_id.length === 0 || !documents_id.every(val => validator.isInt(val))) && !list) return [0, 0];
    for (let id of documents_id) { 
        whereX += ' document.document_id = ? OR' 
        whereY += ' keyword_list.document_id = ? OR' 
    }
    if (list) {
        whereX = ""
        whereY = ""
    } else {
        whereX = whereX.slice(0, -3)
        whereY = whereY.slice(0, -3)
    }
    let statement    = `\
            SELECT * FROM (\
                SELECT DISTINCT\
                    CONCAT(COALESCE(author_list.std_1, ''), ',', COALESCE(author_list.std_2, ''), ',', COALESCE(author_list.std_3, '')) AS authors_id,\
                    document.document_id AS document_id,\
                    document.name,\
                    document.abstract,\
                    document.file_path,\
                    document.upload_dt,\
                    document.adviser_id,\
                    CONCAT(COALESCE(coadviser.avs_1, ''), ',', COALESCE(coadviser.avs_2, '')) AS coadvisers_id,\
                    CONCAT(COALESCE(commitee.name_1, ''), ',', COALESCE(commitee.name_2, ''), ',', COALESCE(commitee.name_3, '')) AS commitees,\
                    document.course_id,\
                    document.status\
                FROM\
                    document\
                JOIN(\
                    author_list\
                    JOIN student ON author_list.std_1 = student.student_id OR author_list.std_2 = student.student_id OR author_list.std_3 = student.student_id\
                    )\
                ON\
                    document.document_id = author_list.document_id\
                JOIN coadviser ON coadviser.document_id = document.document_id\
                JOIN commitee ON commitee.document_id = document.document_id\
                ${whereX}\
            ) AS X \
            JOIN (\
                SELECT DISTINCT keyword_list.document_id AS keyword_list_id, GROUP_CONCAT(CONCAT(keyword)) AS keywords FROM \
                    keyword_list JOIN keyword ON \
                    keyword_list.kid_1 = keyword.keyword_id OR\
                    keyword_list.kid_2 = keyword.keyword_id OR\
                    keyword_list.kid_3 = keyword.keyword_id OR\
                    keyword_list.kid_4 = keyword.keyword_id OR\
                    keyword_list.kid_5 = keyword.keyword_id OR\
                    keyword_list.kid_6 = keyword.keyword_id OR\
                    keyword_list.kid_7 = keyword.keyword_id OR\
                    keyword_list.kid_8 = keyword.keyword_id OR\
                    keyword_list.kid_9 = keyword.keyword_id OR\
                    keyword_list.kid_10 = keyword.keyword_id\
                ${whereY}\
                GROUP BY keyword_list.document_id\
            ) AS Y\
            ON X.document_id = Y.keyword_list_id
    `
    if (list) {
        if (limit && validator.isInt(limit)) statement += ` LIMIT ${limit}`
        return query(statement);
    }
    return query(statement, documents_id.concat(documents_id));
}

const advisersSearch = async (advisers, token) => {
    const advisers_id   = typeof advisers['ids'] === 'undefined' ? [] : advisers['ids'].split(','),
          list          = typeof advisers['list'] === 'undefined' ? false : (advisers['list'] === 'true'),
          limit         = typeof advisers['limit'] === 'undefined' ? '' : advisers['limit'];
    let   whereX        = "WHERE",
          whereY        = "WHERE",
          needAdviserId = "adviser_id,";
    if ((advisers_id.length === 0 || !advisers_id.every(val => validator.isInt(val))) && !list) return [0, 0];
    for (let id of advisers_id) {
        whereX += " avs1.adviser_id = ? OR"
        whereY += " avs2.adviser_id = ? OR"
    }
    if (list) {
        let [code, json] = await requirePermission(token)
        if (code !== 0) return [code, json]
        whereX = ""
        whereY = ""
    } else {
        whereX        = whereX.slice(0, -3)
        whereY        = whereY.slice(0, -3)
        needAdviserId = ""
    }
    let statement = `\
        SELECT\
            ${needAdviserId}\
            lecturer_id,\
            first_name,\
            last_name,\
            POSITION,\
            NULL AS department,\
            NULL AS faculty,\
            NULL AS university\
        FROM\
            adviser AS avs1\
            JOIN internal_lecturer ON avs1.i_lecturer_id = internal_lecturer.lecturer_id\
        ${whereX}\
        UNION\
        SELECT\
            ${needAdviserId}\
            lecturer_id,\
            first_name,\
            last_name,\
            POSITION,\
            department,\
            faculty,\
            university\
        FROM\
            adviser AS avs2\
            JOIN external_lecturer ON avs2.e_lecturer_id = external_lecturer.lecturer_id\
        ${whereY}\
    `
    if (list) {
        if (limit && validator.isInt(limit)) statement += ` LIMIT ${limit}`
        return query(statement);
    }
    return query(statement, advisers_id.concat(advisers_id));
}

const authorsSearch = async (authors) => {
    const author_id = typeof authors['documentID'] === 'undefined' ? [] : authors['documentID'],
          statement = "\
            SELECT\
                student_id,\
                first_name,\
                last_name,\
                name AS curriculum_name,\
                degree\
            FROM\
                author_list\
            JOIN(\
                student JOIN curriculum \
                ON student.curriculum_id = curriculum.curriculum_id\
                )\
            ON\
                std_1 = student_id OR std_2 = student_id OR std_3 = student_id\
            WHERE document_id = ?\
           ";
    if (!validator.isInt(author_id)) return 0;
    return query(statement, author_id);
}

const studentsSearch = async (students, token) => {
    const student_id = typeof students['ids'] === 'undefined' ? [] : students['ids'].split(','),
          list       = typeof students['list'] === 'undefined' ? false : (students['list'] === 'true'),
          limit      = typeof students['limit'] === 'undefined' ? '' : students['limit'];
    let   statement  = "\
            SELECT\
                student.student_id,\
                student.first_name,\
                student.last_name,\
                curriculum.name,\
                curriculum.degree\
            FROM\
                student JOIN curriculum\
                ON student.curriculum_id = curriculum.curriculum_id\
        ";
    if (list) {
        let [code, json] = await requirePermission(token)
        if (code !== 0) return [code, json]
        if (limit && validator.isInt(limit)) statement += ` LIMIT ${limit}`
        return query(statement)
    } else {
        statement += ' WHERE'
        if (student_id.length === 0 || !student_id.every(val => validator.isInt(val))) return [0, 0];
        for (let id in student_id) { statement += " student.student_id = ? OR" }
        statement = statement.slice(0, -3)
        return query(statement, student_id);
    }
}

const coursesSearch = async (course, token) => {
    const course_id = typeof course['ids'] === 'undefined' ? [] : course['ids'].split(','),
          list      = typeof course['list'] === 'undefined' ? false : (course['list'] === 'true'),
          limit     = typeof course['limit'] === 'undefined' ? '' : course['limit'];
    let   statement = "SELECT DISTINCT * FROM course WHERE";
    if (list) {
        let [code, json] = await requirePermission(token)
        if (code !== 0) return [code, json]
        statement = statement.slice(0, -5)
        if (limit && validator.isInt(limit)) statement += ` LIMIT ${limit}`
        return query(statement)
    } else {
        if (course_id.length === 0) return [0, 0];
        for (let id of course_id) { statement += " course_id = ? OR" }
        statement = statement.slice(0, -3)
        return query(statement, course_id);
    }
}

async function query(statement, values) {
    const connection = SqlConnect.makeConnection();
    let result;
    try {
        if (typeof values === "undefined")
            result = await connection.query(statement)
        else
            result = await connection.query(statement, values)
    } catch (err) {
        if (!err.fatal) SqlConnect.closeConnection(connection);
        console.error({ code: err.code, msg: err.sqlMessage, sql: err.sql });
        return [1, 1];
    } finally {
        SqlConnect.closeConnection(connection);
    }
    return [200,
        {
            success: true,
            message: "OK",
            data   : result
        }
    ];
}

async function requirePermission(token) {
    let privilege = await verify(token, false);
    if (!privilege.pass)
        privilege = await studentVerify(token, false);
        if (!privilege.pass)
            return [privilege.status_code, privilege.return_json];
    else 
        return [0, 0];
}

module.exports = {
    searchAdapter
};
