/*eslint no-console: ["error", { allow: ["warn", "error", "info", "log"] }] */
/* eslint no-unused-vars: 0 */
const SqlConnect    = require("../controllers/SqlConnect");
const validator     = require("validator");
const verify        = require("../controllers/StaffAuthenication").verify;

const cKeyword = async (req, res) => {
  const privilege   = await verify(req.token, false),
        connection  = SqlConnect.makeConnection(),
        keyword_str = req.params.keyword,
        add_success = [];
  let commit_flag   = false;
  if(privilege.pass){
    if(!keyword_str){
      return res.status(400).json({
        success: false,
        message: "Bad Request",
        data   : {}
      });
    }
    const keywords = keyword_str.split(',');
    try {
      await connection.connect();
      await connection.beginTransaction();
      for(let keyword of keywords){
        let result = await connection.query("SELECT keyword_id FROM keyword WHERE keyword = ?", [keyword]);
        if(result.length >= 1) continue;
        else{
          result = await connection.query("INSERT INTO keyword(keyword) VALUES (?)", [keyword]);
          add_success.push(keyword);
          console.info(`Insert new keyword completed at id: ${result.insertId}.`);
        }
      }
      await connection.commit();
      commit_flag = true;
      SqlConnect.closeConnection(connection);
    } catch (err) {
      if (!commit_flag) connection.rollback();
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
      keywords: add_success,
      count   : add_success.length
    }
  });
};

const dKeyword = async (req, res) => {
    const ids = req.params.keyword_id.split(','),
          privilege = await verify(req.token, false),
          connection = SqlConnect.makeConnection(),
          valid_ids = [];
    let result,
        statement = "DELETE FROM keyword WHERE";
    
    if (privilege.pass)
    {    
        try {
            await connection.connect();
            for(let id of ids){
                if(!validator.isInt(id, {min: 1})) continue;
                if(valid_ids.length !== 0) statement += " OR";
                statement += " keyword_id = ?";
                valid_ids.push(id);
            }
            result = await connection.query(statement, valid_ids);
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
    } else {
        return res.status(privilege.status_code).json(privilege.return_json);
    }

    return res.status(200).json({
        success: true,
        message: "OK",
        data   : { affectedKeyword: result.affectedRows }
    });
};

const uKeyword = async (req, res) => {
  const privilege   = await verify(req.token, false),
        connection  = SqlConnect.makeConnection(),
        ids         = req.params.keyword_id.split(','),
        keywords    = req.params.keyword.split(','),
        updated     = [],
        statement   = "UPDATE keyword SET ? WHERE keyword_id = ?";
  let   index       = 0,
        commit_flag = false;
  if(privilege.pass){
    if(ids.length !== keywords.length){
      return res.status(400).json({
        success: false,
        message: "Bad Request",
        data   : {}
      });
    }
    try {
      await connection.connect();
      await connection.beginTransaction();
      for(let id of ids){
        if(!validator.isInt(id, {min: 1})) continue;
        let result = await connection.query(statement, [{keyword: keywords[index]}, id]);
        if (result.affectedRows === 1) updated.push(id);
        index++;
      }
      await connection.commit();
      commit_flag = true;
      SqlConnect.closeConnection(connection);
    } catch (err) {
      if (!commit_flag) connection.rollback();
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
    data   : {
      updated_ids: updated,
      count      : updated.length
    }
  });
};

module.exports = {
  cKeyword,
  dKeyword,
  uKeyword
};
