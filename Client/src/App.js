import React, { useState, useContext, useEffect, Fragment } from "react";
import logo from './logo.svg';
import './App.css';
import { registerLicense } from "@syncfusion/ej2-base";
import { createSpinner } from "@syncfusion/ej2-popups";
import LoginInputs from "./LoginInputs/LoginInputs";
import CtxTVScreen from "./Interface/TV-Screen-Context";
import TVDisplayGrid from "./TVDisplay/TVDisplayGrid";
import useWindowDimensions from "./Hooks/useWindowDimensions";
import { funGetProdUnitDetails } from "./HelpFunctions/ServerCommn";

registerLicense("ORg4AjUWIQA/Gnt2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5XdExjXXpecnRXT2lV");

function App() {
  const tvScreenCtx = useContext(CtxTVScreen);
  const ctxTVScreen = useContext(CtxTVScreen);

  const { height, width } = useWindowDimensions();

  const [isLoggedIn, setIsLoggedIn] = useState(+ctxTVScreen.isLoggedIn);

  useEffect(() => {
    if (ctxTVScreen.isLoggedIn === null) setIsLoggedIn(0);
    else setIsLoggedIn(+ctxTVScreen.isLoggedIn);

    if (+ctxTVScreen.isLoggedIn && ctxTVScreen.prodUnit.length === 0) {
      // funGetProdUnitDetails(ctxTVScreen.userName, ctxTVScreen.serverIp, "PROD")
      //   .then(result => {
      //     console.log(result);
      //     if (result.result === "success") {
      //       tvScreenCtx.setProdUnit(result.prodUnit);
      //     } else {
      //       alert("Production Unit: Communication issue. Please refresh or contact Administrator")
      //     }
      //   })
      //   .catch((e) => {
      //     alert(e.message);
      //   });
    }
  }, [ctxTVScreen.isLoggedIn])

  useEffect(() => {
    // Specify the target for the spinner to show
    createSpinner({ target: document.getElementById("root"), type: 'Bootstrap' });
  }, []);

  const onExitBtn = () => {
    setIsLoggedIn(0);
    tvScreenCtx.updateUsrName({ UserName: null, isLoggedIn: "0", ServerIp: ctxTVScreen.serverIp });
  }

  return (
    <div className="App" >
      {!isLoggedIn && (
        <LoginInputs />
      )}
      {isLoggedIn ? (
        <Fragment>
          <TVDisplayGrid
            height={height}
            width={width}
            onExitBtn={onExitBtn}
          />
        </Fragment>
      ) : ""}
    </div>
  );
}

export default App;
