import React, { useRef, useContext, useState } from "react";
import { checkUserDetails } from "../HelpFunctions/ServerCommn";
import md5 from "md5";
import { DialogComponent } from '@syncfusion/ej2-react-popups'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import CtxTVScreen from "../Interface/TV-Screen-Context";

import "./LoginInputs.css";

const LoginInputs = () => {
  const tvScreenCtx = useContext(CtxTVScreen);
  const ctxTVScreen = useContext(CtxTVScreen);

  const [visibility, setDialogVisibility] = useState(true);

  const userNameRef = useRef(null);
  const pwdRef = useRef(null);
  const serverNameRef = useRef(null);

  let buttons = [
    {
      buttonModel: {
        content: 'Cancel',
        cssClass: 'e-flat'
      },
      'click': () => {
        setDialogVisibility(false);
      }
    },
    {
      buttonModel: {
        content: 'Login',
        cssClass: 'e-flat',
        isPrimary: true,
      },
      'click': () => {
        const l_EnteredUsrName_str = userNameRef.current.properties.value !== null ? userNameRef.current.properties.value.trim() : "";
        const l_EnteredPwd_str = pwdRef.current.properties.value !== null ? pwdRef.current.properties.value.trim() : "";
        const l_EnterServerName = serverNameRef.current.properties.value !== null ? serverNameRef.current.properties.value.trim() : "";

        if (tvScreenCtx.userDetails === null) {
          if (l_EnterServerName.length) {
            tvScreenCtx.updateUsrName({ UserName: null, isLoggedIn: "0", ServerIp: l_EnterServerName });
          }
          return;
        }

        if (l_EnteredUsrName_str.length === 0 || l_EnteredPwd_str.length === 0) {
          if (l_EnterServerName.length) {
            tvScreenCtx.updateUsrName({ UserName: null, isLoggedIn: "0", ServerIp: l_EnterServerName });
          }
          return;
        } else {
          let userDet = { userName: l_EnteredUsrName_str, pwd: md5(l_EnteredPwd_str) };
          checkUserDetails(l_EnterServerName, userDet)
            .then(result => {
              //console.log(result);
              if (result.result === "success") {
                tvScreenCtx.updateUsrName({ UserName: l_EnteredUsrName_str, isLoggedIn: "1", ServerIp: l_EnterServerName, });
                tvScreenCtx.setProdUnit(result.prodUnit);
                setDialogVisibility(false);
              } else {
                alert("Please check the user name or password...")
                if (l_EnterServerName.trim().length) {
                  tvScreenCtx.updateUsrName({ UserName: null, isLoggedIn: "0", ServerIp: l_EnterServerName, });
                }
              }
            })
            .catch((e) => {
              alert(e.message);
            });
        }
      }
    }
  ];

  return (
    <div>
      <DialogComponent
        width={500}
        height={350}
        header="Login"
        isModal={true}
        visible={visibility}
        buttons={buttons}
      >
        <div className="loginTextBox">
          <p>
            <TextBoxComponent
              ref={userNameRef}
              name="name"
              placeholder="Login Name"
              floatLabelType="Auto"
              data-msg-containerid="errroForName"
            />
          </p>
          <p>
            <TextBoxComponent
              ref={pwdRef}
              name="pwd"
              type="password"
              placeholder="Password"
              floatLabelType="Auto"
              data-msg-containerid="errroForName"
            />
          </p>
          <p>
            <TextBoxComponent
              ref={serverNameRef}
              name="serverID"
              value={ctxTVScreen.serverIp}
              placeholder="Server Details"
              floatLabelType="Auto"
              data-msg-containerid="errroForName"
            />
          </p>
        </div>
      </DialogComponent>
    </div>
  );
};

export default LoginInputs;