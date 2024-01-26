import React, {useState, useEffect} from 'react'
import Workflow from './Workflow'
import DataEntryFrom from './DataEntryForm.js'
import Activities from './Activities'
import { generalIcons } from './apis/icons'
import {deleteRecord, getRecord, getRecords, getData, getTable, updateRecord} from './apis/axios.js'
import "bootstrap/dist/css/bootstrap.min.css"


const RecordDetails = (props) => {

    const tableName = props.tableName || ""
    const formName =  props.formName || ""
    const recordId = props.recordId || ""
    const userData = props.userData ||[]
    const tableData = props.tableData || []
    const refreshTable = props.refreshTable

    const setShowRecordDetails = props.setShowRecordDetails
    const [recordData, setRecordData] = useState([])
    const [fields, setFields] = useState([])
    const [activities, setActivities] = useState([])
    const [formData, setFormData] = useState([])

    const getRecordData = async ()=>{
        const params={
            tableName,
            recordId,
            idField: 'id'
        }

        const returnedData = await getRecord(params)
        // console.log(returnedData)
        setRecordData(returnedData)
        setFields(Object.keys(returnedData))
      }

      const getActivityData = async ()=>{
        const query = `SELECT A.*, B.first_name, B.last_name from activities as A left join users as B on A.user = B.email where "record_id"='${recordId}' and "app" = '${tableName}' order by "record_created" desc;`
        const returnedData = await getData(query)

        setActivities(returnedData.sort((a, b) => {
            return  b.record_created-a.record_created;
          }));
      }

      const iconButtonStyle={
        maxHeight: 30,
        maxWidth: 30,
        cursor: "pointer"
      }

      const ActivitiesPanel = {
        resize: "horizontal",
      }

      const FormDataPanel = {
        resize: "horizontal",
      }

      useEffect(()=>{
        getRecordData()
        getActivityData()
      },[props])

  return (
    <div className="flex flex-column" style={{height: "100%", overflow: "hidden"}}>
        <div className="d-flex justify-content-end rounded-3" style={{backgroundColor: "rgb(50,100,255"}}>
            <div className="button-group p-1">
                <img src={`${generalIcons}/close_icon.png`} style={iconButtonStyle}  name="closeButton" onClick={(e)=>{setShowRecordDetails(false)}}></img>
            </div>
        </div>
        {/* <div className="row">
            <Workflow/>
        </div> */}
        <div className="row">
            <div className="col-7 p-3" style={FormDataPanel}>
                <DataEntryFrom
                    formName = {formName}
                    tableName={tableName}
                    pageTitle={"Record Details"}
                    recordId={recordId}
                    formData={recordData}
                    fields = {fields}
                    userId={userData.id}
                    appData={{user: userData}}
                    updateParent = {setFormData}
                    updateParentStates = {[getActivityData, getRecordData]}
                />
             </div>
            
            <div className="col-5 p-3" style={ActivitiesPanel}>
                <Activities
                    tableName={tableName}
                    pageTitle={"Activities"}
                    recordId={recordId}
                    userData={userData}
                    activities={activities}
                />
            </div>
        </div>
        </div>
  )
}

export default RecordDetails