import React, {useState, useEffect} from 'react'
import { askGPT } from './apis/axios'
import {appIcons, generalIcons} from './apis/icons.js'
import Spinner from './Spinner.js'

const GenAIAskQuestion = () => {
  const [prompt, setPrompt] = useState("")
  const [thread, setThread] = useState([])
  const [response, setResponse] = useState("")
  const [waiting, setWaiting] = useState(false)

  const handleSubmit = async(e)=>{
        
    setResponse("")
    setWaiting(true)

    try{
        const result = await askGPT(prompt)
        console.log(result.data)
        setResponse(result.data)
        let dialogue = {prompt:prompt,response:result.data}
        setThread([...thread,dialogue])
        setWaiting(false)
    }catch(error){
        console.log(error)
        setWaiting(false)
    }
}

const handleRefresh=()=>{
    setThread([])
    setResponse("")
    setPrompt("")
}

const handleSave=()=>{
    alert("Chat saved")
}

const threadPromptStyle={
    fontSize: "14px",
    backgroundImage: "linear-gradient(180deg, rgb(200,200,255),rgb(100,150,255),rgb(100,150,255)",
    color: "white"
}

const threadResponseStyle={
    fontSize: "14px",
    backgroundImage: "linear-gradient(180deg, rgb(200,230,200),rgb(100,200,100),rgb(0,180,0)",
    color: "white"
}

const waitingModalStyle={
    position: "fixed", 
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: "300px", 
    width: "25vw", 
    top: "30vh",
    fontSize: "24px",
    fontWeight: "bold",
    zIndex: 999,
    cursor: "grab",
  }

const buttonIconStyle={
    height: 20,
    width: 20,
    cursor: "pointer"
}

  return (
    <div className="d-flex w-100 justify-content-center animate__animated animate__fadeIn animate__duration-0.5s">
        <div className="d-flex flex-column m-3" style={{ maxHeight: "90%", overflowY:"auto", width: "30%", minWidth: "300px"}}>
            <div className="d-flex flex-column bg-light border border-3 p-3 rounded-3 shadow">
                <textarea
                    id='prompt'
                    name='prompt'
                    value={prompt}
                    placeholder="Please enter a detailed question"
                    onChange={(e)=>setPrompt(e.target.value)}
                    style={{fontSize: "16px", color: "rgb(100,150,255", outline: "none", width: "100%", minHeight:"200px"}}
                    className="border rounded-3 p-3"
                >
                </textarea>
                <div className="d-flex justify-content-center mt-1" style={{width: "100%"}}>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button id="askButton" className="btn btn-primary" onClick={(e)=>handleSubmit(true)}>Submit</button>
                    </div>
                </div>
            </div>
            {response.length>0 &&
            <div className="d-flex flex-column p-3 rounded-3 shadow mt-3" style={{backgroundColor:"rgba(255,255,255,0.75"}}>
                <span style={{fontSize: "16px", color: "rgb(0,150,0)"}}>{response}</span>
            </div>
            }
        </div>
        {thread.length>0 &&
            <div className="d=flex flex-column rounded-3 p-3 m-3 animate__animated animate__fadeIn animate__duration-0.5s" 
            style={{backgroundColor:"rgba(255,255,255,0.5", maxHeight: "90%", overflowY:"auto", width: "30%", minWidth: "300px"}}>
                <div className="d-flex justify-content-end w-100 mb-3">
                    <img src={`${generalIcons}/save_icon.png`} style={buttonIconStyle} onClick={handleSave}></img>
                    <img src={`${appIcons}/trash_icon.png`} style={buttonIconStyle} onClick={handleRefresh}></img>
                </div>
                {thread.map((item,index)=>(
                    <div className="d-flex flex-column w-100 mb-3 animate__animated animate__fadeIn animate__duration-0.5s" key={index}>
                        <div className="d-flex justify-content-start">
                            <div className="w-75 p-3 mb-3 rounded-3 shadow" style={threadPromptStyle}>{item.prompt}</div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <div className="w-75 text-white p-3 rounded-3 shadow" style={threadResponseStyle}>{item.response}</div>
                        </div>
                    </div>
                ))
                }
            </div>
        }
        

        {waiting &&
        <div className="d-flex flex-column justify-content-center bg-light shadow p-3 text-center border border-3 rounded-3" style={waitingModalStyle}>
            <Spinner/>
            <div>ChatGPT is working on a response.</div> 
            <div>Please wait...</div> 
        </div>
        }
        
    </div>
  )
}

export default GenAIAskQuestion