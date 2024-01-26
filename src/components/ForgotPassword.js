import React, {useState, useEffect, useContext, useRef} from 'react'
import { Context } from "./Context.js"
import { getRecord, sendEmail} from './apis/axios.js'
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css'

const ForgotPassword = () => {

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
    // console.log(page)
    // console.log(pageList)
},[])


  let formData = {}

  const [formClassList, setFormClassList] = useState("form-group")
  const formRef = useRef()
  const [validationMsg, setValidationMsg] = useState("")
  const [validationClassName, setValidationClassName] = useState("d-none")

  // countdown 
  const [seconds, setSeconds] = useState(10);
  const [counterMsgClassName, setCounterMsgClassName] = useState("d-none")

  const handleChange = (e)=>{
      let {name, value} = e.target

      if(name=="email"){
        value = value.toString().toLowerCase()
      }

      let new_data = {[name]: value}
      let formData = {...appData[`${page.data}`],...new_data}
      // console.log(formData)
      setAppData({...appData,[`${page.data}`]:formData})
  }

  const handleSubmit = async (e)=>{
    
    e.preventDefault()
    const form = e.target
    
    const validateUser = async(email)=>{
      if(Object.keys(appData)==0){
        let formData = {...appData[`${page.data}`],...{}}
        setAppData({...appData,[`${page.data}`]:formData})
        setValidationMsg(`${String.fromCharCode(10060)} invalid email.`)
        setValidationClassName("text-danger mt-0 mb-3 animate__animated animate__fadeIn ")
      }
      else{
      
        const params = {
            tableName: 'users',
            recordId:  email,
            idField: 'email'
        }
        try{
            const userRecord = await getRecord(params)
            // console.log(userRecord)
            if (userRecord.email == email){
              return true
            }else{
              return false
            }
        }catch(error){
            // console.log(error)
        }
      }
    }


    if(e.nativeEvent.submitter.name==="backButton"){
   
      setFormClassList("form-group")
      let nextPage = "Log In"
      setPageList([...pageList,nextPage])
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageName(nextPage)
    }else{
      if(!form.checkValidity()){
        e.preventDefault();
      }else{
        // console.log(appData)
        const email = appData[`${page.data}`].email
        const userValidated = await validateUser(email)
        if(userValidated){

         const to = email
          const subject = "Password Reset"
          const message = "This is a response to your request to reset your password.  Please click the button below."
          const htmlPage = `<h3>Password Reset</h3><p>This is a response to your request to reset your password.  Please click the button below.</p><button onClick="https://nlightnlabs.net/RequestFlow/ResetPassword">Reset Password</button>`

          const params = {
            to: to,
            subject: subject,
            message: message,
            htmlPage: htmlPage
          }

          const emailSent = await sendEmail(params)
          // console.log(emailSent)

          if(emailSent){
            setValidationMsg(`${String.fromCharCode(9989)} Account verified.  Password reset email sent to ${email}. \n\r If you do not receive an email within 5 minutes, please contact support@nlightnlabs.com`)
            setValidationClassName("text-success mt-0 mb-3 text-center animate__animated animate__fadeIn ")
            setCounterMsgClassName("d-block text-secondary text-center mt-0 mb-3 animate__animated animate__fadeIn")

            const startCountdown = () => {
              const interval = setInterval(() => {
                if (seconds > 0) {
                  setSeconds(prevSeconds => prevSeconds - 1);
                } else {
                  clearInterval(interval);
                }
              }, 1000);
            };
            startCountdown()

            setTimeout(
              ()=>{const nextPage = ("Log In")
              setPageName(nextPage)
              setPage(pages.filter(x=>x.name===nextPage)[0])
              setPageList([...pageList,nextPage])
            },10*1000)

          }else{
            // console.log(`unable to send email`)
          }
          

        }else{
            setValidationMsg(`${String.fromCharCode(10060)} No account was found for ${email}.`)
            setValidationClassName("text-danger mt-0 mb-3 animate__animated animate__fadeIn ")
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
          
          <form ref={formRef} name='form' id="form" onSubmit={handleSubmit} className={formClassList} noValidate>
            
            <div className="form-floating mb-3">
              <input id = "email" name= "email" type="email" className="form-control form-control text-primary" onChange={handleChange} placeholder="Username" required></input>
              <label htmlFor="username" className="form-label text-body-tertiary small">Email</label>
            </div>
            <div className={validationClassName}>{validationMsg}</div>
            <div className={counterMsgClassName}>Sending back to log in page in <span className="text-danger fw-bold">{seconds}</span> seconds</div>

            <div className="d-flex flex-column justify-content-center mt-3">
              <div className="d-flex justify-content-center">
                <div className="d-flex flex-column">
                  <button name="resetPassword" className="btn btn-primary" data-bs-toggle="button" type="submit">Reset Password</button>
                  <button name= "backButton" className="btn text-secondary" data-bs-toggle="button">Back to Log In</button>
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

export default ForgotPassword