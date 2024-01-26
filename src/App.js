import React, {useContext, useEffect} from 'react';
import {baseURL} from './components/apis/axios.js';
import {Context } from './components/Context';
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import {appIcons} from './components/apis/icons.js'

import Home from './components/Home.js';
import Login from './components/Login.js';
import UserInfo from './components/UserInfo.js';
import ForgotPassword from './components/ForgotPassword.js';
import ResetPassword from './components/ResetPassword.js';
import Header from './components/Header.js';


function App() {


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
  } = useContext(Context)

  

  let pageData=[
    {name: "Home", component: <Home/>, data: "request_summary", request_type: false, description: "Description for this request", icon:`${appIcons}/home_icon.png`},
    {name: "Log In", component: <Login/>, data: "user_info", request_type: false, description: "Login page", icon:`${appIcons}/log_in_icon.png`},
    {name: "User Info", component: <UserInfo/>, data: "user_info", request_type: false, description: "User profile", icon:`${appIcons}/sign_up_icon.png`},
    {name: "Forgot Password", component: <ForgotPassword/>, data: "email", request_type: false, description: "Forgot Password page", icon:`${appIcons}/sign_up_icon.png`},
    {name: "Reset Password", component: <ResetPassword/>, data: "user_info", request_type: false, description: "Password reset page", icon:`${appIcons}/sign_up_icon.png`},
  ]


  const getPageData = async(req, res)=>{
    try{
      // const response = await getTable("pages")
      setPages(pageData)
      setPage(pageData.filter(x=>x.name===pageName)[0])
    }catch(error){
      console.log(error)
    }
  }

  const getRequestTypes = ()=>{
    let list = []
    pageData.forEach(item=>{
      item.request_type && list.push(item)
    })
    return list
  }

 useEffect(()=>{
    console.log(baseURL)
    console.log(Context)
    getPageData()
  },[])
 

  const pageStyle={
    backgroundSize: "cover",
    backgroundImage: "linear-gradient(0deg, rgb(220, 230, 255), rgb(245, 250, 255), white)",
    height: "100vh",
    width: "100vw",
    overflow: "hidden"
  }

  
  return (
    <div style={pageStyle}>

        {(!userLoggedIn && pageName == "Log In") && 
          <>
            <Login/>
            <div className="d-flex justify-content-center mt-5 ">
              <img style={{maxHeight: 100,  backgroundColor:"none", cursor: "pointer"}} src={"https://nlightnlabs01.s3.us-west-1.amazonaws.com/nlightn+labs+logo.png"}></img>
            </div>
          </>
          }

        {!userLoggedIn && pageName == "User Info" && <UserInfo/>}

        {!userLoggedIn && pageName == "Forgot Password" && <ForgotPassword/>}

        {userLoggedIn && 
          <>
          <div style={{position: "relative", zIndex: 99999}}>
            <Header/>
          </div>
            <>{pages.filter(x=>x.name===pageName)[0].component}</>
          </>
        }

    </div>
  );
}

export default App;