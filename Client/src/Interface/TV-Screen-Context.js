import React from "react";

const CtxTVScreen = React.createContext({
  userName: "",
  isLoggedIn: "",
  serverIp: "",
  prodUnit: [],
  companyList: [],
  updateUsrName: () => { },
  setProdUnit: () => { },
  setCompanyList: () => { }
});
export default CtxTVScreen;