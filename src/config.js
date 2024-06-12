const fs = require('fs');
const dbConfig = require("./dbconfig.js");

var g_QueryList = {
  portNumber: 5025
};

async function readQueryConfig() {
  fs.readFile("./Query.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const Db_Config_Str = data;
    const First_SplitString = Db_Config_Str.split("||");
    // console.log(First_SplitString[0]);
    // console.log(First_SplitString[1]);

    const Db_Config_Login_Credentials_Str = First_SplitString[0];

    //Db Config Login Credentials
    const LoginString = Db_Config_Login_Credentials_Str.split(";");   //Second split
    // console.log(LoginString[0]);
    // console.log(LoginString[1]);
    // console.log(LoginString[2]);
    // console.log(LoginString[3]);

    dbConfig.user = LoginString[0];
    dbConfig.password = LoginString[1];
    dbConfig.connectString = LoginString[2];
    //dbconfig.externalAuth = LoginString[3];
    g_QueryList.portNumber = LoginString[4];
  });
}

module.exports = {
  readQueryConfig,
  g_QueryList
};