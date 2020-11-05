/*eslint no-console: ["error", { allow: ["warn", "error", "info", "log"] }] */
/* eslint no-unused-vars: 0 */
const SqlConnect    = require("../controllers/SqlConnect");
const validator     = require("validator");
const Authenication = require("../controllers/StaffAuthenication");
const verify        = Authenication.verify;

const cCourse = async (req, res) => {
  const name       = req.body.name !== undefined ? req.body.name : "",
        course_id  = req.body.courseId !== undefined ? req.body.courseId : "",
        year       = req.body.year !== undefined ? req.body.year : "",
        department = req.body.department !== undefined ? req.body.department : "",
        credit     = req.body.credit !== undefined ? req.body.credit : "",
        statement  =
            "INSERT INTO course VALUES (?)",
        connection  = SqlConnect.makeConnection(),
        privilege   = await verify(req.token, false);
  let result;

  if (!name || !year || !department || !credit || !course_id) {
    console.error(
      "[Bodyparser error] : Can't find neccessary tags in req.body"
    );
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      data   : {}
    });
  }

  if (privilege.pass) {
    try {
      await connection.connect();
      result = await connection.query(statement, [[
        course_id,
        name,
        year,
        department,
        credit
      ]]);
      SqlConnect.closeConnection(connection);
    } catch (err) {
      if (!err.fatal) SqlConnect.closeConnection(connection);
      console.error({ code: err.code, msg: err.sqlMessage, sql: err.sql });
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data   : {}
      });
    }
  } else {
    return res.status(privilege.status_code).json(privilege.return_json);
  }

  return res.status(201).json({
    success: true,
    message: "Created",
    data   : {
      course_id: result.insertId
    }
  });
};

const uCourse = async (req, res) => {
  const name       = req.body.name !== undefined ? req.body.name : "",
        year       = req.body.year !== undefined ? req.body.year : "",
        department = req.body.department !== undefined ? req.body.department : "",
        credit     = req.body.credit !== undefined ? req.body.credit : "",
        id         = req.body.id,
        statement  = "UPDATE course SET ? WHERE course_id = ?",
        connection = SqlConnect.makeConnection(),
        privilege  = await verify(req.token, false),
        values     = {};
  let result;

  if (privilege.pass) {
    if (name) values.name = name;
    if (year) values.year = year;
    if (department) values.department = department;
    if (credit) values.credit = credit;
    try {
      if (Object.keys(values).length > 0) {
        result = await connection.query(statement, [
          values,
          id
        ]);
      } else {
        result = { message: "(Rows matched: 1 Changed: 0 Warning: 0" };
      }
      SqlConnect.closeConnection(connection);
    } catch (err) {
      if (!err.fatal) SqlConnect.closeConnection(connection);
      console.error({ code: err.code, msg: err.sqlMessage, sql: err.sql });
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data   : {}
      });
    }
  } else {
    return res.status(privilege.status_code).json(privilege.return_json);
  }

  return res.status(200).json({
    success: true,
    message: "OK",
    data   : result.message
  });
};

const dCourse = async (req, res) => {
  const ids        = req.params.ids.split(","),
        privilege  = await verify(req.token, false),
        connection = SqlConnect.makeConnection(),
        valid_ids  = [];
  let result,
      statement = "DELETE FROM course WHERE";

  if (privilege.pass) {
    try {
      for (let id of ids) {
        if (valid_ids.length !== 0) statement += " OR";
        statement += " course_id = ?";
        valid_ids.push(id);
      }
      result = await connection.query(statement, valid_ids);
      SqlConnect.closeConnection(connection);
    } catch (err) {
      if (!err.fatal) SqlConnect.closeConnection(connection);
      console.error({ code: err.code, msg: err.sqlMessage, sql: err.sql });
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data   : {}
      });
    }
  } else {
    return res.status(privilege.status_code).json(privilege.return_json);
  }

  return res.status(200).json({
    success: true,
    message: "OK",
    data   : { affectedCourse : result.affectedRows }
  });
};

const cSubmit = async (req, res) => {
  const student_id       = req.params.sid !== undefined ? req.params.sid : "",
        course_id        = req.params.cid !== undefined ? req.params.cid : "",
        statement  =
            "INSERT INTO submit(student_id, course_id) VALUES (?)",
        connection  = SqlConnect.makeConnection(),
        privilege   = await verify(req.token, false);
  let result;

  if (!student_id || !course_id) {
    console.error(
      "[Bodyparser error] : Can't find neccessary tags in req.body"
    );
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      data   : {}
    });
  }

  if (privilege.pass) {
    try {
      result = await connection.query(statement, [[
        student_id,
        course_id
      ]]);
      SqlConnect.closeConnection(connection);
    } catch (err) {
      if (!err.fatal) SqlConnect.closeConnection(connection);
      console.error({ code: err.code, msg: err.sqlMessage, sql: err.sql });
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data   : {}
      });
    }
  } else {
    return res.status(privilege.status_code).json(privilege.return_json);
  }

  return res.status(201).json({
    success: true,
    message: "Created",
    data   : true
  });


};

const dSubmit = async (req, res) => {
  const sid        = req.params.sid,
        cid        = req.params.cid,
        privilege  = await verify(req.token, false),
        connection = SqlConnect.makeConnection();
  let result,
      statement = "DELETE FROM course WHERE student_id = ? AND course_id = ?";

  if (privilege.pass) {
    try {
      result = await connection.query(statement, [sid, cid]);
      SqlConnect.closeConnection(connection);
    } catch (err) {
      if (!err.fatal) SqlConnect.closeConnection(connection);
      console.error({ code: err.code, msg: err.sqlMessage, sql: err.sql });
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data   : {}
      });
    }
  } else {
    return res.status(privilege.status_code).json(privilege.return_json);
  }

  return res.status(200).json({
    success: true,
    message: "OK",
    data   : { affectedSubmit : result.affectedRows }
  });
};

const checkSubmit = async (req, res) => {
  const sid        = req.params.sid,
        cid        = req.params.cid,
        connection = SqlConnect.makeConnection();
  let result,
      statement = "SELECT * FROM course WHERE student_id = ? AND course_id =?";

  try {
    result = await connection.query(statement, [sid, cid]);
    SqlConnect.closeConnection(connection);
  } catch (err) {
    if (!err.fatal) SqlConnect.closeConnection(connection);
    console.error({ code: err.code, msg: err.sqlMessage, sql: err.sql });
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data   : {}
    });
  }

  result = result.length === 1 ? true : false;

  return res.status(200).json({
    success: true,
    message: "OK",
    data   : {
        submited : result
    }
  });
};

module.exports = {
    cCourse,
    uCourse,
    dCourse,
    cSubmit,
    dSubmit,
    checkSubmit
};