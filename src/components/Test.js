import React, {useState, useEffect, useContext, useRef} from 'react'
import {Context} from './Context.js'
import NewRecordForm from './NewRecordForm';
import {getRecords} from './apis/axios.js'
import {appIcons} from './apis/icons.js'

const Test = (props) => {
  
  const {user, appData, page, setPage, setAppData, pageName, setPageName, pageList, setPageList} = useContext(Context);

  const requestType = props.requestType || "purchase_request";
  const [formName, setFormName] = useState(props.requestType || "purchase_request")
  const [formData, setFormData] = useState({});
  const [formElements, setFormElements] = useState([])
  const [formClassList, setFormClassList] = useState("form-group")
  const [nextFormName, setNextFormName] = useState("")
  const uploadFilesRef = useRef()

  const [formList, setFormList] = useState([])

  const getFormElements = async (formName)=>{
      console.log(formName)
      const params = {
        tableName: "forms",
        conditionalField: "ui_form_name",
        condition: formName
      }
      const formElements = await getRecords(params)
      console.log(formElements)
      setFormName(formName)
      setNextFormName(formElements[0].ui_next_page)
      setFormElements(formElements)
  }

  useEffect(()=>{
    getFormElements(formName);
  },[props, formName])

  const handleSubmit = async (e)=>{

    e.preventDefault();
    const form = e.target
    console.log(e)

    if(e.nativeEvent.submitter.name==="backButton" && formElements[0].ui_page_number >1){
      setFormClassList("form-group")
      let pageListCopy = setFormList
      let thisPage = pageListCopy.splice(-1) || pageListCopy
      let nextForm = pageListCopy[Math.max(pageListCopy.length-1,0)]
      setFormList(pageListCopy)
      setFormName(nextForm)
    }else{
      if(!form.checkValidity()){
        e.preventDefault();
      }else{
        console.log("afsadfas")
        setFormList([...pageList,nextFormName])
        console.log(nextFormName)
        getFormElements(nextFormName);
      }
    }
    setFormClassList('form-group was-validated')
}

const handleClose = ()=>{
  let nextPage = "Home"
  setPageList([...pageList,nextPage])
  setPageName(nextPage)
  setPage(nextPage)
}

const modalBackdropStyle= {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0, 0, 0, 0.5)",
}

  const pageStyle={}

  const [pageClassName, setPageClassName] = useState("flex-container flex-column")

  const [containerSize, setContainerSize] = useState({
    width: "50vw",
    height: "80vh",
    left: "25vw",
    top: "20vw"
  })

  useEffect(()=>{
    setContainerSize(()=>{if(window.innerWidth >=600){
      return {width: "50vw",height: "80vh", left: "25vw", top: "20vw"}
    }else{
      return {width: "100vw",height: "100%", left: "0", top: "75px"}
    }})
  },[window.innerWidth])

  const mainContainerStyle= {
    position: "absolute",
    top: "10vh",
    left: containerSize.left,
    width: containerSize.width,
    height: "80vh",
    overflow: "hidden"
  }


  const iconStyle= {
    height: "30px",
    width: "30px",
  }


  return (
    <div className="flex-container">
      
      <div className="d-flex flex-column bg-light border rounded-3 shadow shadow-3" style={mainContainerStyle}>

      <div className="d-flex justify-content-end" style={{backgroundColor: "rgb(50,100,255"}}>
          <img src={`${appIcons}/close_icon.png`} style={iconStyle} onClick={(e)=>handleClose(e)}></img>
      </div>
      
      <form name='form' id="form" onSubmit={handleSubmit} className={formClassList} noValidate>

        {/* Button Group */}
        <div className="d-flex justify-content-between m-3">
          <button className="btn btn-outline-secondary" name="backButton" style={{fontSize: "14px"}}>Back</button>
          <button className="btn btn-primary" name="nextButton"  style={{fontSize: "14px"}}>Next</button>
        </div>

        <div className="d-flex flex-column m-3">
           <NewRecordForm 
              setUploadFilesRef={(ref) => (uploadFilesRef.current = ref)}
              formName = {formName}
              initialFormData = {formData}
              updateParent = {setFormData}
              appData = {{user: appData.user_info}}
            />
        </div>
      </form>
      </div>
    </div>
  )
}

export default Test