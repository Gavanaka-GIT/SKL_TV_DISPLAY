import { useEffect } from 'react';

import { SidebarComponent } from '@syncfusion/ej2-react-navigations';

import "./ReportSidebar.css";

var g_Sidebar_Obj = null;
const ReportSidebar = (props) => {

  // console.log("Reports", props.isReportsSidebar);

  useEffect(() => {
    g_Sidebar_Obj.toggle();
  }, [props.isReportsSidebar]);

  useEffect(() => {
    g_Sidebar_Obj.toggle();
  }, []);

  const onCreateHandler = () => {
    g_Sidebar_Obj.element.style.visibility = "";
  }

  const onClickFactory = () => {
    props.factorySelected();
    g_Sidebar_Obj.hide();
  }

  const onClickLine = () => {
    props.lineSelected();
    g_Sidebar_Obj.hide();
  }

  return (
    <SidebarComponent
      id="reports-sidebar"
      ref={Sidebar => g_Sidebar_Obj = Sidebar}
      style={{ visibility: "hidden" }}
      closeOnDocumentClick={true}
      created={onCreateHandler}
      showBackdrop={true}
      type="Over"
      position="Left"
      width="280px">
      <div className="title"> Reports </div>
      <ul>
        <li>
          <span className="sub-title" onClick={onClickFactory}> Factory production status </span>
        </li>
        <li>
          <span className="sub-title" />
        </li>
        <li>
          <span className="sub-title" onClick={onClickLine}> Zone Packing Status </span>
        </li>
        <li>
          <span className="sub-title" />
        </li>
      </ul>
    </SidebarComponent>
  )
}
export default ReportSidebar;
