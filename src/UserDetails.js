const oracledb = require("oracledb");
const dbConfig = require("./dbconfig.js");
const config = require("./config.js");

async function GetUserDetails(userId) {
  let connection;
  let sql, binds, options, result;

  try {
    connection = await oracledb.getConnection(dbConfig);

    sql = `SELECT PASSWORD FROM AXUSERS WHERE USERNAME = '${userId}'`;

    binds = {};

    // For a complete list of options see the documentation.
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };

    result = await connection.execute(sql, binds, options);
  } catch (err) {
    console.log("GetUserDetails1: " + err.message);
    result.rows = [];
    return result.rows;
  } finally {
    if (connection) {
      try {
        await connection.close();
        // console.log(result.rows);
        return result.rows;
      } catch (err) {
        console.log("GetUserDetails2: " + err.message);
        result.rows = [];
        return result.rows;
      }
    }
  }
}

async function GetProdUnitDetails(userId, report) {
  let connection;
  let sql, binds, options, result;
  try {
    connection = await oracledb.getConnection(dbConfig);

    if (report === "PROD") {
      sql = `SELECT B.TVREPUNITNAME FROM TVREPUNITACCESS A, TVREPUNIT B WHERE A.TVREPUNITID = B.TVREPUNITID 
    AND A.USERID = '${userId}' AND B.PROD = 'T'`;
    } else if (report === "PACK") {
      sql = `SELECT B.TVREPUNITNAME FROM TVREPUNITACCESS A, TVREPUNIT B WHERE A.TVREPUNITID = B.TVREPUNITID 
      AND A.USERID = '${userId}' AND B.PACK = 'T'`;
    }

    binds = {};

    // For a complete list of options see the documentation.
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };

    result = await connection.execute(sql, binds, options);
    // console.log(result);
  } catch (err) {
    console.log("GetProdUnitDetails: " + err.message);
    result.rows = [];
    return result.rows;
  } finally {
    if (connection) {
      try {
        await connection.close();
        return result.rows;
      } catch (err) {
        console.log("GetProdUnitDetails1: " + err.message);
        result.rows = [];
        return result.rows;
      }
    }
  }
}

