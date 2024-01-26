import React, {useState, useEffect, useContext, useRef} from 'react'
import { Context } from "./Context.js"
import {dbUrl} from './apis/axios.js'
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css'

const UserInfo = () => {

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
    appData,
    setAppData,
    attachments,
    setAttachments,
    pageList,
    setPageList,
    requestTypes,
    setRequestTypes,
    initialFormData,
    setInitialFormData
  } = useContext(Context)


  const [formClassList, setFormClassList] = useState("form-group needs-validation")
  const formRef = useRef()

  const [emailErrorMsg, setEmailErrorMsg] = useState("Valid email")
  const [emailErrorClassName, setEmailErrorClassName] = useState("d-none text-active")
  const [emailValided, setEmailValidated] = useState(false)

  const [pwdErrorMsg, setPwdErrorMsg] = useState("Password matches")
  const [pwdErrorClassName, setPwdErrorClassName] = useState("d-none text-active")
  const [pwdValided, setPwdValidated] = useState(false)

  const [businessUnits, setBusinessUnits] = useState([])

  let user_info = {...appData.user_info}

  const handleChange = (e)=>{
      let {name, value} = e.target
      if(name=="email"){
        value = value.toString().toLowerCase()
      }

      user_info = {...appData[`${page.data}`],[name]:value}
      setAppData({...appData,user_info})
  }

  const handleBlur=(e)=>{
    const {name, value} = e.target

    if(name=="email"){
      let email = appData[`${page.data}`].email.toString()
        if(email.search("@")<=0 || email.search(/\./g)<=0){
          setEmailErrorMsg(`${String.fromCharCode(10060)} Invalid email`)
          setEmailErrorClassName("d-block text-danger fs-small mt-2")
          setEmailValidated(false)
      }else{
          setEmailErrorMsg(`${String.fromCharCode(9989)} Valid email`)
          setEmailErrorClassName("X d-block text-success fs-small mt-2")
          setEmailValidated(true)
      }        
    }

    if (name=="confirm_pwd"){
      const pwd = appData.user_info.pwd
      const confirmPwd = value
      if(confirmPwd!==pwd){
          setPwdErrorMsg(`${String.fromCharCode(10060)} Password doesn't match`)
          setPwdErrorClassName("d-block text-danger fs-small mt-2")
          setPwdValidated(false)
      }else{
          setPwdErrorMsg(`${String.fromCharCode(9989)} Password matches`)
          setPwdErrorClassName("X d-block text-success fs-small mt-2")
          setPwdValidated(true)
      }
  }
  }
  const handleSubmit = async (e)=>{
    
    e.preventDefault()
    const form = e.target

    if(e.nativeEvent.submitter.name==="backButton"){
        setFormClassList("form-group")
        let pageListCopy = pageList
        console.log(pageList)
        let thisPage = pageListCopy.splice(-1)
        let nextPage = pageListCopy[pageListCopy.length-1]
        console.log(nextPage)
        setPageList(pageListCopy)
        setPage(pages.filter(x=>x.name===nextPage)[0])
        setPageName(nextPage)

    }else{
        
      if(!form.checkValidity() || !emailValided || !pwdValided ){
        e.preventDefault();
      }
      
      else{
        const addUser = async (req,res)=>{

          const columns = Object.keys(appData[`${page.data}`])
          const values = Object.values(appData[`${page.data}`])
          
          const params = {
            table: "users",
            columns: columns,
            values: values
          }

          console.log(params)

            const headers={
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              // 'Authorization': 'Bearer yourAccessToken',
            }
            try{
              const sendUserDatatoDb = await dbUrl.post('/db/addUser',{params}, {headers})
              const response = await sendUserDatatoDb.data
              console.log(response)
              if(response =="exists"){
                  alert("User account already exists. Please re-enter a different email.")
              }else{
                setUser(appData.user_info)
                setUserLoggedIn(true)
                let nextPage = "Home"
                setPage(pages.filter(x=>x.name===nextPage)[0])
                setPageName(nextPage)
              }
              
            }catch(error){
              console.log(error)
            }
        }
        addUser()
      }
      setFormClassList('form-group was-validated')
    }
}

