import React, {useState, useEffect, useContext, useRef} from 'react'
import { Context } from "./Context.js"
import { useNavigate } from 'react-router'
import {updateRecord} from './apis/axios.js'
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css'

const ResetPassword = () => {

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

useEffect(()=>{
    
},[])

  const [formData, setFormData] = useState({})
  const navigate = useNavigate("/");

  const [formClassList, setFormClassList] = useState("form-group needs-validation")
  const formRef = useRef()

  const [emailErrorMsg, setEmailErrorMsg] = useState("Valid email")
  const [emailErrorClassName, setEmailErrorClassName] = useState("d-none text-active")
  const [emailValided, setEmailValidated] = useState(false)

  const [pwdErrorMsg, setPwdErrorMsg] = useState("Password matches")
  const [pwdErrorClassName, setPwdErrorClassName] = useState("d-none text-active")
  const [pwdValided, setPwdValidated] = useState(false)

  const handleChange = (e)=>{
      let {name, value} = e.target
      if(name=="email"){
        value = value.toString().toLowerCase()
      }
      setFormData({...formData,...{[name]:value}})
  }

  const handleBlur=(e)=>{
    const {name, value} = e.target

    if(name=="email"){
        //console.log(formData)
      let email = formData.email.toString()
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
      const pwd = formData.pwd
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
    //console.log(formData)
    
    const form = e.target
   
      if(!form.checkValidity() || !emailValided || !pwdValided ){
        e.preventDefault();
      }
      else{

        const updatePassword = async (req,res)=>{

            const email = formData.email.toString()

            const params = {
                tableName: "users",
                idField: "email",
                recordId: email,
                formData: formData
            }

            try{
              const updateUserDataInDb = await updateRecord(params)
              //console.log(updateUserDataInDb.email)
              if (updateUserDataInDb.email == email){
                navigate("/")
              }
            }catch(error){
              //console.log(error)
            }
        }
        if(e.nativeEvent.submitter.name==="submit"){
            updatePassword()
        }
      }
      setFormClassList('form-group was-validated')
    }


  const [pageClass, setPageClass] = useState("container mt-5 animate__animated animate__fadeIn animate__duration-0.5s")
  
  return (
    <div className = {pageClass}>
      <div className="row">
        <div className="col"></div>

        <div className="col-lg-6">
          
          <h1 className="text-left mb-3 border-bottom border-5">Reset Password</h1>
          
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
            
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-center">
                <div className="btn-group">
                  <button name="submit" className="btn btn-primary" data-bs-toggle="button" type="submit">Submit</button>
                </div>
              </div>
            </div>

          </form>
          </div>
          <div className="d-flex justify-content-center mt-5">
            <img style={{maxHeight: 100,  backgroundColor:"none"}} src="https://nlightnlabs01.s3.us-west-1.amazonaws.com/nlightn+labs+logo.png"></img>
          </div>
        </div>

        <div className="col"></div> 
      </div>
    </div>
  )
}

export default ResetPassword