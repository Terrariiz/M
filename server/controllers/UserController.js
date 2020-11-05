/*eslint no-console: ["error", { allow: ["warn", "error", "info", "log"] }] */
/* eslint no-unused-vars: 0 */
const SqlConnect    = require("../controllers/SqlConnect");
const fs            = require("fs");
const path          = require("path");
const bcrypt        = require("bcrypt");
const jwt           = require("jsonwebtoken");
const validator     = require("validator");
const Authenication = require("../controllers/StudentAuthenication");
const verify        = Authenication.verify;
const private_key   = fs.readFileSync(
  path.resolve(__dirname, "../config/private_student.key")
);

const signin = async (req, res) => {
  let result;
  const email      = req.body.email || "",
        password   = req.body.password || "",
        statement  = "SELECT ?? FROM ?? WHERE email = ? LIMIT 1",
        fields     = ["student_id", "password"],
        tables     = ["student"],
        connection = SqlConnect.makeConnection();

  if (!email || !password) {
    console.error(
      "[Bodyparser error] : Can't find neccessary tags in req.body"
    );
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      data   : {}
    });
  }
  try {
    await connection.connect();
    result = await connection.query(statement, [fields, tables, email]);
    SqlConnect.closeConnection(connection);
  } catch (err) {
    if (!err.fatal) SqlConnect.closeConnection(connection);
    console.error({code: err.code, msg: err.sqlMessage, sql: err.sql});
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data   : {}
    });
  }

  if (result[0]) {
    if (bcrypt.compareSync(password, result[0].password)) {
      const payload = {
        email: email,
        student_id: result[0].student_id
      };
      const token = jwt.sign(payload, private_key, {
        expiresIn: "24h"
      });
      return res.status(200).json({
        success: true,
        message: "OK",
        data   : {
          token: token
        }
      });
    }
  }
  return res.status(200).json({
    success: false,
    message: "The email or password is incorrect",
    data   : {}
  });
  //res.json(CircularJSON.stringify(result));
};

const cStudent = async (req, res) => {
  const SALT_ROUNDS = 12,
        email       = req.body.email,
        password    = req.body.password,
        fname       = req.body.fname,
        lname       = req.body.lname,
        studentId   = req.body.studentId,
        curriculumId= req.body.curriculumId,
        salt        = bcrypt.genSaltSync(SALT_ROUNDS),
        statement   = "INSERT INTO ??(??) VALUES (?)",
        fields      = [
                        "email",
                        "password",
                        "student_id",
                        "curriculum_id",
                        "first_name",
                        "last_name"
                    ],
    tables     = "student",
    connection = SqlConnect.makeConnection();
  let result;

  if (!email || !password || !studentId || !fname || !lname || !curriculumId) {
    console.error(
      "[Bodyparser error] : Can't find neccessary tags in req.body"
    );
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      data   : {}
    });
  }
  try {
    const hash   = bcrypt.hashSync(password, salt);
    const values = [email, hash, studentId, curriculumId, fname, lname];
    await connection.connect();
    result = await connection.query(statement, [tables, fields, values]);
    SqlConnect.closeConnection(connection);
  } catch (err) {
    if (!err.fatal) SqlConnect.closeConnection(connection);
    console.error({code: err.code, msg: err.sqlMessage, sql: err.sql});
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data   : {}
    });
  }

  return res.status(201).json({
    success: true,
    message: "Created",
    data   : {
      inserted: true
    }
  });
};

const verifyToken = async (req, res) => {
  const payload_decoded = await verify(req.token, false);
  return res.status(payload_decoded.status_code).json(payload_decoded.return_json);
};

const rStudent = async (req, res) => {
  const student_data = await verify(req.token, true);
  return res.status(student_data.status_code).json(student_data.return_json);
};

const uStudent = async (req, res) => {
  const privilege    = await verify(req.token, false),
        old_password =
          req.body.old_password !== undefined ? req.body.old_password : "",
        new_password =
          req.body.new_password !== undefined ? req.body.new_password : "",
        email        = req.body.email !== undefined ? req.body.email : "",
        first_name   = req.body.fname !== undefined ? req.body.fname : "",
        last_name    = req.body.lname !== undefined ? req.body.lname : "",
        curriculum_id= req.body.position !== undefined ? req.body.curriculum_id : "",
        values       = {},
        connection   = SqlConnect.makeConnection();
    let statement    = "UPDATE student SET ? WHERE student_id = ?",
        student_id,
        result;
    const decode = jwt.verify(req.token, private_key, (err, decoded) => {
        if (err) return false;
        else return decoded;
    });
  if (!validator.isInt(student_id, { min: 1 }) || !old_password) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      data   : {}
    });
  }
  if (privilege.pass) {
    student_id = decode.student_id;
    if (validator.isEmail(email)) values.email = email;
    if (first_name) values.first_name = first_name;
    if (last_name) values.last_name = last_name;
    if (position) values.position = position;
    if (new_password) {
      const salt_rounds     = 12,
            salt            = bcrypt.genSaltSync(salt_rounds),
            hash            = bcrypt.hashSync(new_password, salt);
      values.password       = hash;
    }

    try {
      await connection.connect();
      result = await connection.query(
        "SELECT password FROM student WHERE student_id = ? LIMIT 1",
        [student_id]
      );
      if (result.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Bad Request",
          data   : {}
        });
      } else {
        if (!bcrypt.compareSync(old_password, result[0].password)) {
          return res.status(400).json({
            success: false,
            message: "Bad Request",
            data   : {}
          });
        }
      }
      if (Object.keys(values).length > 0) {
        result = await connection.query(statement, [values, student_id]);
      } else {
        result = { message: "(Rows matched: 1  Changed: 0  Warnings: 0" };
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

const dStudent = async (req, res) => {
  const privilege  = await verify(req.token, false),
        connection = SqlConnect.makeConnection(),
        statement  = "DELETE FROM student WHERE student_id = ?",
        student_id   = req.params.student_id;
  let result;
  if(!student_id){
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      data   : {}
    });
  }
  if (privilege.pass){
    try {
      await connection.connect();
      result = await connection.query(statement, [student_id]);
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
    data: { affectedStudent: result.affectedRows}
  });
};

module.exports = {
  signin,
  cStudent,
  rStudent,
  uStudent,
  dStudent,
  verifyToken
};
