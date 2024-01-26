import React, {useState, useContext, useEffect, useRef} from 'react';
import {Context } from './Context.js';
import "bootstrap/dist/css/bootstrap.min.css"
import Table from './Table.js';
import { getTable, getRecords } from './apis/axios.js';
import { toProperCase } from './functions/formatValue.js';
import ValueChart from './ValueChart.js'
import ParetoChart from './ParetoChart.js';
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels)


const Records = (props) => {

  const {
    user,
    setUser,
    userLoggedIn,
    setUserLoggedIn,
    page,
    setPage,
    pages,
    setPages,
    pageName,
    setPageName,
    requestType,
    setRequestType,
    requestTypes,
    setRequestTypes,
    appData,
    setAppData,
    attachments,
    setAttachments,
    pageList,
    setPageList,
    tableName,
    setTableName,
    tables,
    setTables,
    apps,
    setApps,
    selectedApp,
    setSelectedApp,
  } = useContext(Context)

  const [data, setData] = useState([])
  const [fields, setFields] = useState([])
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [showTable, setShowTable] = useState(true)
  const [showCharts, setShowCharts] = useState(true)
  const [chartProps, setChartProps] = useState([])

  const formName = apps.find(item=>item.name===selectedApp).edit_form_name || ""

  const chartsSectionRef = useRef(null)
  const [chartsSectionWindowSize, setChartsSectionWindowSize] = useState({})

  const getTableData = async (req, res)=>{
    const response = await getTable(tableName)

    setData(response.data.sort((a, b) => {
      return  b.id-a.id;
    }));
    setFields(Object.keys(response.data[0]))
}

const getChartProps =  async (req, res)=>{
  // const chartProps = apps.find(item=>item.name==selectedApp).chart_props

  const params = {
    tableName: "charts",
    conditionalField: "app",
    condition: selectedApp
}
  const response = await getRecords(params)
  console.log(response)

  setChartProps(response)
}

useEffect(()=>{
  getTableData()
  getChartProps()
},[])

useEffect(()=>{
  showCharts && setChartsSectionWindowSize({
    width: chartsSectionRef.current.clientWidth,
    height: chartsSectionRef.current.clientHeight,
  })
},[chartsSectionRef])

const chartContainerStyle={
  width: (chartsSectionWindowSize.width/3),
  minWidth: 400, 
  minHeight: 250,
  height: "90%",
  overflowX: "auto",
  margin: "10px"
}

const labelContainerStyle={
  minWidth: 200, 
  height: "100%",
  minHeight: 150,
  height: "90%",
  overflowX: "auto",
  margin: "10px"
}

const tableContainerStyle = {
  height: "60vh", 
  overflowY:"auto",
  padding: 20
}



const [pageClass, setPageClass] = useState("flex-container flex-column animate__animated animate__fadeIn animate__duration-0.5s")

  return (

    <div className={pageClass}>
        <div className="d-flex flex-column bg-light">
            
            <h2 className="ps-3">{toProperCase(tableName.replaceAll("_"," "))}</h2>
            {/* Charts container */}

            <div ref = {chartsSectionRef} className="d-flex flex-wrap justify-content-center" style={{height: "35vh", overflow: 'auto'}}>
            {
              Array.isArray(chartProps) &&
              chartProps.map((props,index)=>(
                props.type === "ValueChart"?
                <div key={index} className="d-flex justify-content-center bg-white border rounded-3 shadow" style={labelContainerStyle}>
                  <ValueChart
                      props = {props}
                  />
                </div>
                :
                props !=null && props.type === "BarChart"?
                <div className="d-flex justify-content-center  bg-white border rounded-3 shadow" style={chartContainerStyle}>
                  <ParetoChart
                      props = {props}
                    />
                </div>
                :
                props !=null && props.type === "ParetoChart"?
                <div className="d-flex justify-content-center bg-white border rounded-3 shadow" style={chartContainerStyle}>
                  <ParetoChart
                      props = {props}
                    />
                </div>
                :
                null
              ))
            }
            </div>
            
            {/* Show table container for large screen size */}
            {data.length>0 &&
            <div className="d-flex bg-light" style={tableContainerStyle}>
              <Table 
                userData={appData.user_info}
                tableName={tableName}
                formName={formName}
                />
            </div>
            }

            </div>
    </div>
  )
}

export default Records