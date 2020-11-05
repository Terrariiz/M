/* eslint no-unused-vars: 0 */
const SqlConnect         = require('../controllers/SqlConnect'),
      fs                 = require('fs'),
      Authenication      = require("../controllers/StudentAuthenication"),
      StaffAuthenication = require("../controllers/StaffAuthenication"),
      verify             = Authenication.verify,
      path               = require('path'),
      validator          = require('validator');

const cDocument = async (req, res) => {
  const name       = req.body.name !== undefined ? req.body.name : "",
        abstract   = req.body.abstract !== undefined ? req.body.abstract : "",
        students   = req.body.students !== undefined ? req.body.students.split(',') : "",
        commitees  = req.body.commitees !== undefined ? req.body.commitees.split(',') : "",
        keywords   = req.body.keywords !== undefined ? req.body.keywords.split(',') : "",
        course_id  = req.body.courseId !== undefined ? req.body.courseId : "",
        adviser_id = req.body.adviserId !== undefined ? req.body.adviserId : "",
        coadvisers = req.body.coadvisers !== undefined ? req.body.coadvisers.split(',') : "",
        connection  = SqlConnect.makeConnection(),
        privilege   = await verify(req.token, false);
  let result, statement, fileName, newPath, filePath;
  if (!name || !abstract || !commitees || !keywords || !course_id || !adviser_id) {
    console.info(req.files)
    console.error(
      `[Bodyparser error] : Can't find neccessary tags in req.body`
    );
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      data   : {}
    });
  }

  if (privilege.pass) {
    // store the file
    if (req.files !== undefined && req.files !== null) {
      if (req.files.thesis !== undefined) {
        // if a file has been uploaded
        if (req.files.thesis.truncated === false) {
          // if a file is not larger than 10MB
          if (req.files.thesis.size > 1) {
            // if a file is not less than 0MB
            let fileData = req.files.thesis;
            const extension = fileData.name.substring(
              fileData.name.lastIndexOf('.'),
              fileData.name.length
            );
            // renaming uploaded file to dt right now.
            fileName = `${Date.now()}${extension}`;
            // set a path to storing the file.
            newPath = path.join(__dirname, '../') +
                      "/assets/files/" + fileName;
            // move the temp file to the path where file are stored.
            fileData.mv(newPath, (err) => {
              if (err) {
                fs.unlink(req.files.thesis.tempFilePath, err => {if (err) console.error(`${err.message}`)});
                return res.status(400).json({
                  success: false,
                  message: err.message,
                  data: {}
                });
              }
            })
            filePath = `/docs/${fileName}`;
          } else {
            // if the size of file less than 0.
            fs.unlink(req.files.thesis.tempFilePath, err => {console.error(err.message)});
          }
        }
      }
    }
    // need to check the existance of course_id.
    statement = 'SELECT course_id FROM course WHERE course_id LIKE ? LIMIT 1';
    try {
      await connection.connect();
      result = await connection.query(statement, [[ course_id ]]);
    } catch (error) {
      if (!error.fatal) SqlConnect.closeConnection(connection);
      console.error({ code: error.code, msg: error.sqlMessage, sql: error.sql });
      fs.unlink(req.files.thesis.tempFilePath, err => {if (err) console.error(`${err.message}`)});
      fs.unlink(newPath, err => {if (err) console.error(`${err.message}`)});
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data   : {}
      });
    }
    // if couse_id doesn't existed.
    if (!result.length) {
      fs.unlink(req.files.thesis.tempFilePath, err => {if (err) console.error(`${err.message}`)});
      fs.unlink(newPath, err => {if (err) console.error(`${err.message}`)});
      return res.status(400).json({
        success: false,
        message: "Wrong course_id.",
        data   : {}
      });
    }
    // need to check file existance for prevent multiple submit.
    statement = 'SELECT * FROM submit WHERE course_id LIKE ? AND student_id LIKE ? LIMIT 1';
    result = undefined;
    try {
      result = await connection.query(statement, [
        course_id,
        privilege.return_json.data.student_id
      ]);
    } catch (error) {
      if (!error.fatal) SqlConnect.closeConnection(connection);
      console.error({ code: error.code, msg: error.sqlMessage, sql: error.sql });
      fs.unlink(req.files.thesis.tempFilePath, err => {if (err) console.error(`${err.message}`)});
      fs.unlink(newPath, err => {if (err) console.error(`${err.message}`)});
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data   : {}
      });
    }
    if (result.length) {
      fs.unlink(req.files.thesis.tempFilePath, err => {if (err) console.error(`${err.message}`)});
      fs.unlink(newPath, err => {if (err) console.error(`${err.message}`)});
      return res.status(200).json({
        success: false,
        message: "You already submited.",
        data   : {}
      });
    }
    // need to check existance of all advisers.
    result = undefined;
    statement = 'SELECT COUNT(adviser_id) AS count FROM adviser WHERE'
    const avs_lst = coadvisers === "" ? [adviser_id] : [adviser_id].concat(coadvisers);
    for (const avs_id of avs_lst) {
      if (statement[statement.length - 1] === 'E') statement += " adviser_id = ?";
      else statement += " OR adviser_id = ?";
    }
    try {
      result = await connection.query(statement, avs_lst);
    } catch (error) {
      if (!error.fatal) SqlConnect.closeConnection(connection);
      console.error({ code: error.code, msg: error.sqlMessage, sql: error.sql });
      fs.unlink(req.files.thesis.tempFilePath, err => {if (err) console.error(`${err.message}`)});
      fs.unlink(newPath, err => {if (err) console.error(`${err.message}`)});
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data   : {}
      });
    }
    if (result[0].count !== avs_lst.length) {
      fs.unlink(req.files.thesis.tempFilePath, err => {if (err) console.error(`${err.message}`)});
      fs.unlink(newPath, err => {if (err) console.error(`${err.message}`)});
      return res.status(400).json({
        success: false,
        message: "Have some invalid adviser_id.",
        data   : {}
      });
    }

    // need to check existance of all keywords.
    result = undefined;
    statement = 'SELECT COUNT(keyword_id) AS count FROM keyword WHERE'
    for (const id of keywords) {
      if (statement[statement.length - 1] === 'E') statement += " keyword_id = ?";
      else statement += " OR keyword_id = ?";
    }
    try {
      result = await connection.query(statement, keywords);
    } catch (error) {
      if (!error.fatal) SqlConnect.closeConnection(connection);
      console.error({ code: error.code, msg: error.sqlMessage, sql: error.sql });
      fs.unlink(req.files.thesis.tempFilePath, err => {if (err) console.error(`${err.message}`)});
      fs.unlink(newPath, err => {if (err) console.error(`${err.message}`)});
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data   : {}
      });
    }
    if (result[0].count !== keywords.length) {
      fs.unlink(req.files.thesis.tempFilePath, err => {if (err) console.error(`${err.message}`)});
      fs.unlink(newPath, err => {if (err) console.error(`${err.message}`)});
      return res.status(400).json({
        success: false,
        message: "Have some invalid keyword_id.",
        data   : {}
      });
    }
    // OPEN TRANSACTION
    try {
      connection.beginTransaction();
      // add new row to document table and get a document_id
      statement = 'INSERT INTO document(name, abstract, file_path, upload_dt, adviser_id, course_id, status) VALUES (?)';
      result = await connection.query(statement, [[
        name, 
        abstract, 
        filePath, 
        new Date().toISOString().slice(0, 19).replace('T', ' '), 
        adviser_id,
        course_id,
        0
      ]]);
      // add new row to commitee table
      if (commitees !== "") {
        statement = 'INSERT INTO commitee(document_id';
        for (let i = 0; i < commitees.length; i++) {
          statement += `, name_${i+1}`;
        }
        statement += ") VALUES(?)";
        await connection.query(statement, [[result.insertId].concat(commitees)]);
      }
      // add new row to coadviser table
      if (coadvisers !== "") {
        statement = 'INSERT INTO coadviser(document_id';
        for (let i = 0; i < coadvisers.length; i++) {
          statement += `, avs_${i+1}`;
        }
        statement += ") VALUES(?)";
        await connection.query(statement, [[result.insertId].concat(coadvisers)]);
      }
      // add new row to keyword_list table
      statement = 'INSERT INTO keyword_list(document_id';
      for (let i = 0; i < keywords.length; i++) {
        statement += `, kid_${i+1}`;
      }
      statement += ") VALUES(?)";
      await connection.query(statement, [[result.insertId].concat(keywords)]);
      // add new row to author_list
      const auts = students === "" ? [privilege.return_json.data.student_id] : 
                                     [privilege.return_json.data.student_id].concat(students);
      statement = 'INSERT INTO author_list(document_id';
      for (let i = 0; i < auts.length; i++) {
        statement += `, std_${i+1}`;
      }
      statement += ") VALUES(?)";
      await connection.query(statement, [[result.insertId].concat(auts)]);
      statement = "INSERT INTO submit VALUES(?)";
      for (const aut of auts) {
        await connection.query(statement, [[aut, course_id]]);
      }
      await connection.commit();
      SqlConnect.closeConnection(connection);
    } catch (err) {
      if (err) {
        await connection.rollback();
        if (!err.fatal) SqlConnect.closeConnection(connection);
        console.error({ code: err.code, msg: err.sqlMessage, sql: err.sql });
        fs.unlink(req.files.thesis.tempFilePath, err => {if (err) console.error(`${err.message}`)});
        fs.unlink(newPath, err => {if (err) console.error(`${err.message}`)});
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
          data   : {}
        });
      }
    }
    // END TRANSACTION
    return res.status(201).json({
      success: true,
      message: "Created",
      data   : {
        document_id: result.insertId
      }
    });
  } else {
    return res.status(privilege.status_code).json(privilege.return_json);
  }
};

