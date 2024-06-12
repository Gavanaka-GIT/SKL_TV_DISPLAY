import React, { useContext, useState, useEffect, useRef, Fragment } from "react";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';

import "./FactorySelectDialog.css"

const FactorySelectDialog = (props) => {
    const [visibility, setDialogVisibility] = useState(props.showDialog);
    const [selFact, setSelFact] = useState([]);
    const buttons = [
        {
            buttonModel: {
                content: 'OK',
                cssClass: 'e-flat',
                isPrimary: true,
            },
            click: () => {
                setDialogVisibility(false);
            },
        }
    ];
    function onOverlayClick() {
        setDialogVisibility(false);
    }
    function dialogClose() {
        props.exitDialog(selFact);
        setDialogVisibility(false);
    }

    const chk1Change = (val,args) => {
        let stateSelFact = selFact;
        if (args.checked) {
            stateSelFact.push({ FLOOR: props.floorList[val].FLOOR });
        } else {
            stateSelFact.pop({ FLOOR: props.floorList[val].FLOOR });
        }
        setSelFact(stateSelFact);
    }

   /* const chk2Change = (args) => {
        let stateSelFact = selFact;
        if (args.checked) {
            stateSelFact.push({ FLOOR: props.floorList[1].FLOOR });
        } else {
            stateSelFact.pop({ FLOOR: props.floorList[1].FLOOR });
        }
        setSelFact(stateSelFact);
    }

    const chk3Change = (args) => {
        let stateSelFact = selFact;
        if (args.checked) {
            stateSelFact.push({ FLOOR: props.floorList[2].FLOOR });
        } else {
            stateSelFact.pop({ FLOOR: props.floorList[2].FLOOR });
        }
        setSelFact(stateSelFact);
    }

    const chk4Change = (args) => {
        let stateSelFact = selFact;
        if (args.checked) {
            stateSelFact.push({ FLOOR: props.floorList[3].FLOOR });
        } else {
            stateSelFact.pop({ FLOOR: props.floorList[3].FLOOR });
        }
        setSelFact(stateSelFact);
    }*/

    return (
        <div id="dialog-target">
            <DialogComponent
                id="factoryId"
                width="500px"
                target="#tvDispGrid"
                close={dialogClose}
                isModal={true}
                header="Select factories for refresh cycle"
                visible={visibility}
                overlayClick={onOverlayClick}
                showCloseIcon={true}
                buttons={buttons}>
                <div className="factoryCheckBox">
                {props.floorList.map((floor, index) => (
                    <div key={index} style={{ padding: "5px" }}>
                        <CheckBoxComponent
                            id={`checkBox${index + 1}`}
                            label={floor.FLOOR}
                            change={(checked) => chk1Change(index,checked)}
                        />
                    </div>
                ))}
                </div>
            </DialogComponent>
        </div>
    );
}
export default FactorySelectDialog;