async function GetLineProdStatus(floor) {
  let connection;
  let sql, binds, options, result, dayStatus;

  try {
    connection = await oracledb.getConnection(dbConfig);

    if (floor === "FLOOR1" || floor === "FLOOR2" || floor === "FLOOR3" ) {

      sql = `SELECT A.*, SUBSTR(LINE,9,4) LN, EMP, AMT FROM (SELECT ROWNUM, A.* FROM HOUR_PROHO_VIEW A) A, 
      PARTYMAS B, (SELECT SUBSTR(GLINENO,9,4) LN, LINENO, COUNT(EMPID) EMP, SUM(TOTAMT) AMT, GLINENO FROM 
      PAYROLL.MOBILEAPP_EMPCOST_VIEW A WHERE CREATEDON IN (SELECT DT FROM (SELECT MAX(CREATEDON) DT, EMPID 
      FROM PAYROLL.MOBILEAPP_EMPCOST_VIEW G WHERE G.EMPID = A.EMPID GROUP BY EMPID)) GROUP BY LINENO, 
      GLINENO) C WHERE A.LINE = B.PARTYID AND B.SFLOOR= '${floor}' AND A.LINE = C.GLINENO(+) AND 
      (H1 > 0 OR H2 > 0 OR H3 > 0 OR H4 > 0 OR H5 > 0 OR H6 > 0 OR H7 > 0 OR H8 > 0 OR H9 > 0 OR H10 > 0 
        OR TARGET > 0 OR EMP > 0) ORDER BY 25, 1`

      // sql = `SELECT A.*, SUBSTR(LINE,9,4) LN, EMP, AMT FROM (SELECT ROWNUM, A.* FROM HOUR_PROHO_VIEW A) A, 
      // PARTYMAS B, (SELECT SUBSTR(GLINENO,9,4) LN, LINENO, COUNT(EMPID) EMP, SUM(TOTAMT) AMT, GLINENO FROM 
      // PAYROLL.MOBILEAPP_EMPCOST_VIEW A WHERE CREATEDON IN (SELECT DT FROM (SELECT MAX(CREATEDON) DT, EMPID 
      // FROM PAYROLL.MOBILEAPP_EMPCOST_VIEW G WHERE G.EMPID = A.EMPID GROUP BY EMPID)) GROUP BY LINENO, 
      // GLINENO) C WHERE A.LINE = B.PARTYID AND B.SFLOOR= '${floor}' AND A.LINE = C.GLINENO(+) ORDER BY 1`
    } else if (floor === "Unit2") {
      sql = `SELECT A.*, SUBSTR(LINE,9,4) LN, EMP, AMT FROM (SELECT ROWNUM, A.* FROM HOUR_PROU2_VIEW A) A, 
      (SELECT SUBSTR(GLINENO,9,4) LN, LINENO, COUNT(EMPID) EMP, SUM(TOTAMT) AMT, GLINENO FROM 
      PAYROLL.MOBILEAPP_EMPCOST_VIEW A WHERE CREATEDON IN (SELECT DT FROM (SELECT MAX(CREATEDON) DT, EMPID 
      FROM PAYROLL.MOBILEAPP_EMPCOST_VIEW G WHERE G.EMPID = A.EMPID GROUP BY EMPID)) GROUP BY LINENO, 
      GLINENO) C WHERE A.LINE = C.GLINENO(+) AND (H1 > 0 OR H2 > 0 OR H3 > 0 OR H4 > 0 OR H5 > 0 OR H6 > 0 
        OR H7 > 0 OR H8 > 0 OR H9 > 0 OR H10 > 0 OR TARGET > 0 OR EMP > 0) ORDER BY 25, 1`

      // sql = `SELECT A.*, SUBSTR(LINE,9,4) LN, EMP, AMT FROM (SELECT ROWNUM, A.* FROM HOUR_PROU2_VIEW A) A, 
      // (SELECT SUBSTR(GLINENO,9,4) LN, LINENO, COUNT(EMPID) EMP, SUM(TOTAMT) AMT, GLINENO FROM 
      // PAYROLL.MOBILEAPP_EMPCOST_VIEW A WHERE CREATEDON IN (SELECT DT FROM (SELECT MAX(CREATEDON) DT, EMPID 
      // FROM PAYROLL.MOBILEAPP_EMPCOST_VIEW G WHERE G.EMPID = A.EMPID GROUP BY EMPID)) GROUP BY LINENO, 
      // GLINENO) C WHERE A.LINE = C.GLINENO(+) ORDER BY 1`
    } else if (floor === "Unit3") {
      sql = `SELECT A.*, SUBSTR(LINE,9,4) LN, EMP, AMT FROM (SELECT ROWNUM, A.* FROM HOUR_PROU3_VIEW A) A, 
      (SELECT SUBSTR(GLINENO,9,4) LN, LINENO, COUNT(EMPID) EMP, SUM(TOTAMT) AMT, GLINENO FROM 
      PAYROLL.MOBILEAPP_EMPCOST_VIEW A WHERE CREATEDON IN (SELECT DT FROM (SELECT MAX(CREATEDON) DT, EMPID 
      FROM PAYROLL.MOBILEAPP_EMPCOST_VIEW G WHERE G.EMPID = A.EMPID GROUP BY EMPID)) GROUP BY LINENO, 
      GLINENO) C WHERE A.LINE = C.GLINENO(+) AND (H1 > 0 OR H2 > 0 OR H3 > 0 OR H4 > 0 OR H5 > 0 OR H6 > 0 
        OR H7 > 0 OR H8 > 0 OR H9 > 0 OR H10 > 0 OR TARGET > 0 OR EMP > 0) ORDER BY 25, 1`

      // sql = `SELECT A.*, SUBSTR(LINE,9,4) LN, EMP, AMT FROM (SELECT ROWNUM, A.* FROM HOUR_PROU3_VIEW A) A, 
      // (SELECT SUBSTR(GLINENO,9,4) LN, LINENO, COUNT(EMPID) EMP, SUM(TOTAMT) AMT, GLINENO FROM 
      // PAYROLL.MOBILEAPP_EMPCOST_VIEW A WHERE CREATEDON IN (SELECT DT FROM (SELECT MAX(CREATEDON) DT, EMPID 
      // FROM PAYROLL.MOBILEAPP_EMPCOST_VIEW G WHERE G.EMPID = A.EMPID GROUP BY EMPID)) GROUP BY LINENO, 
      // GLINENO) C WHERE A.LINE = C.GLINENO(+) ORDER BY 1`
    }

    binds = {};

    // For a complete list of options see the documentation.
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };

    result = await connection.execute(sql, binds, options);
    // console.log(result);
  } catch (err) {
    console.log("GetLineProdStatus1: " + err.message);
    result.rows = [];
    return result.rows;
  } finally {
    if (connection) {
      try {
        await connection.close();
        return { prodStatus: result.rows };
      } catch (err) {
        console.log("GetLineProdStatus2: " + err.message);
        result.rows = [];
        return result.rows;
      }
    }
  }
}