const uDocument = async (req, res) => {
  const document_id = req.params.id,
        name        = typeof req.body.name !== 'undefined' ? req.body.name : "",
        abstract    = typeof req.body.abstract !== 'undefined' ? req.body.abstract : "",
        students    = typeof req.body.students !== 'undefined' ? req.body.students.split(',') : "",
        commitees   = typeof req.body.commitees !== 'undefined' ? req.body.commitees.split(',') : "",
        keywords    = typeof req.body.keywords !== 'undefined' ? req.body.keywords.split(',') : "",
        course_id   = typeof req.body.courseId !== 'undefined' ? req.body.courseId : "",
        adviser_id  = typeof req.body.adviserId !== 'undefined' ? req.body.adviserId : "",
        coadvisers  = typeof req.body.coadvisers !== 'undefined' ? req.body.coadvisers.split(',') : "",
        connection  = SqlConnect.makeConnection(),
        privilege   = await StaffAuthenication.verify(req.token, false);
  let statement, sql, tmp, fileData, filePath, newPath;
  if (!validator.isInt(document_id, { min: 1 })){
      SqlConnect.closeConnection(connection)
      return res.status(400).json({
        success: false,
        message: "Invalid document id",
        data: {}
      })
  }
  if (privilege.pass) {
    try {
      connection.beginTransaction()

      if (name || abstract || adviser_id || course_id) {
        const values = []
        statement = `UPDATE document SET`
        if (name) { statement += ' name = ?,'; values.push(name) }
        if (abstract) { statement += ' abstract = ?,'; values.push(abstract) }
        if (adviser_id) { statement += ' adviser_id = ?,'; values.push(adviser_id) }
        if (course_id) { statement += ' course_id = ?,'; values.push(course_id) }
        statement = statement.slice(0, -1) + ' WHERE document_id = ?'
        values.push(document_id)
        await connection.query(statement, values)
      }

      if (students) {
        // Need course for change submit table
        if (!course_id) throw "ValueError"
        const student_ids = [], new_submit = [], new_authors = [];
        if (students.length > 3 && !students.every(val => validator.isInt(val))) throw "ValueError"
        statement = "\
          SELECT DISTINCT student_id \
          FROM submit JOIN author_list \
          ON submit.student_id = author_list.std_1 OR\
            submit.student_id = author_list.std_2 OR\
            submit.student_id = author_list.std_3\
          WHERE document_id = ?"
        sql = connection.format(statement, [document_id])
        tmp = await connection.query(sql)
        statement = `UPDATE author_list SET`
        for (let i = 1; i <= 3; i++) { 
          if (i > students.length) new_authors.push(null)
          else new_authors.push(students[i-1])
          statement += ` std_${i} = ?,` 
        }
        statement = statement.slice(0, -1) + ' WHERE document_id = ?'
        sql = connection.format(statement, new_authors.concat(document_id))
        await connection.query(sql)
        // Delete own submit
        statement = "DELETE FROM submit WHERE"
        for (const student of tmp) { 
          student_ids.push(student.student_id)
          statement += " student_id = ? OR"
        }
        statement = statement.slice(0, -3)
        sql = connection.format(statement, student_ids)
        await connection.query(sql)
        // Insert new submit
        statement = "INSERT INTO submit(student_id, course_id) VALUES"
        for (const id of students) {
          new_submit.push(id, course_id)
          statement += " (?, ?),"
        }
        statement = statement.slice(0, -1)
        sql = connection.format(statement, new_submit) 
        await connection.query(sql)
      }

      if (commitees) {
        if (commitees.length > 3 && !commitees.every(val => validator.isInt(val))) throw "ValueError"
        statement = 'UPDATE commitee SET'
        for (let i = 1; i <= 3; i++) { 
          if (i > commitees.length) commitees.push(null)
          statement += ` name_${i} = ?,` 
        }
        statement = statement.slice(0, -1) + ' WHERE document_id = ?'
        sql = connection.format(statement, commitees.concat(document_id))
        await connection.query(sql)
      }

      if (keywords) {
        if (keywords.length > 10 && !keywords.every(val => validator.isInt(val))) throw "ValueError"
        statement = 'UPDATE keyword_list SET'
        for (let i = 1; i <= 10; i++) { 
          if (i > keywords.length) keywords.push(null)
          statement += ` kid_${i} = ?,` 
        }
        statement = statement.slice(0, -1) + ' WHERE document_id = ?'
        sql = connection.format(statement, keywords.concat(document_id))
        await connection.query(sql)
      }

      if (coadvisers) {
        if (coadvisers.length > 2 && !coadvisers.every(val => validator.isInt(val))) throw 'ValueError'
        statement = 'UPDATE coadviser SET'
        for (let i = 1; i <= 2; i++) { 
          if (i > coadvisers.length) coadvisers.push(null)
          statement += ` avs_${i} = ?,` 
        }
        statement = statement.slice(0, -1) + ' WHERE document_id = ?'
        sql = connection.format(statement, coadvisers.concat(document_id))
        await connection.query(sql)
      }

      if (req.files !== undefined && req.files !== null) {
        if (typeof req.files.thesis === 'undefined') throw 'ValueError'
        if (!req.files.thesis.truncated && req.files.thesis.size > 1) {
          statement = "SELECT DISTINCT file_path FROM document WHERE document_id = ? LIMIT 1"
          sql = connection.format(statement, [document_id])
          tmp = (await connection.query(sql))[0].file_path.split('/')[2]
          // if a file is not less than 0MB
          fileData = req.files.thesis
          const extension = fileData.name.substring(
            fileData.name.lastIndexOf('.'),
            fileData.name.length
          ),
          fileName = `${Date.now()}${extension}`// renaming uploaded file to dt right now.;
          // set a path to storing the file.
          newPath = path.join(__dirname, '../') +
                    `/assets/files/${fileName}`;
          // move the temp file to the path where file are stored.
          fileData.mv(newPath, (err) => {
            if (err) {
              fs.unlinkSync(req.files.thesis.tempFilePath)
            }
          })
          filePath = `/docs/${fileName}`;
          statement = "UPDATE document SET file_path = ?, upload_dt = ? WHERE document_id = ?"
          sql = connection.format(statement, [filePath, new Date().toISOString().slice(0, 19).replace('T', ' '), document_id])
          await connection.query(sql)
          fs.unlinkSync(path.join(__dirname, '../') + `/assets/files/${tmp}`) // Delete old document
        } else fs.unlinkSync(req.files.thesis.tempFilePath)
      }

      await connection.commit()
      SqlConnect.closeConnection(connection)
      return res.status(200).json({
        success: true,
        message: "Updated",
        data: {}
      })
    } catch (error) {
      await connection.rollback()
      if (!error.fatal) SqlConnect.closeConnection(connection);
      if (typeof newPath !== 'undefined') fs.unlinkSync(newPath)
      if (error === "ValueError") {
        return res.status(400).json({
          success: false,
          message: "Invalid update value",
          data: {}
        })
      } else {
        if (typeof error.sql === 'undefined')
          console.error({ msg: error.message });
        else {
          if (error.code.includes("ER_NO_REFERENCED")) {
            console.error({ sql: error.sql })
            return res.status(400).json({
              success: false,
              message: "Foreign key constraint fails",
              data: {}
            })
          }
          console.error({ code: error.code, msg: error.sqlMessage, sql: error.sql });
          //fs.unlink(req.files.thesis.tempFilePath, err => {if (err) console.error(`${err.message}`)});
          //fs.unlink(newPath, err => {if (err) console.error(`${err.message}`)});
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data   : {}
          });
        }
      }
    }
  } else {
    SqlConnect.closeConnection(connection)
    return res.status(privilege.status_code).json(privilege.return_json)
  }
}

