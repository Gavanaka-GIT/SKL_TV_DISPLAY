import React, { useState } from "react";
import CtxTVScreen from "./TV-Screen-Context";

const TVScreenProvider = (props) => {

  const [userName, setUserName] = useState(localStorage.getItem("TVScIoTUserName"));
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("TVScIoTisLoggedIn"));
  const [serverIp, setServerIp] = useState(localStorage.getItem("TVScIoTServerIp"));
  const [prodUnit, setProdUnit] = useState([]);
  const [companyList, setCompanyList] = useState([]);

  const updateUsrNameHandler = (userName) => {
    if (userName.UserName !== null) {
      setUserName(userName.UserName)
      localStorage.setItem("TVScIoTUserName", userName.UserName);
    } else {
      setUserName(null)
      localStorage.removeItem("TVScIoTUserName");
    }

    if (userName.isLoggedIn === "1") {
      setIsLoggedIn("1");
      localStorage.setItem("TVScIoTisLoggedIn", "1");
    } else {
      setIsLoggedIn("0");
      localStorage.removeItem("TVScIoTisLoggedIn");
    }

    if (userName.ServerIp !== null) {
      setServerIp(userName.ServerIp);
      localStorage.setItem("TVScIoTServerIp", userName.ServerIp);
    }
  };

  const setProdUnitHandler = (item) => {
    setProdUnit(item);
  }

  const setCompanyListHandler = (item) => {
    setCompanyList(item);
  }

  const TVScreenCtx = {
    userName: userName,
    isLoggedIn: isLoggedIn,
    serverIp: serverIp,
    prodUnit: prodUnit,
    companyList: companyList,
    updateUsrName: updateUsrNameHandler,
    setProdUnit: setProdUnitHandler,
    setCompanyList: setCompanyListHandler
  };

  // console.log("TVScreenProvider rendered");
  return (
    <CtxTVScreen.Provider value={TVScreenCtx}>
      {props.children}
    </CtxTVScreen.Provider>
  );
};

export default TVScreenProvider;