import React, {useState, useEffect} from 'react'
import { generateImage } from './apis/axios'

const GenAIGenerateImage = () => {
    const [prompt, setPrompt] = useState("")
    const [response, setResponse] = useState(null)
    const [waiting, setWaiting] = useState(false)


    const handleSubmit = async(e)=>{
        
        setResponse(null)
        setWaiting(true)

        try{
            const result = await generateImage(prompt)
            // console.log(result)
            setResponse(result)
            setWaiting(false)
        }catch(error){
            console.log(error)
            setWaiting(false)
        }
  
    }

    const waitingModalStyle={
        position: "absolute", 
        height: 200, 
        width: 300, 
        top: "30vh",
        left: "50vw" - 75,
        fontSize: "20px",
        fontWeight: "bold",
        zIndex: 10
     }

  return (
    <div className="d-flex w-100 animate__animated animate__fadeIn animate__duration-0.5s">

        <div></div>

        <div className="d-flex flex-column w-100">
            <div className="d-flex justify-content-center">
                <div className="d-flex flex-column bg-light border border-3 p-3 rounded-3 shadow" style={{width: "50%"}}>
                    <textarea
                        id='prompt'
                        name='prompt'
                        value={prompt}
                        onChange={(e)=>setPrompt(e.target.value)}
                        style={{fontSize: "16px", color: "rgb(100,150,255", outline: "none", width: "100%", minHeight:"100px"}}
                        className="border rounded-3 p-3"
                    >
                    </textarea>
                    <div className="d-flex justify-content-center mt-1" style={{width: "100%"}}>
                        <div class="btn-group" role="group" aria-label="Basic example">
                            <button id="askButton" className="btn btn-primary" onClick={(e)=>handleSubmit(true)}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
            {response &&
            <div className="d-flex flex-column p-3 rounded-3 shadow mt-3" style={{backgroundColor:"rgba(255,255,255,0.75"}}>
                <img src={response} alt="image response" style={{color: "#70AD47", fontWeight: 'bold', width: "100%", height:"auto"}}></img>
            </div>
            }
        </div>

       

        {
            waiting && 
            <div className="d-flex bg-light shadow p-3 text-center border border-3 rounded-3" style={waitingModalStyle}>
                ChatGPT is working on a response.  Please wait a few moments...
            </div>
        } 
        
    </div>
  )
}

export default GenAIGenerateImage