const dDocument = async (req, res) => {
  const document_id = req.params.id,
        privilege   = await StaffAuthenication.verify(req.token, false),
        connection  = SqlConnect.makeConnection(),
        students    = [];
  let statement, fileName, tmp, sql;
  if (!validator.isInt(document_id, { min: 1 })){
    SqlConnect.closeConnection(connection)
    return res.status(400).json({
      success: false,
      message: "Invalid document id",
      data: {}
    })
  }
  if (privilege.pass) {
    try {
      // Check document existence
      statement = "SELECT DISTINCT document_id FROM document WHERE document_id = ?"
      const exist = await connection.query(statement, [document_id])
      if (exist.length === 0)
        return res.status(200).json({
          success: false,
          message: `Can't find document_id = ${document_id}`,
          data: {}
        })
      else
        statement = undefined
    } catch (error) {
      if (!error.fatal) SqlConnect.closeConnection(connection);
      console.error({ code: error.code, msg: error.sqlMessage, sql: error.sql });
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data: {}
      })
    }
    try {
      connection.beginTransaction();
      // Need student_id in order to delete a row in submit table
      statement = "\
        SELECT DISTINCT student_id \
        FROM submit JOIN author_list \
        ON submit.student_id = author_list.std_1 OR\
          submit.student_id = author_list.std_2 OR\
          submit.student_id = author_list.std_3\
        WHERE document_id = ?"
      sql = connection.format(statement, [document_id])
      tmp = await connection.query(sql)
      statement = "SELECT file_path FROM document WHERE document_id = ?"
      sql = connection.format(statement, [document_id])
      fileName = (await connection.query(sql))[0].file_path.split('/')[2]
      statement = "DELETE FROM commitee WHERE document_id = ?"
      sql = connection.format(statement, [document_id])
      await connection.query(sql)
      statement = "DELETE FROM author_list WHERE document_id = ?"
      sql = connection.format(statement, [document_id])
      await connection.query(sql)
      statement = "DELETE FROM keyword_list WHERE document_id = ?"
      sql = connection.format(statement, [document_id])
      await connection.query(sql)
      statement = "DELETE FROM coadviser WHERE document_id = ?"
      sql = connection.format(statement, [document_id])
      await connection.query(sql)
      statement = "DELETE FROM document WHERE document_id = ?"
      sql = connection.format(statement, [document_id])
      await connection.query(sql)
      statement = "DELETE FROM submit WHERE"
      for (let student of tmp) { 
        statement += " student_id = ? OR"
        students.push(student.student_id) 
      }
      statement = statement.slice(0, -3)
      sql = connection.format(statement, students)
      await connection.query(sql)
      fs.unlinkSync(path.join(__dirname, '../') + `/assets/files/${fileName}`)
      await connection.commit();
      SqlConnect.closeConnection(connection)
      return res.status(200).json({
        success: true,
        message: "Document was deleted",
        data: {}
      })
    } catch (error) {
      await connection.rollback();
      if (!error.fatal) SqlConnect.closeConnection(connection);
      if (typeof error.sql === 'undefined')
        console.error({ msg:error.message, err:error });
      else
        console.error({ code: error.code, msg: error.sqlMessage, sql: error.sql });
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data: {}
      })
    }
  } else {
    SqlConnect.closeConnection(connection)
    return res.status(privilege.status_code).json(privilege.return_json)
  }
}

module.exports = {
    cDocument,
    uDocument,
    dDocument
};