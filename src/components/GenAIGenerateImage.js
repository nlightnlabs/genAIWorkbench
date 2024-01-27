import React, {useState, useEffect, useRef} from 'react'
import { generateImage } from './apis/axios'
import Draggable from 'react-draggable'
import Spinner from './Spinner'

const GenAIGenerateImage = () => {
    const [prompt, setPrompt] = useState("")
    const [response, setResponse] = useState(null)
    const [waiting, setWaiting] = useState(false)
    const promptRef = useRef()
    const modalRef = useRef()
    const responseRef = useRef()

    // const [responseHeight, setResponseHeight] = useState(0)
    // useEffect(()=>{
    //     setResponseHeight(window.innerHeight - responseRef.current.offsetTop-20)
    // },[window.innerWidth, window.innerHeight])

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

    
  return (
    <div className="d-flex w-100 justify-content-around animate__animated animate__fadeIn animate__duration-0.5s">

        <div className="d-flex flex-column m-3" style={{width: "30%", minWidth: "300px"}}>
            <div className="d-flex flex-column bg-light border border-3 p-3 rounded-3 shadow">
                <textarea
                    id='prompt'
                    name='prompt'
                    value={prompt}
                    placeholder={"Describe in detail the image you need"}
                    onChange={(e)=>setPrompt(e.target.value)}
                    style={{fontSize: "16px", color: "rgb(100,150,255", outline: "none", width: "100%", height:"150px", minHeight:"100px"}}
                    className="border rounded-3 p-3"
                >
                </textarea>
                <div className="d-flex justify-content-center mt-1" style={{width: "100%"}}>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button id="askButton" className="btn btn-primary" onClick={(e)=>handleSubmit(true)}>Generate</button>
                </div>
            </div>
            </div>
        </div>

        {response &&
            <div ref={responseRef} className="d-flex flex-column bg-light border border-3 p-3 rounded-3 shadow m-3" style={{width: "70%", minWidth: "300px"}}>
                <img src={response} alt="image response" style={{color: "#70AD47", fontWeight: 'bold', width: "100%", height:"auto", zIndex:0}}></img>
            </div>
        }

       {waiting &&
        <div ref={modalRef} className="d-flex flex-column justify-content-center bg-light shadow p-3 text-center border border-3 rounded-3" style={waitingModalStyle}>
            <Spinner/>
            <div>ChatGPT is working on a response.</div> 
            <div>Please wait...</div> 
        </div>
        }
            
    </div>
  )
}

export default GenAIGenerateImage