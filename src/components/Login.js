import React, {useState, useEffect, useContext, useRef} from 'react'
import { Context } from "./Context.js"
import axios from './apis/axios.js'
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css'

const Login = () => {

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
    setRequestTypes
  } = useContext(Context)

  useEffect(()=>{
    setAppData({})
    setPageName("Log In")
    setPage(pages.filter(x=>x.name==="Log In")[0])
    setPageList(['Log In'])
},[])

  let formData = {}

  const [formClassList, setFormClassList] = useState("form-group")
  const formRef = useRef()
  const [logInErrorMsg, setLogInErrorMsg] = useState("")
  const [logInClassName, setLogInClassName] = useState("d-none")

  const handleChange = (e)=>{
      let {name, value} = e.target
    
      if(name=="email"){
        value = value.toString().toLowerCase()
      }

      let new_data = {[name]: value}
      let formData = {...appData[`${page.data}`],...new_data}
      setAppData({...appData,[`${page.data}`]:formData})
  }

  const handleSubmit = async (e)=>{
    
    e.preventDefault()
    const form = e.target

    const validateUser = async(req, res)=>{
      if(Object.keys(appData)==0){
        let formData = {...appData[`${page.data}`],...{}}
        setAppData({...appData,[`${page.data}`]:formData})
        setLogInErrorMsg(`${String.fromCharCode(10060)} invalid user information.`)
        setLogInClassName("text-danger mt-0 mb-3 animate__animated animate__fadeIn ")
      }
      else{
        // console.log(appData)
        const params = {
            email: appData.user_info.email,
            pwd: appData.user_info.pwd
        }
        const headers={
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          // 'Authorization': 'Bearer yourAccessToken',
        } 
        try{
            const submitLoggin = await axios.post(`/db/authenticateUser`,{params},{headers})
            const userValidated = submitLoggin.data
            return userValidated
        }catch(error){
            console.log(error)
        }
      }
        
    }

    const getUserInfo = async (req, res)=>{
        const headers={
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          // 'Authorization': 'Bearer yourAccessToken',
        } 
        const params = {
          email: appData.user_info.email
        }
        try{
          const getUserQuery = await axios.post(`/db/userRecord`,{params},{headers})
          const getUserQueryResonse = await getUserQuery.data;
          return getUserQueryResonse
        }catch(error){
          console.log(error)
        }
      }

    if(e.nativeEvent.submitter.name==="sign_up"){
      setFormClassList("form-group")
      let nextPage = "User Info"
      setPageList([...pageList,nextPage])
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageName(nextPage)
    }else if(e.nativeEvent.submitter.name==="forgot_password"){
      setFormClassList("form-group")
      let nextPage = "Forgot Password"
      setPageList([...pageList,nextPage])
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageName(nextPage)
    }else{
      if(!form.checkValidity()){
        e.preventDefault();
      }else{
        const userValidated = await validateUser()
        if(userValidated){
            setUserLoggedIn(true)
            setUser(appData.user_info.email)
            const user_data = await getUserInfo()
            setAppData({...appData,[`${page.data}`]:user_data})
            const nextPage = ("Home")
            setPageName(nextPage)
            setPage(pages.filter(x=>x.name===nextPage)[0])
            setPageList([...pageList,nextPage])
        }else{
            setLogInErrorMsg(`${String.fromCharCode(10060)} invalid user information.`)
            setLogInClassName("text-danger mt-0 mb-3 animate__animated animate__fadeIn ")
        }
      }
    }
}

  const [pageClass, setPageClass] = useState("container mt-5 animate__animated animate__fadeIn animate__duration-0.5s")
  
  return (
    <div className = {pageClass}>
      <div className="row">
        <div className="col"></div>

        <div className="col-lg-6">
          
          <h1 className="text-left mb-3 border-bottom border-5">{pageName}</h1>
          
          <div className="d-flex flex-column bg-light border shadow shadow p-3 rounded-2 justify-content-center">
          
          <form ref={formRef} name='form' id="form" onSubmit={handleSubmit} className={formClassList}>
            
            <div className="form-floating mb-3">
              <input id = "email" name= "email" type="email" className="form-control form-control text-primary" onChange={handleChange} placeholder="Username"></input>
              <label htmlFor="email" className="form-label text-body-tertiary small">Email</label>
            </div>

            <div className="form-floating mb-3">
              <input id = "pwd" name= "pwd" type ="password" className="form-control form-control text-primary" onChange={handleChange} placeholder="Password"></input>
              <label htmlFor="pwd" className="form-label text-body-tertiary small">Password</label>
            </div>
            <div className={logInClassName} style={{fontSize: 12}}>{logInErrorMsg}</div>
            
            <div className="d-flex flex-column justify-content-center mt-3">
              <div className="d-flex justify-content-center">
                <div className="d-flex flex-column">
                    <button id = "login_in" name="log_in"  className="btn btn-primary" data-bs-toggle="button" type="submit">Log In</button>
                    <button id = "sign_up" name="sign_up"  className="btn text-secondary" data-bs-toggle="button" type="submit">Sign Up</button>
                    <button id = "forgot_password" name="forgot_password"  className="btn text-secondary" data-bs-toggle="button" type="submit">Forgot Password</button>
                </div>
              </div>
            </div>

          </form>
          </div>

        </div>

        <div className="col"></div> 
      </div>
    </div>
  )
}

export default Login