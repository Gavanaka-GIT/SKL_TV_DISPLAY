import { Fragment } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Toolbar, Resize, dataBound } from "@syncfusion/ej2-react-grids";
import { AutoCompleteComponent, DropDownListComponent } from "@syncfusion/ej2-react-dropdowns"
import { showSpinner, hideSpinner } from "@syncfusion/ej2-react-popups"
import { useState, useContext, useRef, useEffect } from "react";
import { funGetOrderSummaryStatus } from "../HelpFunctions/ServerCommn";
import { funGetPackageLineProdStatus } from "../HelpFunctions/ServerCommn";
import CtxTVScreen from "../Interface/TV-Screen-Context";
import './OrderSummary.css'
import useWindowDimensions from "../Hooks/useWindowDimensions";


let g_OrderStatus_Ref = null;
let g_OrderSummary_Ref = null;
var g_Zone = [];
let i = -1
const OrderSummary = (props) => {
    const ctxTVScreen = useContext(CtxTVScreen);

    const [tempDispData, setTempDispData] = useState([]);

    const detailList = useRef([]);

    const zoneColour = [
        "#B0BF1A", "#665D1E", "#827B60", "#4B5320", "#893BFF", "#5C3317", "#2B60DE", "#C25283", "#F75D59", "#E9AB17", "#4C787E", "#7E3517", "#1569C7", "#7BCCB5", "#3090C7", "#4863A0",
        "#2B547E", "#659EC7", "#6960EC", "#3C565B", "#1F45FC", "#342D7E", "#8A2BE2", "#B5A642", "#0909FF", "#6F2DA8", "#C32148", "#1974D2", "#FF5F1F", "#6A0DAD", "#16E2F5", "#835C3B",
        "#EE9A4D", "#E2A76F", "#AF9B60", "#8C001A", "#5F9EA0", "#C19A6B", "#78866B", "#C68E17", "#625D5D", "#F88017", "#34282C", "#36454F", "#954535", "#C34A2C", "#C11B17", "#D2691E",
        "#3F000F", "#842DCE", "#6F4E37", "#C7A317", "#E238EC", "#92C7C7", "#AB784E", "#29465B", "#804A00", "#654321", "#3B2F2F", "#254117", "#AA6C39", "#F660AB", "#31906E", "#827839",
        "#E75480", "#4B0150", "#872657", "#2B3856", "#8B8000", "#008B8B", "#006400", "#BDB76B", "#8B008B", "#556B2F", "#9932CC", "#483D8B", "#5453A6", "#36013F", "#033E3E", "#3B9C9C",
        "#123456", "#306754", "#73A16C", "#0000A5", "#614051", "#50C878", "#C8B560", "#667C26", "#86608E", "#FF00FF", "#C9BE62", "#368BC1", "#5E5A80", "#504A4B", "#5E7D7E", "#008000",
        "#6AA121", "#6CBB3C", "#307D7E", "#8E7618", "#617C58", "#D462FF", "#FF69B4", "#9CB071", "#CD5C5C", "#52595D", "#4CC552", "#8A865D", "#967BB6", "#B5651D", "#C8AD7F", "#728FCE",
        "#20B2AA", "#778899", "#7F38EC", "#43BFC7", "#FF8040", "#566D7E", "#800000", "#915F6D", "#045F5F", "#3CB371", "#7B68EE", "#D4AF37", "#3BB9FF", "#191970", "#513B1C", "#3EB489",
        "#151B54", "#78C7C7", "#806517", "#808000", "#BAB86C", "#C47451", "#FF4500", "#B048B5", "#F67280", "#E77471", "#B93B8F", "#7D0541", "#583759", "#7D0552", "#F87217", "#6C2DC7",
        "#B041FF", "#6A287E", "#810541", "#4E5180", "#D16587", "#8E35EF", "#7A5DC7", "#B3446C", "#663399", "#FF0000", "#DA70D6", "#7F5217", "#C12869", "#838996", "#C21E56", "#8B4513",
        "#BCB88A", "#786D5F", "#F4A460", "#2554C7", "#3EA99F", "#2E8B57", "#437C17", "#7F462C", "#C2B280", "#E55B3C", "#A0522D", "#488AC7", "#737CA1", "#6A5ACD", "#4682B4", "#483C32",
        "#008080", "#FF6347", "#C25A7C", "#E55451", "#728C00", "#6667AB", "#7E587E", "#F6358A", "#FC6C85", "#49413F", "#357EC7", "#966F33", "#FFAE42", "#34282C", "#B0BF1A", "#665D1E",
        "#827B60", "#4B5320", "#4863A0", "#5C3317", "#2B60DE", "#C25283", "#F75D59", "#E9AB17", "#4C787E", "#7E3517", "#1569C7", "#7BCCB5", "#3090C7", "#2B547E", "#659EC7", "#6960EC",
        "#3C565B", "#1F45FC", "#342D7E", "#B5A642", "#0909FF", "#6F2DA8", "#C32148", "#1974D2", "#FF5F1F", "#6A0DAD", "#16E2F5", "#835C3B", "#EE9A4D", "#E2A76F", "#AF9B60", "#8C001A",
        "#5F9EA0", "#C19A6B", "#78866B", "#C68E17", "#625D5D", "#F88017", "#36454F", "#954535", "#C34A2C", "#C11B17", "#D2691E", "#3F000F", "#6F4E37", "#C7A317", "#E238EC", "#92C7C7",
        "#AB784E", "#29465B", "#804A00", "#654321", "#3B2F2F", "#254117", "#AA6C39", "#F660AB", "#31906E", "#827839", "#E75480", "#4B0150", "#872657", "#2B3856", "#8B8000", "#008B8B",
        "#006400", "#BDB76B", "#556B2F", "#483D8B", "#5453A6", "#36013F", "#033E3E", "#3B9C9C", "#123456", "#306754", "#73A16C", "#0000A5", "#614051", "#50C878", "#C8B560", "#667C26",
        "#FF00FF", "#C9BE62", "#368BC1", "#5E5A80", "#504A4B", "#5E7D7E", "#008000", "#6AA121", "#6CBB3C", "#307D7E", "#8E7618", "#617C58", "#D462FF", "#FF69B4", "#9CB071", "#CD5C5C",
        "#52595D", "#4CC552", "#8A865D", "#B5651D", "#C8AD7F", "#728FCE", "#20B2AA", "#778899", "#43BFC7", "#FF8040", "#566D7E", "#800000", "#915F6D", "#045F5F", "#3CB371", "#7B68EE",
        "#D4AF37", "#3BB9FF", "#191970", "#513B1C", "#3EB489", "#151B54", "#78C7C7", "#806517", "#808000", "#BAB86C", "#C47451", "#FF4500", "#DA70D6", "#B048B5", "#F67280", "#B93B8F",
        "#7D0541", "#583759", "#7D0552", "#F87217", "#6C2DC7", "#810541", "#4E5180", "#D16587", "#B3446C", "#FF0000", "#7F5217", "#C12869", "#838996", "#E77471", "#C21E56", "#8B4513",
        "#BCB88A", "#786D5F", "#F4A460", "#2554C7", "#3EA99F", "#2E8B57", "#437C17", "#7F462C", "#E55B3C", "#C2B280", "#A0522D", "#488AC7", "#737CA1", "#6A5ACD", "#4682B4", "#483C32",
        "#008080", "#FF6347", "#C25A7C", "#E55451", "#728C00", "#6667AB", "#7E587E", "#F6358A", "#FC6C85", "#49413F", "#357EC7", "#966F33", "#FFAE42"
    ];

    useEffect(() => {
        let iono = props.iono.replaceAll("/", ",");
        showSpinner(document.getElementById("root"));
        funGetOrderSummaryStatus(iono, props.combo, props.style, ctxTVScreen.serverIp)
            .then(result => {
                console.log(result);
                if (result.result === "success") {
                    if (result.orderStatus.length > 0) {
                        let detailsList = [... new Set(result.orderStatus.map((x) => x.DETAIL))];
                        let orderStatus = [];
                        let sumOrderStatus = [];
                        let idCnt = 0;
                        let l_GridCols_ar = [];
                        let l_SumGridCols_ar = [];
                        detailsList.map((item) => {
                            orderStatus.push({
                                id: idCnt,
                                STYLEDESC: result.orderStatus[0].STYLEDESC,
                                COLOUR: result.orderStatus[0].COLOR,
                                DETAIL: item
                            });

                            detailList.current.push({ detail: item });

                            l_SumGridCols_ar.push({
                                key: item,
                                field: item,
                                headerText: item,
                                allowEditing: false,
                                width: 100,
                                type: "number"
                            })

                            if (idCnt === 0) {
                                sumOrderStatus.push({
                                    id: idCnt,
                                    STYLEDESC: result.orderStatus[0].STYLEDESC,
                                    COLOUR: result.orderStatus[0].COLOR,
                                });
                            }

                            let sizeArray = result.orderStatus.filter((szItem) => szItem.DETAIL === item);
                            sizeArray.map((szItem) => {
                                if (idCnt === 0) {
                                    l_GridCols_ar.push({
                                        key: szItem.SIZES,
                                        field: szItem.SIZES,
                                        headerText: szItem.SIZES,
                                        allowEditing: false,
                                        width: 75,
                                        type: "number"
                                    });
                                }
                                if (item === "EXCESS %") {
                                    orderStatus[idCnt][szItem.SIZES] = szItem.RATIO.toFixed(2);
                                } else {
                                    orderStatus[idCnt][szItem.SIZES] = szItem.RATIO;
                                }
                                if (szItem.SIZES === "Grand Total") {
                                    if (item === "EXCESS %") {
                                        sumOrderStatus[0][item] = szItem.RATIO.toFixed(2) + "%";
                                    }
                                    else {
                                        sumOrderStatus[0][item] = szItem.RATIO;
                                    }
                                }
                            });
                            idCnt++;
                        });
                        // console.log(orderStatus, sumOrderStatus);

                        if (g_OrderStatus_Ref !== null) {
                            g_OrderStatus_Ref.columns = g_OrderStatus_Ref.columns.slice(0, 4).concat(l_GridCols_ar);
                            g_OrderStatus_Ref.dataSource = orderStatus;
                            g_OrderStatus_Ref.refreshColumns();
                            g_OrderStatus_Ref.refresh();
                        }

                        if (g_OrderSummary_Ref !== null) {
                            g_OrderSummary_Ref.columns = g_OrderSummary_Ref.columns.slice(0, 3).concat(l_SumGridCols_ar);
                            g_OrderSummary_Ref.dataSource = sumOrderStatus;
                            g_OrderSummary_Ref.refreshColumns();
                            g_OrderSummary_Ref.refresh();
                        }
                    }
                    hideSpinner(document.getElementById("root"));
                } else {
                    hideSpinner(document.getElementById("root"));
                    console.log("Communication issue. Please refresh or contact Administrator")
                    setTempDispData([]);
                }
            })
            .catch((e) => {
                hideSpinner(document.getElementById("root"));
                console.log(e.message);
            });
    }, []);

    const toolbarOptions = [
        {
            text: "CUTTING STATUS: " + props.iono + " - " + props.style,
            align: "Center"

        },
        {
            text: "Back",
            tooltipText: "Back",
            id: "exitBtn",
            prefixIcon: "e-changes-previous",
            align: "Right"
        }

    ];

    const toolbarClickHandler = (params) => {
        //console.log(params.item.text);
        switch (params.item.id) {
            case "exitBtn": {
                props.onLogOut();
                break;
            }
        }
    }

    const rowDataBoundHandler = (args) => {

    }

    const queryCellInfoHandler = (args) => {
        // console.log(args);
        if (args.column.headerText === "Grand Total") {
            args.cell.style.fontSize = '17px'
        }
        if (args.column.headerText === "STYLEDESC") {
            // console.log(args.data);
            if (args.data.id === 0) {
                args.rowSpan = detailList.current.length;
                args.cell.style.backgroundColor = zoneColour[20];
                args.cell.style.color = "white"
            }
        } else if (args.column.headerText === "COLOUR") {
            if (args.data.id === 0) {
                args.rowSpan = detailList.current.length;
                args.cell.style.backgroundColor = zoneColour[35];
                args.cell.style.color = "white"
            }
        } else {
            let detIdx = detailList.current.findIndex((item) => item.detail === args.data.DETAIL);
            if (detIdx % 2 === 0) {
                args.cell.style.backgroundColor = zoneColour[detIdx];
                args.cell.style.color = "white"
            }
        }
    }

    return (
        <Fragment>
            <div id="packDispGrid">
                <GridComponent
                    id="packDispGrid"
                    ref={(g) => (g_OrderStatus_Ref = g)}
                    rowHeight={30}
                    allowSorting={false}
                    allowMultiSorting={false}
                    allowSelection={false}
                    allowResizing={false}
                    allowEditing={false}
                    allowKeyboard={true}
                    allowFiltering={false}
                    allowExcelExport={false}
                    allowPdfExport={false}
                    allowTextWrap={true}
                    enableHeaderFocus={true}
                    enableImmutableMode={false}
                    showColumnChooser={false}
                    toolbar={toolbarOptions}
                    toolbarClick={toolbarClickHandler}
                    gridLines="Both"
                    rowDataBound={rowDataBoundHandler}
                    queryCellInfo={queryCellInfoHandler}
                    dataSource={tempDispData}
                >
                    <ColumnsDirective>
                        <ColumnDirective
                            field="id"
                            headerText="ID"
                            visible={false}
                            lockColumn={true}
                            showInColumnChooser={false}
                            isPrimaryKey={true}
                        />
                        <ColumnDirective
                            field="STYLEDESC"
                            headerText="STYLEDESC"
                            lockColumn={true}
                            allowEditing={false}
                            width={110}
                        ></ColumnDirective>
                        <ColumnDirective
                            field="COLOUR"
                            headerText="COLOUR"
                            lockColumn={true}
                            allowEditing={false}
                            width={150}
                        ></ColumnDirective>
                        <ColumnDirective
                            field="DETAIL"
                            headerText="DETAIL"
                            lockColumn={true}
                            allowEditing={false}
                            width={150}
                        ></ColumnDirective>
                    </ColumnsDirective>
                    <Inject
                        services={[Toolbar, Resize]}
                    />
                </GridComponent>
            </div>
            <h3 style={{ color: "white" }}>TEST</h3>
            <div className="divClass">
                <div className="divNameClass">Abstract: {props.iono + " - " + props.style}  </div>
            </div>
            <div id="summaryDispGrid">
                <GridComponent
                    id="summaryDispGrid"
                    ref={(g) => (g_OrderSummary_Ref = g)}
                    rowHeight={30}
                    allowSorting={false}
                    allowMultiSorting={false}
                    allowSelection={false}
                    allowResizing={false}
                    allowEditing={false}
                    allowKeyboard={true}
                    allowFiltering={false}
                    allowExcelExport={false}
                    allowPdfExport={false}
                    allowTextWrap={true}
                    enableHeaderFocus={true}
                    enableImmutableMode={false}
                    showColumnChooser={false}
                    gridLines="Both"
                    dataSource={tempDispData}
                >
                    <ColumnsDirective>
                        <ColumnDirective
                            field="id"
                            headerText="ID"
                            visible={false}
                            lockColumn={true}
                            showInColumnChooser={false}
                            isPrimaryKey={true}
                        />
                        <ColumnDirective
                            field="STYLEDESC"
                            headerText="STYLEDESC"
                            lockColumn={true}
                            allowEditing={false}
                            width={105}
                        ></ColumnDirective>
                        <ColumnDirective
                            field="COLOUR"
                            headerText="COLOUR"
                            lockColumn={true}
                            allowEditing={false}
                            width={150}
                        ></ColumnDirective>
                    </ColumnsDirective>
                    <Inject
                        services={[Resize]}
                    />
                </GridComponent>
            </div>
        </Fragment>
    )
}

export default OrderSummary;