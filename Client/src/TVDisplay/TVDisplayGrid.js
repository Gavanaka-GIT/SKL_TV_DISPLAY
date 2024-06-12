import React, { useContext, useState, useEffect, useRef, Fragment } from "react";
import moment from "moment";
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Toolbar, Resize, dataBound } from "@syncfusion/ej2-react-grids";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns"
import CtxTVScreen from "../Interface/TV-Screen-Context";
import { funGetLineProdStatus, getFloorDetails } from "../HelpFunctions/ServerCommn";
import { extendArray } from "@syncfusion/ej2-react-treegrid"
import useWindowDimensions from "../Hooks/useWindowDimensions";
import { showSpinner, hideSpinner, createSpinner } from "@syncfusion/ej2-react-popups"
import ReportSidebar from "../Report/ReportSidebar";

import "./TVDisplayGrid.css";
import OrderSummary from "./OrderSummary";
import FactorySelectDialog from "./FactorySelectDialog";

var refreshTimer = null;
var g_TVDispGrid_Ref = null;
var g_GridColumns = [];

const TVDisplayGrid = (props) => {
  const tvScreenCtx = useContext(CtxTVScreen);

  const { width } = useWindowDimensions();

  /*const floorList = [
    { floorText: "HO - FLOOR1", FLOOR: "FLOOR1" },
    { floorText: "HO - FLOOR2", FLOOR: "FLOOR2" },
    { floorText: "Unit 2", FLOOR: "Unit2" },
    { floorText: "Unit 3", FLOOR: "Unit3" },
    { floorText: "ALL", FLOOR: "ALL" }
  ]; */ 

  const [floorList, setFloorList] = useState([])
  const selFact_Ref = useRef(floorList.slice(0,-1));
  // selFact_Ref.current=floorList.slice(0,-1)

  useEffect(()=>{
   getFloorDetails(tvScreenCtx.serverIp).then((result)=>{
   // console.log(result.floor)
    setFloorList(result.floor);
    selFact_Ref.current=result.floor.slice(0,-1);
   // console.log(floorList[0].FLOOR)
   }).catch((e)=>{
    console.log("floor Error "+ e.message);
   })
  },[])

  useEffect(()=>{
    selFact_Ref.current=floorList.slice(0,-1)
  },[floorList])

  const [tvDispData, setTVDispData] = useState([]);
  const [selFloor, setSelFloor] = useState("FLOOR1");
  const [formattedDate, setFormattedDate] = useState('')
  const [selAllFloor, setSelAllFloor] = useState('FLOOR1')
  const [tbSelFloor, setTBSelFloor] = useState('FLOOR1')
  const [achieved, setAchieved] = useState('')
  const [avgEff, setAvgEff] = useState('')
  const [isReportsSidebar, setIsReportsSidebar] = useState(false);
  const [factory, setFactory] = useState(true)
  const [zone, setZone] = useState(false)
  const [selStyle, setSelStyle] = useState(null);
  const [selIONO, setSelIONO] = useState(null);
  const [selColour, setSelColour] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const selFloorRef = useRef(selFloor);
  const targetHrRef = useRef({});
  const targetCntRef = useRef({});
  const rowSpanCntRef = useRef({});
  const lineListAr_Ref = useRef([]);
  const colSpanAr_Ref = useRef([]);
  const colSpan1Ar_Ref = useRef([]);
  const colSpan2Ar_Ref = useRef([]);
  const tvDispDataDB_Ref = useRef([]);
  /*const selFact_Ref = useRef([
    { FLOOR: "FLOOR1" },
    { FLOOR: "FLOOR2" },
    { FLOOR: "Unit2" },
    { FLOOR: "Unit3" }
  ]);*/

  useEffect(() => {
    createSpinner({ target: document.getElementById("tvDispGrid"), type: 'Bootstrap' });

    setFormattedDate(moment().format("DD/MM/yyyy hh:mmA"));

    const val = setInterval(() => {
      // console.log("Timer Interval is ticking");
      setFormattedDate(moment().format("DD/MM/yyyy hh:mmA"));
    }, 60000) //60s * 1000ms = 60000

    return (() => {
      clearInterval(val);
    })
  }, [])

  useEffect(() => {
    if (g_TVDispGrid_Ref !== null) g_TVDispGrid_Ref.refresh();
  }, [tvDispData]);

  const refreshTimerHandler = () => {
    // console.log("Refresh Timer Interval is ticking");
    // g_TVDispGrid_Ref.showSpinner();
    if (selAllFloor === "ALL") {
      let flooridx = selFact_Ref.current.findIndex((item) => (item.FLOOR === selFloorRef.current));
      console.log(flooridx, selFloorRef.current, selFact_Ref.current.length);
      if (flooridx === (selFact_Ref.current.length - 1)) selFloorRef.current = selFact_Ref.current[0].FLOOR
      else selFloorRef.current = selFact_Ref.current[flooridx + 1].FLOOR
    }
    funGetLineProdStatus(selFloorRef.current, tvScreenCtx.serverIp)
      .then(result => {
        console.log(moment().toDate());
        // console.log(result);
        if (result.result === "success") {
          setTBSelFloor(selFloorRef.current);
          // console.log(result.prodStatus);
          let stateTVDispData = [
            { id: 0, line: "MP" },
            { id: 1, line: "WAGES" },
            { id: 2, line: "STYLENO" },
            { id: 3, line: "COLOUR" },
            { id: 4, line: "D.TARGET" },
            { id: 5, line: "TGT HR" },
            { id: 6, line: "C.TARGET" },
            { id: 7, line: "H1" },
            { id: 8, line: "H2" },
            { id: 9, line: "H3" },
            { id: 10, line: "H4" },
            { id: 11, line: "H5" },
            { id: 12, line: "H6" },
            { id: 13, line: "H7" },
            { id: 14, line: "H8" },
            { id: 15, line: "H9" },
            { id: 16, line: "H10" },
            { id: 17, line: "TOTAL" },
            { id: 18, line: "SLIDE" },
            { id: 19, line: "PCSCOST" }
          ];
          let l_GridCols_ar = [];
          lineListAr_Ref.current = [];
          colSpanAr_Ref.current = [];
          colSpan1Ar_Ref.current = [];
          colSpan2Ar_Ref.current = [];
          let l_PcsCost_ar = [];
          let l_prevLine = null;
          targetHrRef.current = {};
          targetCntRef.current = {};
          let l_HrTot_ar = {
            EMP: 0,
            AMT: 0,
            DTGT: 0,
            TGTHR: 0,
            CTGTHR: 0,
            H1: 0,
            H2: 0,
            H3: 0,
            H4: 0,
            H5: 0,
            H6: 0,
            H7: 0,
            H8: 0,
            H9: 0,
            H10: 0,
            TOTAL: 0,
            SLIDE: 0
          };
          result.prodStatus.map((item) => {
            l_GridCols_ar.push({
              key: item.LN,
              field: item.LN + item.COMBO + item.STYLENO,
              headerText: item.LN,
              allowEditing: false,
              width: 100,
              type: "number"
            });
            stateTVDispData[0][item.LN + item.COMBO + item.STYLENO] = item.EMP;
            stateTVDispData[1][item.LN + item.COMBO + item.STYLENO] = item.AMT;
            stateTVDispData[2][item.LN + item.COMBO + item.STYLENO] = item.STYLENO;
            stateTVDispData[3][item.LN + item.COMBO + item.STYLENO] = item.COMBO;
            stateTVDispData[4][item.LN + item.COMBO + item.STYLENO] = item.TARGET;
            stateTVDispData[5][item.LN + item.COMBO + item.STYLENO] = item.TPERHR;
            stateTVDispData[6][item.LN + item.COMBO + item.STYLENO] = item.CTARGET;
            stateTVDispData[7][item.LN + item.COMBO + item.STYLENO] = item.H1;
            stateTVDispData[8][item.LN + item.COMBO + item.STYLENO] = item.H2;
            stateTVDispData[9][item.LN + item.COMBO + item.STYLENO] = item.H3;
            stateTVDispData[10][item.LN + item.COMBO + item.STYLENO] = item.H4;
            stateTVDispData[11][item.LN + item.COMBO + item.STYLENO] = item.H5;
            stateTVDispData[12][item.LN + item.COMBO + item.STYLENO] = item.H6;
            stateTVDispData[13][item.LN + item.COMBO + item.STYLENO] = item.H7;
            stateTVDispData[14][item.LN + item.COMBO + item.STYLENO] = item.H8;
            stateTVDispData[15][item.LN + item.COMBO + item.STYLENO] = item.H9;
            stateTVDispData[16][item.LN + item.COMBO + item.STYLENO] = item.H10;
            stateTVDispData[17][item.LN + item.COMBO + item.STYLENO] = item.HTOT;
            stateTVDispData[18][item.LN + item.COMBO + item.STYLENO] = 0 - item.SLIDE;
            stateTVDispData[19][item.LN + item.COMBO + item.STYLENO] = null

            if (l_prevLine === null || l_prevLine !== item.LN) {
              if (item.AMT !== null && item.HTOT > 0) {
                l_PcsCost_ar.push({
                  line: item.LN, wages: +(item.AMT / item.HTOT).toFixed(2), hrTot: item.HTOT
                });
              } else {
                l_PcsCost_ar.push({
                  line: item.LN, wages: 0, hrTot: item.HTOT
                });
              }
              if (item.EMP !== null) l_HrTot_ar.EMP = l_HrTot_ar.EMP + item.EMP;
              if (item.AMT !== null) l_HrTot_ar.AMT = l_HrTot_ar.AMT + item.AMT;
              l_prevLine = item.LN;
            } else {
              let lineIdx = l_PcsCost_ar.findIndex((lineItem) => lineItem.line === item.LN);
              l_PcsCost_ar[lineIdx].hrTot = l_PcsCost_ar[lineIdx].hrTot + item.HTOT;
              if (item.AMT !== null && l_PcsCost_ar[lineIdx].hrTot > 0) {
                l_PcsCost_ar[lineIdx].wages = +(item.AMT / l_PcsCost_ar[lineIdx].hrTot).toFixed(2);
              }
              l_prevLine = item.LN;
            }

            if (lineListAr_Ref.current.length === 0) {
              lineListAr_Ref.current.push({ line: item.LN });
            } else if (lineListAr_Ref.current.findIndex((item) => item.line === item.LN) === -1) {
              lineListAr_Ref.current.push({ line: item.LN });
            }
            targetHrRef.current[item.LN + item.COMBO + item.STYLENO] = item.TPERHR;
            targetCntRef.current[item.LN + item.COMBO + item.STYLENO] = item.CTARGET;
            if (item.CTARGET !== null) {
              if (targetCntRef.current["hrTot"] === undefined) {
                targetCntRef.current["hrTot"] = l_HrTot_ar.CTARGET;
              } else {
                targetCntRef.current["hrTot"] = targetCntRef.current["hrTot"] + l_HrTot_ar.CTARGET;
              }
            } else {
              targetCntRef.current["hrTot"] = 0;
            }

            if (item.TARGET !== null) l_HrTot_ar.DTGT = l_HrTot_ar.DTGT + item.TARGET;
            if (item.TPERHR !== null) l_HrTot_ar.TGTHR = l_HrTot_ar.TGTHR + item.TPERHR;
            if (item.CTARGET !== null) l_HrTot_ar.CTGTHR = l_HrTot_ar.CTGTHR + item.CTARGET;
            if (item.H1 !== null) l_HrTot_ar.H1 = l_HrTot_ar.H1 + item.H1;
            if (item.H2 !== null) l_HrTot_ar.H2 = l_HrTot_ar.H2 + item.H2;
            if (item.H3 !== null) l_HrTot_ar.H3 = l_HrTot_ar.H3 + item.H3;
            if (item.H4 !== null) l_HrTot_ar.H4 = l_HrTot_ar.H4 + item.H4;
            if (item.H5 !== null) l_HrTot_ar.H5 = l_HrTot_ar.H5 + item.H5;
            if (item.H6 !== null) l_HrTot_ar.H6 = l_HrTot_ar.H6 + item.H6;
            if (item.H7 !== null) l_HrTot_ar.H7 = l_HrTot_ar.H7 + item.H7;
            if (item.H8 !== null) l_HrTot_ar.H8 = l_HrTot_ar.H8 + item.H8;
            if (item.H9 !== null) l_HrTot_ar.H9 = l_HrTot_ar.H9 + item.H9;
            if (item.H10 !== null) l_HrTot_ar.H10 = l_HrTot_ar.H10 + item.H10;
            if (item.HTOT !== null) l_HrTot_ar.TOTAL = l_HrTot_ar.TOTAL + item.HTOT;
            if (item.SLIDE !== null) l_HrTot_ar.SLIDE = l_HrTot_ar.SLIDE + (0 - item.SLIDE);
          });

          result.prodStatus.map((item) => {
            let lineIdx = l_PcsCost_ar.findIndex((lineItem) => lineItem.line === item.LN);
            stateTVDispData[19][item.LN + item.COMBO + item.STYLENO] = l_PcsCost_ar[lineIdx].wages;
          });

          l_GridCols_ar.push({
            key: "tot" + l_GridCols_ar.length,
            field: "hrTot",
            headerText: "TOT",
            allowEditing: false,
            width: 100,
            type: "number"
          });

          targetHrRef.current.TOT = l_HrTot_ar.TGTHR;
          targetCntRef.current.TOT = l_HrTot_ar.CTGTHR;

          stateTVDispData[0].hrTot = l_HrTot_ar.EMP;
          stateTVDispData[1].hrTot = l_HrTot_ar.AMT;
          stateTVDispData[4].hrTot = l_HrTot_ar.DTGT;
          stateTVDispData[5].hrTot = l_HrTot_ar.TGTHR;
          stateTVDispData[6].hrTot = l_HrTot_ar.CTGTHR;
          stateTVDispData[7].hrTot = l_HrTot_ar.H1;
          stateTVDispData[8].hrTot = l_HrTot_ar.H2;
          stateTVDispData[9].hrTot = l_HrTot_ar.H3;
          stateTVDispData[10].hrTot = l_HrTot_ar.H4;
          stateTVDispData[11].hrTot = l_HrTot_ar.H5;
          stateTVDispData[12].hrTot = l_HrTot_ar.H6;
          stateTVDispData[13].hrTot = l_HrTot_ar.H7;
          stateTVDispData[14].hrTot = l_HrTot_ar.H8;
          stateTVDispData[15].hrTot = l_HrTot_ar.H9;
          stateTVDispData[16].hrTot = l_HrTot_ar.H10;
          stateTVDispData[17].hrTot = l_HrTot_ar.TOTAL;
          stateTVDispData[18].hrTot = l_HrTot_ar.SLIDE;
          if (l_HrTot_ar.TOTAL > 0)
            stateTVDispData[19].hrTot = +(l_HrTot_ar.AMT / l_HrTot_ar.TOTAL).toFixed(2);
          else
            stateTVDispData[19].hrTot = 0;

          // console.log(targetHrRef);
          lineListAr_Ref.current.map((item) => {
            let l_rowSpanCnt = result.prodStatus.filter((items) => (items.LN) === item.line).length;
            rowSpanCntRef.current[item.line] = l_rowSpanCnt;
          });
          // console.log(rowSpanCntRef);

          // console.log(g_TVDispGrid_Ref.columns);
          if (g_TVDispGrid_Ref !== null) {
            g_TVDispGrid_Ref.columns = g_TVDispGrid_Ref.columns.slice(0, 2).concat(l_GridCols_ar);
            g_TVDispGrid_Ref.dataSource = stateTVDispData;
            g_TVDispGrid_Ref.refreshColumns();
            g_TVDispGrid_Ref.refresh();
            g_GridColumns = extendArray(l_GridCols_ar);

            // console.log(stateTVDispData);
            setTVDispData(stateTVDispData);
            tvDispDataDB_Ref.current = result.prodStatus;
          }
        } else {
          console.log("Communication issue. Please refresh or contact Administrator");
          setTVDispData([]);
          tvDispDataDB_Ref.current = [];
        }
        // g_TVDispGrid_Ref.hideSpinner();
      })
      .catch((e) => {
        console.log(e.message);
        // g_TVDispGrid_Ref.hideSpinner();
      });
  }

  useEffect(() => {
    if (selAllFloor !== null) {
      // console.log(selFloor);
      // g_TVDispGrid_Ref.showSpinner();
      showSpinner(document.getElementById("tvDispGrid"));
      funGetLineProdStatus(selFloorRef.current, tvScreenCtx.serverIp)
        .then(result => {
          console.log(moment().toDate());
          //console.log(result);
          //console.log("working")
          if (result.result === "success") {
            // console.log(result.prodStatus);
            let stateTVDispData = [
              { id: 0, line: "MP" },
              { id: 1, line: "WAGES" },
              { id: 2, line: "STYLENO" },
              { id: 3, line: "COLOUR" },
              { id: 4, line: "D.TARGET" },
              { id: 5, line: "TGT HR" },
              { id: 6, line: "C.TARGET" },
              { id: 7, line: "H1" },
              { id: 8, line: "H2" },
              { id: 9, line: "H3" },
              { id: 10, line: "H4" },
              { id: 11, line: "H5" },
              { id: 12, line: "H6" },
              { id: 13, line: "H7" },
              { id: 14, line: "H8" },
              { id: 15, line: "H9" },
              { id: 16, line: "H10" },
              { id: 17, line: "TOTAL" },
              { id: 18, line: "SLIDE" },
              { id: 19, line: "PCSCOST" }
            ];
            let l_GridCols_ar = [];
            lineListAr_Ref.current = [];
            colSpanAr_Ref.current = [];
            colSpan1Ar_Ref.current = [];
            colSpan2Ar_Ref.current = [];
            let l_PcsCost_ar = [];
            let l_prevLine = null;
            let l_HrTot_ar = {
              EMP: 0,
              AMT: 0,
              DTGT: 0,
              TGTHR: 0,
              CTGTHR: 0,
              H1: 0,
              H2: 0,
              H3: 0,
              H4: 0,
              H5: 0,
              H6: 0,
              H7: 0,
              H8: 0,
              H9: 0,
              H10: 0,
              TOTAL: 0,
              SLIDE: 0
            };
            targetHrRef.current = {};
            targetCntRef.current = {};
            result.prodStatus.map((item) => {
              l_GridCols_ar.push({
                key: item.LN,
                field: item.LN + item.COMBO + item.STYLENO,
                headerText: item.LN,
                allowEditing: false,
                width: 100,
                type: "number"
              });
              stateTVDispData[0][item.LN + item.COMBO + item.STYLENO] = item.EMP;
              stateTVDispData[1][item.LN + item.COMBO + item.STYLENO] = item.AMT;
              stateTVDispData[2][item.LN + item.COMBO + item.STYLENO] = item.STYLENO;
              stateTVDispData[3][item.LN + item.COMBO + item.STYLENO] = item.COMBO;
              stateTVDispData[4][item.LN + item.COMBO + item.STYLENO] = item.TARGET;
              stateTVDispData[5][item.LN + item.COMBO + item.STYLENO] = item.TPERHR;
              stateTVDispData[6][item.LN + item.COMBO + item.STYLENO] = item.CTARGET;
              stateTVDispData[7][item.LN + item.COMBO + item.STYLENO] = item.H1;
              stateTVDispData[8][item.LN + item.COMBO + item.STYLENO] = item.H2;
              stateTVDispData[9][item.LN + item.COMBO + item.STYLENO] = item.H3;
              stateTVDispData[10][item.LN + item.COMBO + item.STYLENO] = item.H4;
              stateTVDispData[11][item.LN + item.COMBO + item.STYLENO] = item.H5;
              stateTVDispData[12][item.LN + item.COMBO + item.STYLENO] = item.H6;
              stateTVDispData[13][item.LN + item.COMBO + item.STYLENO] = item.H7;
              stateTVDispData[14][item.LN + item.COMBO + item.STYLENO] = item.H8;
              stateTVDispData[15][item.LN + item.COMBO + item.STYLENO] = item.H9;
              stateTVDispData[16][item.LN + item.COMBO + item.STYLENO] = item.H10;
              stateTVDispData[17][item.LN + item.COMBO + item.STYLENO] = item.HTOT;
              stateTVDispData[18][item.LN + item.COMBO + item.STYLENO] = 0 - item.SLIDE;
              stateTVDispData[19][item.LN + item.COMBO + item.STYLENO] = null;

              if (l_prevLine === null || l_prevLine !== item.LN) {
                if (item.AMT !== null && item.HTOT > 0) {
                  l_PcsCost_ar.push({
                    line: item.LN, wages: +(item.AMT / item.HTOT).toFixed(2), hrTot: item.HTOT
                  });
                } else {
                  l_PcsCost_ar.push({
                    line: item.LN, wages: 0, hrTot: item.HTOT
                  });
                }
                if (item.EMP !== null) l_HrTot_ar.EMP = l_HrTot_ar.EMP + item.EMP;
                if (item.AMT !== null) l_HrTot_ar.AMT = l_HrTot_ar.AMT + item.AMT;
                l_prevLine = item.LN;
              } else {
                let lineIdx = l_PcsCost_ar.findIndex((lineItem) => lineItem.line === item.LN);
                l_PcsCost_ar[lineIdx].hrTot = l_PcsCost_ar[lineIdx].hrTot + item.HTOT;
                if (item.AMT !== null && l_PcsCost_ar[lineIdx].hrTot > 0) {
                  l_PcsCost_ar[lineIdx].wages = +(item.AMT / l_PcsCost_ar[lineIdx].hrTot).toFixed(2);
                }
                l_prevLine = item.LN;
              }

              if (lineListAr_Ref.current.length === 0) {
                lineListAr_Ref.current.push({ line: item.LN });
              } else if (lineListAr_Ref.current.findIndex((item) => item.line === item.LN) === -1) {
                lineListAr_Ref.current.push({ line: item.LN });
              }
              targetHrRef.current[item.LN + item.COMBO + item.STYLENO] = item.TPERHR;
              targetCntRef.current[item.LN + item.COMBO + item.STYLENO] = item.CTARGET;
              if (item.CTARGET !== null) {
                if (targetCntRef.current["hrTot"] === undefined) {
                  targetCntRef.current["hrTot"] = l_HrTot_ar.CTARGET;
                } else {
                  targetCntRef.current["hrTot"] = targetCntRef.current["hrTot"] + l_HrTot_ar.CTARGET;
                }
              } else {
                targetCntRef.current["hrTot"] = 0;
              }

              if (item.TARGET !== null) l_HrTot_ar.DTGT = l_HrTot_ar.DTGT + item.TARGET;
              if (item.TPERHR !== null) l_HrTot_ar.TGTHR = l_HrTot_ar.TGTHR + item.TPERHR;
              if (item.CTARGET !== null) l_HrTot_ar.CTGTHR = l_HrTot_ar.CTGTHR + item.CTARGET;
              if (item.H1 !== null) l_HrTot_ar.H1 = l_HrTot_ar.H1 + item.H1;
              if (item.H2 !== null) l_HrTot_ar.H2 = l_HrTot_ar.H2 + item.H2;
              if (item.H3 !== null) l_HrTot_ar.H3 = l_HrTot_ar.H3 + item.H3;
              if (item.H4 !== null) l_HrTot_ar.H4 = l_HrTot_ar.H4 + item.H4;
              if (item.H5 !== null) l_HrTot_ar.H5 = l_HrTot_ar.H5 + item.H5;
              if (item.H6 !== null) l_HrTot_ar.H6 = l_HrTot_ar.H6 + item.H6;
              if (item.H7 !== null) l_HrTot_ar.H7 = l_HrTot_ar.H7 + item.H7;
              if (item.H8 !== null) l_HrTot_ar.H8 = l_HrTot_ar.H8 + item.H8;
              if (item.H9 !== null) l_HrTot_ar.H9 = l_HrTot_ar.H9 + item.H9;
              if (item.H10 !== null) l_HrTot_ar.H10 = l_HrTot_ar.H10 + item.H10;
              if (item.HTOT !== null) l_HrTot_ar.TOTAL = l_HrTot_ar.TOTAL + item.HTOT;
              if (item.SLIDE !== null) l_HrTot_ar.SLIDE = l_HrTot_ar.SLIDE + (0 - item.SLIDE);
            });

            result.prodStatus.map((item) => {
              let lineIdx = l_PcsCost_ar.findIndex((lineItem) => lineItem.line === item.LN);
              stateTVDispData[19][item.LN + item.COMBO + item.STYLENO] = l_PcsCost_ar[lineIdx].wages;
            });

            l_GridCols_ar.push({
              key: "tot" + l_GridCols_ar.length,
              field: "hrTot",
              headerText: "TOT",
              allowEditing: false,
              width: 100,
              type: "number"
            });

            targetHrRef.current.TOT = l_HrTot_ar.TGTHR;
            targetCntRef.current.TOT = l_HrTot_ar.CTGTHR;

            stateTVDispData[0].hrTot = l_HrTot_ar.EMP;
            stateTVDispData[1].hrTot = l_HrTot_ar.AMT;
            stateTVDispData[4].hrTot = l_HrTot_ar.DTGT;
            stateTVDispData[5].hrTot = l_HrTot_ar.TGTHR;
            stateTVDispData[6].hrTot = l_HrTot_ar.CTGTHR;
            stateTVDispData[7].hrTot = l_HrTot_ar.H1;
            stateTVDispData[8].hrTot = l_HrTot_ar.H2;
            stateTVDispData[9].hrTot = l_HrTot_ar.H3;
            stateTVDispData[10].hrTot = l_HrTot_ar.H4;
            stateTVDispData[11].hrTot = l_HrTot_ar.H5;
            stateTVDispData[12].hrTot = l_HrTot_ar.H6;
            stateTVDispData[13].hrTot = l_HrTot_ar.H7;
            stateTVDispData[14].hrTot = l_HrTot_ar.H8;
            stateTVDispData[15].hrTot = l_HrTot_ar.H9;
            stateTVDispData[16].hrTot = l_HrTot_ar.H10;
            stateTVDispData[17].hrTot = l_HrTot_ar.TOTAL;
            stateTVDispData[18].hrTot = l_HrTot_ar.SLIDE;
            if (l_HrTot_ar.TOTAL > 0)
              stateTVDispData[19].hrTot = +(l_HrTot_ar.AMT / l_HrTot_ar.TOTAL).toFixed(2);
            else
              stateTVDispData[19].hrTot = 0;

            // console.log(targetHrRef);
            lineListAr_Ref.current.map((item) => {
              let l_rowSpanCnt = result.prodStatus.filter((items) => (items.LN) === item.line).length;
              rowSpanCntRef.current[item.line] = l_rowSpanCnt;
            });
            // console.log(rowSpanCntRef);

            if (g_TVDispGrid_Ref !== null) {
              // console.log(g_TVDispGrid_Ref.columns);
              g_TVDispGrid_Ref.columns = g_TVDispGrid_Ref.columns.slice(0, 2).concat(l_GridCols_ar);
              g_TVDispGrid_Ref.dataSource = stateTVDispData;
              g_TVDispGrid_Ref.refreshColumns();
              g_TVDispGrid_Ref.refresh();
              g_GridColumns = extendArray(l_GridCols_ar);

              // console.log(stateTVDispData);
              setTVDispData(stateTVDispData);
              // console.log(result.prodStatus);
              tvDispDataDB_Ref.current = result.prodStatus;
            }
          } else {
            console.log("Communication issue. Please refresh or contact Administrator");
            setTVDispData([]);
            tvDispDataDB_Ref.current = [];
          }
          // g_TVDispGrid_Ref.hideSpinner();
          hideSpinner(document.getElementById("tvDispGrid"));
        })
        .catch((e) => {
          console.log(e.message);
          hideSpinner(document.getElementById("tvDispGrid"));
          // g_TVDispGrid_Ref.hideSpinner();
        });

      if (refreshTimer !== null) clearInterval(refreshTimer);
      refreshTimer = setInterval(refreshTimerHandler, 60000);
    }
  }, [selAllFloor]);

  const dropDownProdUnitList = () => {
    function onChangeHandler(args) {
      if (args.value === "ALL") {
        setSelAllFloor(args.value)
        setSelFloor(selFact_Ref.current[0].FLOOR);
        setTBSelFloor(selFact_Ref.current[0].FLOOR);
        selFloorRef.current = selFact_Ref.current[0].FLOOR;
      } else {
        setSelAllFloor(args.value)
        setSelFloor(args.value);
        setTBSelFloor(args.value);
        selFloorRef.current = args.value;
      }

      let l_Temp_ar = [];
      g_TVDispGrid_Ref.columns = g_TVDispGrid_Ref.columns.slice(0, 2);
      g_TVDispGrid_Ref.dataSource = l_Temp_ar;
      g_TVDispGrid_Ref.refreshColumns();
      g_TVDispGrid_Ref.refresh();
      setTVDispData(l_Temp_ar);
      tvDispDataDB_Ref.current = l_Temp_ar;
    }

    return (
      <DropDownListComponent
        id="dropdown"
        width={175}
        dataSource={floorList}
        placeholder="Select Floor Name"
        fields={{ text: 'FLOOR', value: 'FLOOR' }}
        change={onChangeHandler}
        value={selAllFloor}
      />);
  }

  const toolbarOptions = [
    { template: dropDownProdUnitList },
    {
      text: tbSelFloor + " - Production Status",
      align: "Center"

    },
    {
      text: "Config",
      tooltipText: "Select Factories",
      id: "configBtn",
      prefixIcon: "e-settings",
      align: "Right"
    },
    {
      text: "Logout",
      tooltipText: "Logout",
      id: "exitBtn",
      prefixIcon: "e-changes-previous",
      align: "Right"
    }
  ];

  const toolbarClickHandler = (params) => {
    //console.log(params.item.text);
    switch (params.item.id) {
      case "configBtn": {
        setShowDialog(true);
        break;
      }

      case "exitBtn": {
        if (refreshTimer !== null) clearInterval(refreshTimer);
        props.onExitBtn();
        break;
      }
    }
  }

  const rowDataBoundHandler = (args) => {
    // console.log(args);
    // if (g_TVDispGrid_Ref) {
    //   g_TVDispGrid_Ref.autoFitColumns(['OPERNAME', 'OPER']);
    // }
  }

  const queryCellInfoHandler = (args) => {
    // console.log(args.column.field, args.data.line, args.data[args.column.field]);
    // console.log(args);

    if (args.data.line === "H1" && args.column.field !== "line") {
      if (args.column.field !== "hrTot") {
        if (args.data[args.column.field] >= targetHrRef.current[args.column.field]) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      } else {
        if (args.data[args.column.field] === 0 || args.data[args.column.field] >= targetHrRef.current.TOT) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      }
    }

    if (args.data.line === "H2" && args.column.field !== "line") {
      if (args.column.field !== "hrTot") {
        if (args.data[args.column.field] >= targetHrRef.current[args.column.field]) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      } else {
        if (args.data[args.column.field] === 0 || args.data[args.column.field] >= targetHrRef.current.TOT) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      }
    }

    if (args.data.line === "H3" && args.column.field !== "line") {
      if (args.column.field !== "hrTot") {
        if (args.data[args.column.field] >= targetHrRef.current[args.column.field]) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      } else {
        if (args.data[args.column.field] === 0 || args.data[args.column.field] >= targetHrRef.current.TOT) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      }
    }

    if (args.data.line === "H4" && args.column.field !== "line") {
      if (args.column.field !== "hrTot") {
        if (args.data[args.column.field] >= targetHrRef.current[args.column.field]) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      } else {
        if (args.data[args.column.field] === 0 || args.data[args.column.field] >= targetHrRef.current.TOT) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      }
    }

    if (args.data.line === "H5" && args.column.field !== "line") {
      if (args.column.field !== "hrTot") {
        if (args.data[args.column.field] >= targetHrRef.current[args.column.field]) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      } else {
        if (args.data[args.column.field] === 0 || args.data[args.column.field] >= targetHrRef.current.TOT) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      }
    }

    if (args.data.line === "H6" && args.column.field !== "line") {
      if (args.column.field !== "hrTot") {
        if (args.data[args.column.field] >= targetHrRef.current[args.column.field]) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      } else {
        if (args.data[args.column.field] === 0 || args.data[args.column.field] >= targetHrRef.current.TOT) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      }
    }

    if (args.data.line === "H7" && args.column.field !== "line") {
      if (args.column.field !== "hrTot") {
        if (args.data[args.column.field] >= targetHrRef.current[args.column.field]) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      } else {
        if (args.data[args.column.field] === 0 || args.data[args.column.field] >= targetHrRef.current.TOT) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      }
    }

    if (args.data.line === "H8" && args.column.field !== "line") {
      if (args.column.field !== "hrTot") {
        if (args.data[args.column.field] >= targetHrRef.current[args.column.field]) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      } else {
        if (args.data[args.column.field] === 0 || args.data[args.column.field] >= targetHrRef.current.TOT) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      }
    }

    if (args.data.line === "H9" && args.column.field !== "line") {
      if (args.column.field !== "hrTot") {
        if (args.data[args.column.field] >= targetHrRef.current[args.column.field]) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      } else {
        if (args.data[args.column.field] === 0 || args.data[args.column.field] >= targetHrRef.current.TOT) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      }
    }

    if (args.data.line === "H10" && args.column.field !== "line") {
      if (args.column.field !== "hrTot") {
        if (args.data[args.column.field] >= targetHrRef.current[args.column.field]) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      } else {
        if (args.data[args.column.field] === 0 || args.data[args.column.field] >= targetHrRef.current.TOT) {
          args.cell.style.color = "green"
        } else {
          args.cell.style.color = "red"
        }
      }
    }

    if (args.data.line === "TOTAL" && args.column.field !== "line") {
      if (args.column.field !== "hrTot") {
        if (args.data[args.column.field] >= targetCntRef.current[args.column.field]) {
          args.cell.style.backgroundColor = "lightgreen"
        } else {
          args.cell.style.backgroundColor = "red"
          args.cell.style.color = "white"
        }
      } else {
        if (args.data[args.column.field] >= targetCntRef.current.TOT) {
          args.cell.style.backgroundColor = "lightgreen"
        } else {
          args.cell.style.backgroundColor = "red"
          args.cell.style.color = "white"
        }
      }
    }

    if (args.data.line === "SLIDE" && args.column.field !== "line") {
      if (args.data[args.column.field] >= 0) {
        args.cell.style.backgroundColor = "lightgreen"
      } else {
        args.cell.style.backgroundColor = "red"
        args.cell.style.color = "white"
      }
    }

    if (args.data.line === 'STYLENO') {
      if (args.column.field !== 'line') {
        args.cell.style.fontSize = "11px"
      }
    }

    if (args.data.line === 'PCSCOST') {
      if (args.column.field !== 'line') {
        args.cell.style.fontSize = "18px"
      }
    }

    if (args.data.line === 'COLOUR') {
      if (args.column.field !== 'line') {
        args.cell.style.fontSize = "11px"
      }
    }

    if (args.data.line === "MP") {
      colSpanAr_Ref.current = [];
      colSpan1Ar_Ref.current = [];
    }

    if (args.data.line === "PCSCOST") {
      colSpan2Ar_Ref.current = [];
    }

    if (args.column.field !== "id" && args.column.field !== "line" && args.column.field !== "hrTot"
      && args.data.line === "MP") {
      if (colSpan2Ar_Ref.current.length > 0) {
        let colIdx = colSpan2Ar_Ref.current.findIndex((item) => item.line === args.column.headerText);
        if (colIdx === -1) {
          args.colSpan = rowSpanCntRef.current[args.column.headerText];
          colSpan2Ar_Ref.current.push({ line: args.column.headerText });
        }
      } else {
        args.colSpan = rowSpanCntRef.current[args.column.headerText];
        colSpan2Ar_Ref.current.push({ line: args.column.headerText });
      }
    }

    if (args.column.field !== "id" && args.column.field !== "line" && args.column.field !== "hrTot"
      && args.data.line === "WAGES") {
      if (colSpanAr_Ref.current.length > 0) {
        let colIdx = colSpanAr_Ref.current.findIndex((item) => item.line === args.column.headerText);
        if (colIdx === -1) {
          args.colSpan = rowSpanCntRef.current[args.column.headerText];
          colSpanAr_Ref.current.push({ line: args.column.headerText });
        }
      } else {
        args.colSpan = rowSpanCntRef.current[args.column.headerText];
        colSpanAr_Ref.current.push({ line: args.column.headerText });
      }
    }

    // console.log(args.data, args.column.headerText);
    if (args.column.field !== "id" && args.column.field !== "line" && args.column.field !== "hrTot"
      && args.data.line === "PCSCOST") {
      if (colSpan1Ar_Ref.current.length > 0) {
        let colIdx = colSpan1Ar_Ref.current.findIndex((item) => item.line === args.column.headerText);
        if (colIdx === -1) {
          args.colSpan = rowSpanCntRef.current[args.column.headerText];
          colSpan1Ar_Ref.current.push({ line: args.column.headerText });
        }
      } else {
        // console.log(colSpan1Ar_Ref.current, args.column.field);
        args.colSpan = rowSpanCntRef.current[args.column.headerText];
        colSpan1Ar_Ref.current.push({ line: args.column.headerText });
      }
    }

    if (args.column.field === 'hrTot') {
      args.cell.style.fontSize = '20px'
    }
  }

  const onImgClickHandler = () => {
    // if (!isReportsSidebar) {
    //   if (refreshTimer !== null) clearInterval(refreshTimer);
    // }
    // setIsReportsSidebar(!isReportsSidebar)
  }

  const destroyedHandler = (args) => {
    // console.log(isFullReport);
    // if (!isFullReport) {
    //   if (cycleTimer !== null) clearInterval(cycleTimer);
    //   if (refreshTimer !== null) clearInterval(refreshTimer);
    // }
  }

  const exitHandler = () => {
    setSelStyle(null);
    setSelColour(null);
    setSelIONO(null);
  }

  const onCellSelectingHandler = (args) => {
    // console.log(args);
    if (args.data.line !== "STYLENO") args.cancel = true;
  }

  const onCellSelectedHandler = (args) => {
    let dbIndex = args.cellIndex.cellIndex - 2;
    // console.log(tvDispDataDB_Ref.current[dbIndex].STYLENO);
    // console.log(args);
    // console.log(args.currentCell.ariaLabel.substring(args.currentCell.ariaLabel.lastIndexOf(" ")));
    // let selLine = args.currentCell.ariaLabel.substring(args.currentCell.ariaLabel.lastIndexOf(" ") + 1);
    // let dbIndex = tvDispDataDB_Ref.current.findIndex((item) => item.LN === selLine);
    // console.log(dbIndex, tvDispDataDB_Ref.current[dbIndex]);
    setSelIONO(tvDispDataDB_Ref.current[dbIndex].IONO);
    setSelStyle(tvDispDataDB_Ref.current[dbIndex].STYLENO);
    setSelColour(tvDispDataDB_Ref.current[dbIndex].COMBO);
  }

  const dataBoundHandler = () => {
    if (g_TVDispGrid_Ref !== null) {
      if (tvDispData.length > 0 && g_GridColumns.length > 0) {
        if (g_TVDispGrid_Ref.columns.length === 2) {
          g_TVDispGrid_Ref.columns = g_TVDispGrid_Ref.columns.slice(0, 2).concat(g_GridColumns);
        }
      }
    }
  }

  const exitDialogHandler = (selectFact) => {
    selFact_Ref.current = selectFact;
    setShowDialog(false);
  }

  return (
    <Fragment>
      <div id="tvDispGrid" style={{ margin: "2px" }}>
        {/* <ReportSidebar
          isReportsSidebar={isReportsSidebar}
          factorySelected={factorySelected}
          lineSelected={lineSelected} /> */}
        <div className="headerClass">
          <img src={'SKL_Logo.png'} height={40} width={40} alt="Logo" onClick={onImgClickHandler} />
          <div className="lineNameClass" style={{ width: width - 100 }}> S.K.L. EXPORTS PRODUCTION STATUS</div>
          <div className="dateClass" style={{ backgroundColor: 'white', color: 'black', marginTop: "5px", alignItems: 'center', textAlign: 'center', marginRight: '20px', width: "325px", height: "25px" }} >Date : {formattedDate}</div>
        </div>
        {(selStyle === null) && (<GridComponent
          id="tvDispGrid"
          ref={(g) => (g_TVDispGrid_Ref = g)}
          dataSource={tvDispData}
          rowHeight={40}
          height={props.height - 130}
          allowSorting={false}
          allowMultiSorting={false}
          allowSelection={true}
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
          destroyed={destroyedHandler}
          dataBound={dataBoundHandler}
          cellSelecting={onCellSelectingHandler}
          cellSelected={onCellSelectedHandler}
          selectionSettings={{
            cellSelectionMode: "Box",
            mode: "Cell",
            type: "Multiple"
          }}
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
              field="line"
              headerText="LINE"
              lockColumn={true}
              allowEditing={false}
              width={150}
            />
          </ColumnsDirective>
          <Inject
            services={[Toolbar, Resize]}
          />
        </GridComponent>)}
      </div>
      {(selStyle !== null) && (<OrderSummary
        onLogOut={exitHandler}
        style={selStyle}
        combo={selColour}
        iono={selIONO}
      />)}
      {
        showDialog && (<FactorySelectDialog
          showDialog={showDialog}
          exitDialog={exitDialogHandler}
          floorList={floorList.slice(0,-1)}
        />)
      }
    </Fragment>
  );
};

export default TVDisplayGrid;