async function getOrderSummaryStatus(iono, combo, style) {
  let connection;
  let sql, binds, options, result;

  try {
    connection = await oracledb.getConnection(dbConfig);

    sql = `DELETE FROM TV_TEMP_CUTSTATUS`

    binds = {};

    // For a complete list of options see the documentation.
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };

    result = await connection.execute(sql, binds, options);

    sql = `INSERT INTO TV_TEMP_CUTSTATUS(IONO, COMBO) VALUES ('${iono}', '${combo}')`;

    binds = {};

    result = await connection.execute(sql, binds, options);

    sql = `SELECT A.*, C.STYLENUMBER, D.SSNO FROM (SELECT * FROM TV_CUTSTATUSDET1_VIEW) A, 
    (SELECT * FROM ORDMAS WHERE DOCID = '${iono}') B, STYLENUM C, (SELECT ORDMASID, SNO SSNO, SIZES FROM 
      SIZEORDER_VIEW) D, TV_TEMP_CUTSTATUS E WHERE A.IONO = B.DOCID AND E.IONO = A.IONO AND 
      B.STYLENO = C.STYLENUMID AND B.ORDMASID = D.ORDMASID(+) AND A.SIZES = D.SIZES(+) AND 
      C.STYLENUMBER = '${style}' ORDER BY A.STYLEDESC, COLOR, SNO, D.SSNO`;

    // sql = `SELECT A.*, C.STYLENUMBER, D.SSNO FROM (SELECT * FROM ACUTSTATUSDET1_VIEW WHERE 
    //   COLOR = '${combo}' AND IONO = '${iono}') A, (SELECT * FROM ORDMAS WHERE DOCID = '${iono}') B, 
    //   STYLENUM C, (SELECT ORDMASID, SNO SSNO, SIZES FROM SIZEORDER_VIEW) D WHERE A.IONO=B.DOCID AND 
    //   B.STYLENO=C.STYLENUMID AND B.ORDMASID = D.ORDMASID(+) AND A.SIZES = D.SIZES(+) AND 
    //   C.STYLENUMBER = '${style}' ORDER BY A.STYLEDESC, COLOR, SNO, D.SSNO`

    binds = {};

    // For a complete list of options see the documentation.
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };

    result = await connection.execute(sql, binds, options);
  } catch (err) {
    console.log("getOrderSummaryStatus1: " + err.message);
    result.rows = [];
    return result.rows;
  } finally {
    if (connection) {
      try {
        await connection.close();
        return { orderStatus: result.rows };
      } catch (err) {
        console.log("getOrderSummaryStatus2: " + err.message);
        result.rows = [];
        return result.rows;
      }
    }
  }
}


async function getFloorDetails(){
  let connection, sql, binds, options, result;
  try{
   connection = await oracledb.getConnection(dbConfig);
   sql=`SELECT FLOOR FROM(
    SELECT SFLOOR FLOOR, ROWNUM CROWNUM FROM(
    SELECT DISTINCT SFLOOR FROM PARTYMAS WHERE SFLOOR IS NOT NULL GROUP BY SFLOOR ORDER BY SFLOOR)
    UNION
    SELECT 'Unit2', 300 FROM DUAL
    UNION
    SELECT 'Unit3', 301 FROM DUAL
    UNION
    SELECT 'ALL',302 FROM DUAL)
    ORDER BY CROWNUM`
   binds={}
   options={
    outFormat: oracledb.OUT_FORMAT_OBJECT,
   }

   result= await connection.execute(sql,binds,options);

  }catch(e){
   console.log("error in getting Floor Details");
   result.rows=[];
   return result.rows;
  }finally{
    if(connection){
      try{
      await connection.close();
      return result.rows;
      }catch(err){
        console.log("error in getting Floor Details");
        result.rows=[];
        return result.rows;
      }
    }
  }
}

module.exports = {
  GetUserDetails, GetProdUnitDetails, GetLineProdStatus, getOrderSummaryStatus,
  getFloorDetails
};