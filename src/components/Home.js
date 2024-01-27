import React, {useState, useEffect, useRef, useContext} from 'react'
import {Context } from './Context';
import {appIcons} from './apis/icons.js'
import GenAIGenerateImage from './GenAIGenerateImage.js'
import GenAIAskQuestion from './GenAIAskQuestion.js'
import GenAISummarizeDocument from './GenAISummarizeDocument.js'
import "bootstrap/dist/css/bootstrap.min.css"
import GenAIScanInvoice from './GenAIScanInvoice.js'
import GenAICreateContract from './GenAICreateContract.js'
import GenAICreateSalesPitch from './GenAICreateSalesPitch.js';


const Home = (props) => {

    const {user, appData} = useContext(Context)

    const [taskType, setTaskType] = useState("Ask Question")

    // This segment auto sizes the content height according to the window height
    const contentContainerRef = useRef();
    const [contentContainerHeight, setContentContainerHeight] = useState(0)

    useEffect(()=>{
        if (contentContainerRef.current) {
            setContentContainerHeight(window.innerHeight - contentContainerRef.current.getBoundingClientRect().top);
        }
    },[window.innerHeight, window.innerWidth])


 const pageStyle={width:"100%", height: "100%", overflow: "hidden"}
 const titleStyle={fontSize: "32px", fontWeight: "bold"}
 const pageClass = "flex-container animate__animated animate__fadeIn animate__duration-0.5s"

 const menuButtonStyle = {
    fontSize: "14px"
 }

  return (
    <div className={pageClass} style={pageStyle}>

        <div className="d-flex p-3 bg-white">
            <img src={`${appIcons}/genAI_icon.png`} style={{height: "50px", width: "50px"}} alt="Gen AI Icon"></img>
            <div style={titleStyle}>GenAI Workbench</div>
        </div>
        
        <div className="d-flex" style={{width: "100%", height: "100%", overflow:"hidden", backgroundImage:"linear-gradient(180deg, white, rgba(0,200,0,0.25),rgba(0,0,220,0.25), rgba(200,0,220,0.25)"}}>
            <div 
                className="d-flex flex-column p-3" 
                style={{width: 250, height: "100%", backgroundColor: "rgba(255,255,255,0.5)"}}
            >
                <button id="askButton" className="btn btn-outline-success mb-3" style={menuButtonStyle}  onClick={(e)=>setTaskType("Ask Question")}>Ask Question</button>
                <button id="summarizeDocumentButton" className="btn btn-outline-success mb-3" style={menuButtonStyle}  onClick={(e)=>setTaskType("Summarize Document")}>Summarize Document</button>
                <button id="generateImageButton" className="btn btn-outline-success mb-3" style={menuButtonStyle} onClick={(e)=>setTaskType("Generate Image")}>Generate Image</button>
                <button id="scanInvoiceButton" className="btn btn-outline-success mb-3" style={menuButtonStyle} onClick={(e)=>setTaskType("Scan Invoice")}>Scan Invoice</button>
                <button id="generateImageButton" className="btn btn-outline-success mb-3" style={menuButtonStyle} onClick={(e)=>setTaskType("Create Contract")}>Create Contract</button>
                <button id="createSalesPitchButton" className="btn btn-outline-success mb-3" style={menuButtonStyle} onClick={(e)=>setTaskType("Create Sales Pitch")}>Create Sales Pitch</button>
                <button id="analyzeSpendButton" className="btn btn-outline-success mb-3" style={menuButtonStyle} onClick={(e)=>setTaskType("Analyze Spend")}>Analyze Spend</button>
                <button id="prepareBudgetButton" className="btn btn-outline-success mb-3" style={menuButtonStyle} onClick={(e)=>setTaskType("Prepare Budget")}>Prepare Budget</button>
                <button id="prepareSourcingEventButton" className="btn btn-outline-success mb-3" style={menuButtonStyle} onClick={(e)=>setTaskType("Prepare Sourcing Event")}>Prepare Sourcing Event</button>
            </div>
            
            <div className="d-flex w-100 flex-column">

                <div className = "d-flex justify-content-center mb-3" style={{fontSize: "24px", fontWeight: "bold"}}>{taskType}</div>
                
                <div ref={contentContainerRef} className="d-flex justify-content-center" style={{height: contentContainerHeight, overflowY:"auto"}}>
                {
                taskType=="Ask Question" ?
                    <GenAIAskQuestion/>
                :
                taskType=="Generate Image" ?
                    <GenAIGenerateImage/>
                :
                taskType == "Scan Invoice"?
                    <GenAIScanInvoice 
                        user={user}
                        appData={appData}
                    />
                :
                taskType == "Summarize Document"?
                    <GenAISummarizeDocument />   
                :
                taskType == "Create Contract"?
                    <GenAICreateContract 
                        user={appData.user_info}
                        appData={appData}
                    />
                :
                taskType == "Create Sales Pitch"?
                    <GenAICreateSalesPitch 
                        user={appData.user_info}
                        appData={appData}
                    />  
                :
                    <div>Comming soon</div>
                }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Home