/*eslint no-console: ["error", { allow: ["warn", "error", "info", "log"] }] */
/* eslint no-unused-vars: 0 */
const SqlConnect = require("../controllers/SqlConnect");
const validator = require("validator");
const verify = require("../controllers/StaffAuthenication").verify;

const cInternalLecturer = async (req, res) => {
  const fname      = req.body.fname !== undefined ? req.body.fname : "",
        lname      = req.body.lname !== undefined ? req.body.lname : "",
        position   = req.body.position !== undefined ? req.body.position : "",
        statement  = "INSERT INTO internal_lecturer(first_name, last_name, position) VALUES (?)",
        connection = SqlConnect.makeConnection(),
        privilege  = await verify(req.token, false);
  let result;

  if (!fname || !lname || !position) {
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
      result = await connection.query(statement, [[fname, lname, position]]);
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
      lecturer_id: result.insertId
    }
  });
};

const uInternalLecturer = async (req, res) => {
  const fname       = req.body.fname !== undefined ? req.body.fname : "",
        lname       = req.body.lname !== undefined ? req.body.lname : "",
        position    = req.body.position !== undefined ? req.body.position : "",
        lecturer_id = req.body.lecturer_id !== undefined ? req.body.lecturer_id : "",
        statement   = "UPDATE internal_lecturer SET ? WHERE lecturer_id = ?",
        connection  = SqlConnect.makeConnection(),
        privilege   = await verify(req.token, false),
        values      = {};
  let result;

  if (!validator.isInt(lecturer_id, { min: 1 })) {
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
    if (fname) values.first_name = fname;
    if (lname) values.last_name = lname;
    if (position) values.position = position;
    try {
      await connection.connect();
      if (Object.keys(values).length > 0) {
        result = await connection.query(statement, [
          values,
          parseInt(lecturer_id, 10)
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

const dInternalLecturer = async (req, res) => {
  const ids        = req.params.lecturer_id.split(","),
        privilege  = await verify(req.token, false),
        connection = SqlConnect.makeConnection(),
        valid_ids  = [];
  let result,
      statement = "DELETE FROM internal_lecturer WHERE";

  if (privilege.pass) {
    try {
      await connection.connect();
      for (let id of ids) {
        if (!validator.isInt(id, { min: 1 })) continue;
        if (valid_ids.length !== 0) statement += " OR";
        statement += " lecturer_id = ?";
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
    data   : { affectedInternalLecturer: result.affectedRows }
  });
};

const cExternalLecturer = async (req, res) => {
  const fname       = req.body.fname !== undefined ? req.body.fname : "",
        lname       = req.body.lname !== undefined ? req.body.lname : "",
        position    = req.body.position !== undefined ? req.body.position : "",
        department  = req.body.department !== undefined ? req.body.department : "",
        faculty     = req.body.faculty !== undefined ? req.body.faculty : "",
        university  = req.body.university !== undefined ? req.body.university : "",
        statement   =
            "INSERT INTO external_lecturer(first_name, last_name, position, department, faculty, university) VALUES (?)",
        connection  = SqlConnect.makeConnection(),
        privilege   = await verify(req.token, false);
  let result;

  if (!fname || !lname || !position || !department || !faculty || !university) {
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
        fname,
        lname,
        position,
        department,
        faculty,
        university
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
      lecturer_id: result.insertId
    }
  });
};

const uExternalLecturer = async (req, res) => {
  const fname       = req.body.fname !== undefined ? req.body.fname : "",
        lname       = req.body.lname !== undefined ? req.body.lname : "",
        position    = req.body.position !== undefined ? req.body.position : "",
        department  = req.body.department !== undefined ? req.body.department : "",
        faculty     = req.body.faculty !== undefined ? req.body.faculty : "",
        university  = req.body.university !== undefined ? req.body.university : "",
        lecturer_id = req.body.lecturer_id !== undefined ? req.body.lecturer_id : "",
        statement   = "UPDATE external_lecturer SET ? WHERE lecturer_id = ?",
        connection  = SqlConnect.makeConnection(),
        privilege   = await verify(req.token, false),
        values      = {};
  let result;

  if (!validator.isInt(lecturer_id, { min: 1 })) {
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
    if (fname) values.first_name = fname;
    if (lname) values.last_name = lname;
    if (position) values.position = position;
    if (department) values.department = department;
    if (faculty) values.faculty = faculty;
    if (university) values.university = university;
    try {
      await connection.connect();
      if (Object.keys(values).length > 0) {
        result = await connection.query(statement, [
          values,
          parseInt(lecturer_id, 10)
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

const dExternalLecturer = async (req, res) => {
  const ids        = req.params.lecturer_id.split(","),
        privilege  = await verify(req.token, false),
        connection = SqlConnect.makeConnection(),
        valid_ids  = [];
  let result,
      statement = "DELETE FROM external_lecturer WHERE";

  if (privilege.pass) {
    try {
      await connection.connect();
      for (let id of ids) {
        if (!validator.isInt(id, { min: 1 })) continue;
        if (valid_ids.length !== 0) statement += " OR";
        statement += " lecturer_id = ?";
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
    data   : { affectedExternalLecturer: result.affectedRows }
  });
};

const establishAdviser = async (req, res) => {
  const connection    = SqlConnect.makeConnection(),
        lecturer_type = req.params.type,
        privilege  = await verify(req.token, false),
        lecturer_id   = req.params.id;
  let result,
      type,
      statement;
  if (!validator.isInt(lecturer_type, { min: 0, max: 1 })) {
    return res.status(400).json({
      success: false,
      message: "Lecturer type must be in range [0,1]",
      data   : {}
    });
  }

  if (lecturer_type == 0) type = "i_lecturer_id";
  else type = "e_lecturer_id";

  if (privilege.pass) {
    try {
      await connection.connect();
      // Check for exist lecturer for prevent duplicate adviser
      statement = `SELECT adviser_id FROM adviser WHERE ${type} = ?`;
      result = await connection.query(statement, [[lecturer_id]]);
      if (result.length) {
        SqlConnect.closeConnection(connection);
        return res.status(400).json({
          success: false,
          message: "Adviser already established.",
          data   : {}
        });
      }
      statement = "INSERT INTO adviser(??) VALUES(?)";
      result = await connection.query(statement, [[type], [lecturer_id]]);
      SqlConnect.closeConnection(connection);
    } catch (err) {
      if (!err.fatal) SqlConnect.closeConnection(connection);
      if (err.code.includes("ER_NO_REFERENCED_ROW")) {
        return res.status(400).json({
          success: false,
          message: `lecture_id = ${lecturer_id} not found`,
          data: {}
        })
      }
      console.error({ code: err.code, msg: err.sqlMessage, sql: err.sql });
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data   : {}
      });
    }

    return res.status(200).json({
      success: true,
      message: "OK",
      data   : {
        adviser_id: result.insertId
      }
    });
  } else {
    return res.status(privilege.status_code).json(privilege.return_json);
  }
}

const disestablishAdviser = async (req, res) => {
  const connection  = SqlConnect.makeConnection(),
        adviser_ids = req.params.ids.split(','),
        privilege   = await verify(req.token, false)
  let statement = "DELETE FROM adviser WHERE",
      sql;
  if (privilege.pass) {
    if (adviser_ids.length > 0 && adviser_ids.every(val => validator.isInt(val, { min: 0 }))) {
      for (const id of adviser_ids) { statement += " adviser_id = ?," }
      statement = statement.slice(0, -1)
      try {
        sql = connection.format(statement, adviser_ids)
        await connection.query(sql)
        return res.status(200).json({
          success: true,
          message: "Adviser was deleted",
          data: {}
        })
      } catch (error) {
        if (error.code.includes('ER_ROW_IS_REFERENCED')) {
          return res.status(400).json({
            success: false,
            message: "Can't delete adviser that has been referred by other tables"
          })
        }
        console.error({ code: error.code, msg: error.sqlMessage, sql: error.sql })
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
          data: {}
        })
      } finally {
        SqlConnect.closeConnection(connection)
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Bad request",
        data : {}
      })
    }
  } else {
    return res.status(privilege.status_code).json(privilege.return_json);
  }
}

module.exports = {
  cInternalLecturer,
  uInternalLecturer,
  dInternalLecturer,
  cExternalLecturer,
  uExternalLecturer,
  dExternalLecturer,
  establishAdviser,
  disestablishAdviser
};
