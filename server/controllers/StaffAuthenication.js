const jwt         = require("jsonwebtoken");
const path        = require("path");
const fs          = require("fs");
const SqlConnect  = require("../controllers/SqlConnect");
const private_key = fs.readFileSync(
  path.resolve(__dirname, "../config/private.key")
);

const authenicate = async (token, needData = false) => {
  let result;
  const statement  = "SELECT ?? FROM ?? WHERE username = ? AND staff_id = ? LIMIT 1",
        fields     = ["staff_id", "username", "email", "first_name", "last_name", "position"],
        tables     = ["staff"],
        connection = SqlConnect.makeConnection();
  const decode = jwt.verify(token, private_key, (err, decoded) => {
    if (err) return false;
    else return decoded;
  });

  if(decode === false){
    return {
      error     : true,
      error_code: "TOKEN_ERROR",
    };
  }

  if(needData){
    try {
      await connection.connect();
      result = await connection.query(statement, [fields, tables, decode.username, decode.staff_id]);
      SqlConnect.closeConnection(connection);
    } catch (err) {
      if (!err.fatal) SqlConnect.closeConnection(connection);
      return {
        error     : true,
        error_code: "DB_ERROR",
      };
    }
    return {
      error: false,
      data : result[0]
    };
  }
  return {
    error: false,
    data : decode
  };
};

async function verify(token, needData) {
  const verifiedResult = new Object();
  const verifiedData   =
    token !== null ? await authenicate(token, needData) : null;
  if (token === null) {
    verifiedResult.pass        = false;
    verifiedResult.status_code = 401;
    verifiedResult.return_json = {
      success: false,
      message: "Unauthorized",
      data   : {}
    };
  } else {
    if (verifiedData.error === true) {
      switch (verifiedData.error_code) {
        case "DB_ERROR":
          verifiedResult.pass        = false;
          verifiedResult.status_code = 500;
          verifiedResult.return_json = {
            success: false,
            message: "Internal Server Error",
            data   : {}
          };
          break;
        case "TOKEN_ERROR":
          verifiedResult.pass        = false;
          verifiedResult.status_code = 401;
          verifiedResult.return_json = {
            success: false,
            message: "Unauthorized",
            data   : {}
          };
          break;
      }
    } else {
      verifiedResult.pass        = true;
      verifiedResult.status_code = 200;
      verifiedResult.return_json = {
        success: true,
        message: "OK",
        data   : verifiedData.data
      };
    }
  }

  return verifiedResult;
}

module.exports = { authenicate, verify };
