/*eslint no-console: ["error", { allow: ["warn", "error", "info", "log"] }] */
/* eslint no-unused-vars: 0 */
const SqlConnect    = require("../controllers/SqlConnect");
const validator     = require("validator");
const Authenication = require("../controllers/StaffAuthenication");
const verify        = Authenication.verify;

const cCurriculum = async (req, res) => {
  const name       = req.body.name !== undefined ? req.body.name : "",
        degree     = req.body.degree !== undefined ? req.body.degree : "",
        statement  =
            "INSERT INTO curriculum(name, degree) VALUES (?)",
        connection  = SqlConnect.makeConnection(),
        privilege   = await verify(req.token, false);
  let result;

  if (!name || !degree) {
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
        name,
        degree
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
      curriculum_id: result.insertId
    }
  });

};

const uCurriculum = async (req, res) => {
  const name       = req.body.name !== undefined ? req.body.name : "",
        degree     = req.body.degree !== undefined ? req.body.degree : "",
        id         = req.body.id,
        statement  = "UPDATE curriculum SET ? WHERE curriculum_id = ?",
        connection = SqlConnect.makeConnection(),
        privilege  = await verify(req.token, false),
        values     = {};
  let result;

  if (!validator.isInt(id, { min: 1 })) {
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
    if (name) values.name = name;
    if (degree) values.degree = degree;
    try {
      await connection.connect();
      if (Object.keys(values).length > 0) {
        result = await connection.query(statement, [
          values,
          parseInt(id, 10)
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

const dCurriculum = async (req, res) => {
  const ids        = req.params.ids.split(","),
        privilege  = await verify(req.token, false),
        connection = SqlConnect.makeConnection(),
        valid_ids  = [];
  let result,
      statement = "DELETE FROM curriculum WHERE";

  if (privilege.pass) {
    try {
      await connection.connect();
      for (let id of ids) {
        if (!validator.isInt(id, { min: 1 })) continue;
        if (valid_ids.length !== 0) statement += " OR";
        statement += " curriculum_id = ?";
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
    data   : { affectedCurriculum : result.affectedRows }
  });

};

module.exports = {
  cCurriculum,
  uCurriculum,
  dCurriculum
};