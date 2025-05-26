async function UpdatePriority() {
  let connection;
  let sql, binds, result, status=true,message=null;

  try {
    connection = await oracledb.getConnection();

    sql=`SELECT DISTINCT LINENAME,LINENAME FROM LINEMAS`
    

    result = await connection.execute(sql);
    binds=result.rows;
    if(binds.length>0){
        sql=`UPDATE ORDERDETAILS X SET PRIO = (SELECT PRIO FROM (SELECT ID, ROWNUM PRIO FROM (
        SELECT DISTINCT ID, LINENAME, STTIME FROM ORDERDETAILS WHERE IONO||COMBO||SDESC||LINENAME IN (SELECT IONO||COMBO||SDESC||LINENAME FROM ORDERDETAILS WHERE IONO IN 
        (SELECT DOCID FROM ORDMAS@GARSMART WHERE OD='NO') AND (DELETED = 'F' OR DELETED IS NULL) HAVING COUNT (IONO||COMBO||SDESC||LINENAME) = 1 GROUP BY IONO, COMBO, SDESC, LINENAME) AND (DELETED = 'F' OR DELETED IS NULL) 
        AND LINENAME IS NOT NULL AND SEWBAL > 0 AND LINENAME = :1 ORDER BY 2, 3))A WHERE A.ID = X.ID) WHERE ID IN (SELECT ID FROM (
        SELECT ID, ROWNUM FROM (
        SELECT DISTINCT ID, LINENAME, STTIME FROM ORDERDETAILS WHERE IONO||COMBO||SDESC||LINENAME IN (SELECT IONO||COMBO||SDESC||LINENAME FROM ORDERDETAILS WHERE IONO IN 
        (SELECT DOCID FROM ORDMAS@GARSMART WHERE OD='NO') AND (DELETED = 'F' OR DELETED IS NULL) HAVING COUNT (IONO||COMBO||SDESC||LINENAME) = 1 GROUP BY IONO, COMBO, SDESC, LINENAME) AND (DELETED = 'F' OR DELETED IS NULL) 
        AND LINENAME IS NOT NULL AND SEWBAL > 0 AND LINENAME = :2 ORDER BY 2, 3)))`

        // For a complete list of options see the documentation.
      options = {
        autoCommit: true,
        // batchErrors: true,  // continue processing even if there are data errors
        //ID, IONO, PONUMBER, PODATE, SHIPDT, STYLENO, SDESC, COMBO, SAM,
        //ORDQTY, PRODQTY, TOTSAM, BUYER, DESTCOUNTRY, SEASON, NOOFDAYS, PLANUNIT, SPLIT, PK
        bindDefs: [
          { type: oracledb.NUMBER },                 //1
          { type: oracledb.STRING, maxSize: 100 },   //2
          { type: oracledb.STRING, maxSize: 100 },   //3
          { type: oracledb.STRING, maxSize: 100 },   //4
        ],
      };

      result = await connection.executeMany(sql, binds, options);
      console.log("=====================================================");
      console.log("ProdDetails: UpdatePriority --> Number of rows updated for INPUTQTY:", result.rowsAffected);
    }
  } catch (err) {
    console.log("ProdDetails: UpdatePriority --> Error1:" + err.message);
    status = false;
    message = err.message;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.log("ProdDetails: updProdDetailsC1CUTQTY --> Error2:" + err.message);
      }
    }
    return { status: status, message: message };
  }
}