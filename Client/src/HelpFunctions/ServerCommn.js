export const checkUserDetails = async (serverIp, userDet) => {
  try {
    const response = await fetch(
      "http://" + serverIp + "/api/checkUserDetails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDet),
      }
    );
    const reply = await response.json();
    console.log(reply);
    return reply;
  } catch (e) {
    console.log(e.message);
    return e.message;
  }
};

export const funGetProdUnitDetails = async (userName, serverIp, value) => {
  try {
    const response = await fetch("http://" + serverIp + "/api/getProdUnitDetails/" + userName + "/" + value);
    const DbResponseList = await response.json();
    //console.log(DbResponseList)
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetLineDetails = async (prodUnit, selFloor, serverIp) => {
  try {
    const response = await fetch("http://" + serverIp + "/api/getLineDetails/" + prodUnit + "/" + selFloor);
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetFloorDetails = async (prodUnit, serverIp) => {
  try {
    const response = await fetch("http://" + serverIp + "/api/getFloorDetails/" + prodUnit);
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetDownTimeDetails = async (devNo, hr, selDate, serverIp) => {
  try {
    const response = await fetch("http://" + serverIp + "/api/getDownTimeDetails/" + devNo + "/" + hr + "/" + selDate);
    const DbResponseList = await response.json();
    // console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetShiftDetails = async (line, serverIp) => {
  try {
    const response = await fetch("http://" + serverIp + "/api/getShiftDetails/" + line);
    const DbResponseList = await response.json();
    // console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetLineProdStatus = async (prodUnit, serverIp) => {
  try {
    const response = await fetch("http://" + serverIp + "/api/getLineProdStatus/" + prodUnit);
    const DbResponseList = await response.json();
    console.log(DbResponseList)
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const getFloorDetails = async(serverIp)=>{
  try{
  const response = (await fetch("http://"+serverIp+"/api/getFloorDetails"));
  const floorDetails=await response.json();
  console.log(floorDetails);
  return floorDetails;
  }catch(e){
    console.log(e.message);
    alert(e.message);
    let floorDetails=[];
    return floorDetails;
  }
}

export const funGetOrderSummaryStatus = async (iono, combo, style, serverIp) => {
  try {
    const response = await fetch("http://" + serverIp + "/api/getOrderSummaryStatus/" + iono + "/" + combo + "/" + style);
    // console.log(response)
    const DbResponseList = await response.json();
    // console.log(DbResponseList)
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetReportShiftList = async (prodUnit, serverIp) => {
  try {
    const response = await fetch("http://" + serverIp + "/api/getReportShiftDetails/" + prodUnit);
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetFactoryDetails = async (stDate, endDate, prodUnit, shift, selCompany, serverIp) => {
  try {
    const response = await fetch("http://" + serverIp + "/api/getFactoryDetails/" + stDate + "/" + endDate + "/" + prodUnit + "/" + shift + "/" + selCompany);
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetReportLineDetails = async (stDate, endDate, prodUnit, floorName, companyId, shift, serverIp) => {
  try {
    const response = await fetch("http://" + serverIp + "/api/getReportLineDetails/" + stDate + "/" + endDate + "/" + prodUnit + "/" + floorName + "/" + companyId + "/" + shift);
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetReportOperatorDetails = async (stDate, endDate, prodUnit, floorName, companyId, line, shift, serverIp) => {
  try {
    const response = await fetch(
      "http://" + serverIp + "/api/getOperatorDetails/" + stDate + "/" + endDate + "/" + prodUnit + "/" + floorName + "/" + companyId + "/" + line + "/" + shift
    );
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetLineProdMontDetails = async (stDate, endDate, prodUnit, floorName, companyId, line, shift, rptTyp, serverIp) => {
  try {
    const response = await fetch(
      "http://" + serverIp + "/api/getLineProdMontDetails/" + stDate + "/" + endDate + "/" + prodUnit + "/" + floorName + "/" + companyId + "/" + line + "/" + shift + "/" + rptTyp
    );
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetMachDownTimeDetails = async (stDate, endDate, prodUnit, floorName, companyId, line, shift, serverIp) => {
  console.log("getMachDownTimeDetails");
  try {
    const response = await fetch(
      "http://" + serverIp + "/api/getMachDownTimeDetails/" + stDate + "/" + endDate + "/" + prodUnit + "/" + floorName + "/" + companyId + "/" + line + "/" + shift
    );
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetProcessWiseDetails = async (stDate, endDate, prodUnit, floorName, companyId, line, shift, serverIp) => {
  try {
    const response = await fetch(
      "http://" + serverIp + "/api/getProcessWiseDetails/" + stDate + "/" + endDate + "/" + prodUnit + "/" + floorName + "/" + companyId + "/" + line + "/" + shift
    );
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetMachDownTimeMonDetails = async (stDate, endDate, prodUnit, floorName, companyId, line, mon, shift, serverIp) => {
  console.log("getMachDownTimeDetails");
  try {
    const response = await fetch(
      "http://" + serverIp + "/api/getMachDownTimeMonDetails/" + stDate + "/" + endDate + "/" + prodUnit + "/" + floorName + "/" + companyId + "/" + line + "/" + mon + "/" + shift
    );
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetOperLineDownTimeDetails = async (stDate, endDate, prodUnit, floorName, companyId, line, shift, mode, serverIp) => {
  try {
    const response = await fetch(
      "http://" + serverIp + "/api/getOperLineDownTimeDetails/" + stDate + "/" + endDate + "/" + prodUnit + "/" + floorName + "/" + companyId + "/" + line + "/" + shift + "/" + mode
    );
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetLineDownTimeDetails = async (stDate, endDate, prodUnit, floorName, companyId, line, shift, serverIp) => {
  try {
    const response = await fetch(
      "http://" + serverIp + "/api/getLineDownTimeDetails/" + stDate + "/" + endDate + "/" + prodUnit + "/" + floorName + "/" + companyId + "/" + line + "/" + shift
    );
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetMachTyptDownTimeDetails = async (stDate, endDate, prodUnit, floorName, companyId, line, shift, serverIp) => {
  try {
    const response = await fetch(
      "http://" + serverIp + "/api/getMachTyptDownTimeDetails/" + stDate + "/" + endDate + "/" + prodUnit + "/" + floorName + "/" + companyId + "/" + line + "/" + shift
    );
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetMachTypetDownTimeDetails = async (stDate, endDate, prodUnit, floorName, companyId, line, shift, machType, serverIp) => {
  try {
    const response = await fetch(
      "http://" + serverIp + "/api/getMachTypetDownTimeDetails/" + stDate + "/" + endDate + "/" + prodUnit + "/" + floorName + "/" + companyId + "/" + line + "/" + shift + "/" + machType
    );
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetOperatorDowntimeDetails = async (stDate, endDate, prodUnit, floorName, companyId, line, shift, serverIp) => {
  try {
    const response = await fetch(
      "http://" + serverIp + "/api/getOperatorDowntimeDetails/" + stDate + "/" + endDate + "/" + prodUnit + "/" + floorName + "/" + companyId + "/" + line + "/" + shift
    );
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const funGetOperatorEffDetails = async (stDate, endDate, prodUnit, floorName, companyId, line, shift, serverIp) => {
  try {
    const response = await fetch(
      "http://" + serverIp + "/api/getOperatorEffDetails/" + stDate + "/" + endDate + "/" + prodUnit + "/" + floorName + "/" + companyId + "/" + line + "/" + shift
    );
    const DbResponseList = await response.json();
    console.log(DbResponseList);
    return (DbResponseList);
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    let DbResponseList = { OrderInfo: [] };
    return (DbResponseList);
  }
};

export const testApi = async (testData) => {
  try {
    const response = await fetch(
      "http://erpapp.bestcorp.ind.in:5005/api/sendLogDetail",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      }
    );
    const reply = await response.json();
    console.log("testApi", reply);
    return reply;
  } catch (e) {
    console.log(e.message);
    return e.message;
  }
};