/*eslint no-console: ["error", { allow: ["warn", "error", "info", "log"] }] */
/* eslint no-unused-vars: 0 */
const SqlConnect    = require("../controllers/SqlConnect");
const fs            = require("fs");
const path          = require("path");
const bcrypt        = require("bcrypt");
const jwt           = require("jsonwebtoken");
const validator     = require("validator");
const Authenication = require("../controllers/StaffAuthenication");
const verify        = Authenication.verify;
const private_key   = fs.readFileSync(
  path.resolve(__dirname, "../config/private.key")
);

const signin = async (req, res) => {
  let result;
  const username   = req.body.username || "",
        password   = req.body.password || "",
        statement  = "SELECT ?? FROM ?? WHERE username = ? LIMIT 1",
        fields     = ["staff_id", "password"],
        tables     = ["staff"],
        connection = SqlConnect.makeConnection();

  if (!username || !password) {
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
    result = await connection.query(statement, [fields, tables, username]);
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
        username: username,
        staff_id: result[0].staff_id
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
    message: "The username or password is incorrect",
    data   : {}
  });
  //res.json(CircularJSON.stringify(result));
};

const cStaff = async (req, res) => {
  const SALT_ROUNDS = 12,
        username    = req.body.username,
        password    = req.body.password,
        fname       = req.body.fname,
        lname       = req.body.lname,
        email       = req.body.email,
        position    = req.body.position,
        salt        = bcrypt.genSaltSync(SALT_ROUNDS),
        statement   = "INSERT INTO ??(??) VALUES (?)",
        fields      = [
                        "username",
                        "password",
                        "email",
                        "first_name",
                        "last_name",
                        "position"
                    ],
    tables     = "staff",
    connection = SqlConnect.makeConnection();
  let result;

  if (!username || !password || !email || !fname || !lname || !position) {
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
    const values = [username, hash, email, fname, lname, position];
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
      staff_id: result.insertId
    }
  });
};

const verifyToken = async (req, res) => {
  const payload_decoded = await verify(req.token, false);
  return res.status(payload_decoded.status_code).json(payload_decoded.return_json);
};

const rStaff = async (req, res) => {
  const staff_data = await verify(req.token, true);
  return res.status(staff_data.status_code).json(staff_data.return_json);
};

const uStaff = async (req, res) => {
  const privilege    = await verify(req.token, false),
        old_password =
          req.body.old_password !== undefined ? req.body.old_password : "",
        new_password =
          req.body.new_password !== undefined ? req.body.new_password : "",
        email        = req.body.email !== undefined ? req.body.email : "",
        first_name   = req.body.fname !== undefined ? req.body.fname : "",
        last_name    = req.body.lname !== undefined ? req.body.lname : "",
        position     = req.body.position !== undefined ? req.body.position : "",
        values       = {},
        connection   = SqlConnect.makeConnection();
    let statement    = "UPDATE staff SET ? WHERE staff_id = ?",
        staff_id     = req.body.staff_id !== undefined ? req.body.staff_id : "",
    result;
  if (!validator.isInt(staff_id, { min: 1 }) || !old_password) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      data   : {}
    });
  }
  if (privilege.pass) {
    staff_id = parseInt(staff_id, 10);
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
        "SELECT password FROM staff WHERE staff_id = ? LIMIT 1",
        [staff_id]
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
        result = await connection.query(statement, [values, staff_id]);
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

const dStaff = async (req, res) => {
  const privilege  = await verify(req.token, false),
        connection = SqlConnect.makeConnection(),
        statement  = "DELETE FROM staff WHERE staff_id = ?",
        staff_id   = req.params.staff_id;
  let result;
  if(!staff_id){
    return res.status(400).json({
      success: false,
      message: "Bad Request",
      data   : {}
    });
  }
  if (privilege.pass){
    if (!validator.isInt(staff_id, {min: 1})){
      return res.status(400).json({
        success: false,
        message: "Bad Request",
        data   : {}
      });
    }
    try {
      await connection.connect();
      result = await connection.query(statement, [staff_id]);
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
    data: { affectedStaff: result.affectedRows}
  });
};

module.exports = {
  signin,
  cStaff,
  rStaff,
  uStaff,
  dStaff,
  verifyToken
};
