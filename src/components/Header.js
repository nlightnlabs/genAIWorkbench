import React, {useState, useContext, useEffect, useRef} from 'react';
import {ContextProvider, Context } from './Context';
import "bootstrap/dist/css/bootstrap.min.css"
import {getTable} from './apis/axios.js'
import { toProperCase } from './functions/formatValue.js';
import { appIcons, generalIcons } from './apis/icons.js';

const Header = () => {

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
      tables,
      setTables,
      tableName,
      setTableName,
      apps,
      setApps,
      selectedApp,
      setSelectedApp
      } = useContext(Context)

    

    const [showUserOptions, setShowUserOptions] = useState(false)
    const [userOptionsClassName, setUserOptionsClassName] = useState("d-flex flex-column p-1 border border-1 rounded rounded-3 shadow-sm")
    
    const topBarRef = useRef(null)
    const menuRef = useRef(null)

    const [userData, setUserData]=useState({
      first_name: "",
      email: "",
    })

    const getApps = async ()=>{
      const response = await getTable("apps")
      // console.log(response)
      setApps(response.data)
  }

    const initializeUserData=()=>{
      let x = JSON.stringify(appData) 
      if(x.search("user_info")>0){
        setUserData(appData.user_info)
      }
    }

    
    useEffect(()=>{
      // setUser(localStorage.getItem('user'));
      getApps()
      initializeUserData()
      // console.log(Context)

    },[appData, userLoggedIn])

    const homeIcon = `${generalIcons}/home_icon.png`
    const menuIcon = `${generalIcons}/menu_icon.png`

    const iconStyle = {
        maxHeight: 50,
    cursor: "pointer"
    }

  const handleMenuOption=(elem)=>{
  

    if(elem == "newRequestButton"){
      let nextPage = "Home"
      setPageList([nextPage])
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageName(nextPage)
    }
    if(elem == "allRequestsButton"){
      let nextPage = "Requests"
      setPageList([...pageList,nextPage])
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageName(nextPage)
    }
    if(elem == "updateButton"){
      let nextPage = "User Info"
      setPageList([...pageList,nextPage])      
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageName(nextPage)
    }
    if(elem == "homeButton"){
      let nextPage = "Home"
      setPageList([...pageList,nextPage]) 
      console.log(pages.filter(x=>x.name===nextPage)[0])
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageName(nextPage)
    }
    if(elem == "signOutButton"){
      localStorage.removeItem('user');
      let nextPage = "Log In"
      setPageList([nextPage])
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setUserData({
        first_name: "",
        email: "",
      })
      setUser({})
      setAppData({})
      setUserLoggedIn(false)
      setPageName(nextPage)
    }
  }

  const handleAppOption=(app)=>{
      setSelectedApp(app.name)
      setTableName(app.db_table)
      let nextPage = app.default_component
      setPageList([nextPage])
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageName(nextPage)
  }

  const topBarStyle={
    position: "sticky",
    top: 0,
    height: 60,
    borderBottom: "1px solid lightgray",
    marginBottom: "10px"
  }

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const menuStyle={
    width: 300, 
    right: 0, 
    overflowY: "auto", 
    top: topBarStyle.height, 
    height: windowDimensions.height-topBarStyle.height-1,
    backgroundColor: "#9DC3E6",
  }

  return (
    <div ref={topBarRef} className="d-flex bg-white justify-content-end" style={topBarStyle}>
      {userLoggedIn && 
      <div className="d-flex flex-column p-2">
        <span className="text-secondary" style={{fontSize:12}}>Hello</span>
        <span className="text-primary fw-bold" style={{fontSize:16}}>{userData.first_name}</span>
      </div>}
      <div className="p-1"><img id="homeButton" src={homeIcon} style={iconStyle} onClick={(e)=>handleMenuOption(e.target.id)}></img></div>
      <div className="p-1"><img id="menuButton" src={menuIcon} style={iconStyle} onClick={(e)=>setShowUserOptions(!showUserOptions)}></img></div>

      {showUserOptions &&
      <div className="d-flex position-absolute flex-column border border-1 rounded rounded-3 shadow shadow p-3" 
      style={menuStyle}
      onMouseLeave={()=>setShowUserOptions(false)}
      >
        <div className="d-flex flex-column flex-wrap mb-3 border-bottom">
            <div style={{fontSize: 12}}>Signed in:</div>
            <div className="fw-bold text-primary p-1" style={{fontSize: 12}}>{userData.full_name}</div>
        </div>

        <div className="d-flex flex-column flex-wrap mb-3 border-top-1">
            <button id="updateButton" name="updateButton" className="btn btn-light text-secondary mb-1 text-sm p-1" onClick={(e)=>handleMenuOption(e.target.id)}>Update Info</button>
            <button id="signOutButton" name="signOutButton" className="btn btn-light text-secondary mb-1 text-sm p-1" onClick={(e)=>handleMenuOption(e.target.id)}>Sign out</button>
        </div>
            
        </div>
      }
    </div>
  )
}

export default Header