const getBusinessUnits = async ()=>{
    const response = await dbUrl.get("/db/table/business_units")
    
    let businessUnitSet = new Set()
      response.data.data.forEach(item=>{
        businessUnitSet.add(item.name)
      })
      let businessUnitList = [...businessUnitSet]
      setBusinessUnits(businessUnitList.sort())
  }

  useEffect(()=>{
    console.log(appData)
    console.log(pageList)
    getBusinessUnits()
  },[])


  const [pageClass, setPageClass] = useState("container mt-5 animate__animated animate__fadeIn animate__duration-0.5s")
  
  return (
    <div className = {pageClass}>
      <div className="row">
        <div className="col"></div>

        <div className="col-lg-6">
          
          <h1 className="text-left mb-3 border-bottom border-5">{userLoggedIn ? pageName:"Sign Up"}</h1>
          
          <div className="d-flex flex-column bg-light border shadow shadow p-3 rounded-2 justify-content-center">
          
          <form ref={formRef} name='form' id="form" onSubmit={handleSubmit} className={formClassList} noValidate>
            
          <div className="form-floating mb-3">
                <input id = "email" name= "email" tyoe="email" className="form-control form-control text-primary" onChange={handleChange} onBlur={handleBlur} placeholder="Email" required></input>
                <label htmlFor="email" className="form-label text-body-tertiary small">
                    Email
                    <span style={{color: "red"}}>*</span>
                </label>
                <div className={emailErrorClassName} style={{fontSize: 12}}>{emailErrorMsg}</div>
            </div>

            <div className="form-floating mb-3">
              <input id = "pwd" name= "pwd" type ="password" className="form-control form-control text-primary" onChange={handleChange}  placeholder="Password" required></input>
                <label htmlFor="pwd" className="form-label text-body-tertiary small">
                    Password
                    <span style={{color: "red"}}>*</span>
                </label>
            </div>

            <div className="form-floating mb-3">
                <input id = "confirm_pwd" name= "confirm_pwd" type ="password" className="form-control form-control text-primary" onBlur={handleBlur} placeholder="Password" required></input>
                <label htmlFor="confirm_pwd" className="form-label text-body-tertiary small">
                    Confirm Password
                    <span style={{color: "red"}}>*</span>
                </label>
              <div className={pwdErrorClassName} style={{fontSize: 12}}>{pwdErrorMsg}</div>
            </div>

            <div className="form-floating mb-3">
                <input id = "first_name" name= "first_name" tyoe="text" className="form-control form-control text-primary" onChange={handleChange} placeholder="Username" required></input>
                <label htmlFor="first_name" className="form-label text-body-tertiary small">
                    First Name
                    <span style={{color: "red"}}>*</span>
                </label>
            </div>

            <div className="form-floating mb-3">
                <input id = "last_name" name= "last_name" tyoe="text" className="form-control form-control text-primary" onChange={handleChange} placeholder="Username" required></input>
                <label htmlFor="last_name" className="form-label text-body-tertiary small">
                Last Name
                <span style={{color: "red"}}>*</span>
                </label>
            </div>

            <div className="form-floating mb-3">
                <input id = "company_name" name= "company_name" tyoe="text" className="form-control form-control text-primary" onChange={handleChange} placeholder="Company name" required></input>
                <label htmlFor="company_name" className="form-label text-body-tertiary small">
                    Company Name
                <span style={{color: "red"}}>*</span>
                </label>
                </div>

            <div className="form-floating mb-3">
              <input id = "job_title" name= "job_title" tyoe="text" className="form-control form-control text-primary" onChange={handleChange} placeholder="Job Title"></input>
              <label htmlFor="job_title" className="form-label text-body-tertiary small">Job Title</label>
            </div>

            <div className="form-floating mb-3">
              <select 
                id = "business_unit" 
                name = "business_unit" 
                className="form-select text-primary" 
                placeholder="What business unit are you with"
                onChange={handleChange} 
                >
                <option value="" style={{color: "lightgray"}}></option>
                {businessUnits.map(item=>(
                  <option className="option light" key={businessUnits.indexOf(item)+1}>{item}</option>
                ))}
              </select>
              <label htmlFor="supplier" className="form-label text-body-tertiary">Business Unit</label>
            </div>
            <div className="form-floating mb-3">
                <input id = "mobile_phone" name= "mobile_phone" type="tel" className="form-control form-control text-primary" onChange={handleChange} placeholder="Mobile Phone"></input>
                <label htmlFor="mobile_phone" className="form-label text-body-tertiary small">Mobile Phone</label>
            </div>
            
            <div className="d-flex flex-column justify-content-center">
              <div className="d-flex justify-content-center">
                <div className="btn-group">
                  <button name= "backButton" className="btn btn-outline-secondary" data-bs-toggle="button">Back</button>
                  <button name="signUp" className="btn btn-primary" data-bs-toggle="button" type="submit">Sign Up</button>
                </div>
              </div>
            </div>

          </form>
          </div>
          <div className="d-flex justify-content-center mt-5">
            <img style={{maxHeight: 100,  backgroundColor:"none"}}src="https://nlightnlabs01.s3.us-west-1.amazonaws.com/nlightn+labs+logo.png"></img>
          </div>
        </div>

        <div className="col"></div> 
      </div>
    </div>
  )
}

export default UserInfo