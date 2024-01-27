import React, { useState, useEffect } from 'react';
import { askGPT } from './apis/axios.js'
import {toProperCase} from './functions/formatValue.js'
import axios,{getList} from './apis/axios.js'
import Spinner from './Spinner.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

import { Document, Page, pdfjs } from 'react-pdf';
import MultiInput from './MultiInput.js';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const GenAICreateSalesPitch = (props) => {

    const userData = props.user
    
    const [prompt, setPrompt] = useState("")
    const [response, setResponse] = useState("")
    const [waiting, setWaiting] = useState(false)
    const [formData, setFormData] = useState([])
    const [sections, setSections] = useState([])
    const [characterLimit, setCharacterLimit] = useState(300)
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const[businesses, setBusinesses] = useState([])
    const [pitchParams, setPitchParams] = useState({})


const getBusinesses = async ()=>{
  try{
      const response = await getList("businesses","registered_name")
      return(response.sort())
  }catch(error){
      console.log(error)
  }
}


const prepareFormData = async ()=>{

    let business_names = await getBusinesses()
    setBusinesses(business_names)

    const tones=[
      "Excited","Aggressive","Funny","Youthful","Diplomatic","Polite","Southern Hospitality","Conservative","Hip Hop","Surfer","Bro","Mafia"
    ]

    const generations=[
      "The Silent Generation (Born 1928-1945)",
      "Baby Boomers (Born 1946-1964)",
      "Generation X (Born 1965-1980)",
      "Millennials or Generation Y (Born 1981-1996)",
      "Generation Z or Zoomers (Born 1997-2012)",
      "Generation Alpha (Born after 2013)"
    ]

    const personalities =[
      "Jordan Belfort", 
      "Tony Robbins",
      "Kevin Hart",
      "Ellen DeGeneres",
      "Oprah Winfrey",
      "Barak Obama",
      "Suzie Orman",
      "Dwayne The Rock Johnson",
      "Kim Kardashian",
      "Leonardo DiCaprio",
      "Rob Dyrdek",
      "Donald Trump",
      "Snoop Dogg",
      "Joe Girard",
      "Zig Ziglar",
      "Dale Carnegie",
      "Brian Tracy", 
      "Tom Hopkins", 
      "Grant Cardone", 
      "David Ogilvy", 
      "Elmer Wheeler",
      "Frank Bettger",
    ]

    let form_data = [
        {id: 1, section: "style_and_approach", name: "use_the_following_tone", label: "What tone do you want to use?", list: tones, value:"Exited", type:"text"},
        {id: 2, section: "style_and_approach", name: "speak_like_a_person_in_this_generation", label: "What generational language style do you want to use?", list: generations, value:"Millennials or Generation Y (Born 1981-1996)", type:"text"},
        {id: 3, section: "style_and_approach", name: "speak_like_this_famous_person", label: "What celebrity personality do you want to emulate", list: personalities, value:"Kevin Hart", type:"text"},
        {id: 3, section: "style_and_approach", name: "use_temperature_setting_in_chat_gpt", label: "Creativity Level (temperature setting for chatGPT)", list: null, value:40, type:"number"},
        {id: 4, section: "deal_info", name: "what_is_being_sold", label: "What are you trying to sell?", list: null, value:"", type:"text"},
        {id: 5, section: "deal_info", name: "main_differentiator_for_our_offerings", label: "What are the main differentiators in your offering?", list: null, value:"",  type:"text"},
        {id: 6, section: "deal_info", name: "measurable_business_value_the_we_can_deliver", label: "What are the key measurable business values you can deliver?", list: null, value:"",  type:"test"},
        {id: 7, section: "deal_info", name: "why_the_prospect_should_buy_now", label: "Why is now a good time to buy?", list: null, value:"",  type:"test"},
        {id: 8, section: "deal_info", name: "additional_points_about_why_the_prospect_should_buy", label: "Provide additional arguments for why the prospect should buy", list: null, value:"",  type:"textarea"},
        {id: 9, section: "prospect_info", name: "potential_customers_company_name", label: "Prospect's company name", list: business_names, value:"",  type:"text"},
        {id: 10, section: "prospect_info", name: "contact_name_of_potential_customer", label: "Name of contact at the prospect", list: null, value:"", type:"text"},
        {id: 11, section: "prospect_info", name: "job_title_of_potential_customer", label: "Job title of the contact at the prospect", list: null, value:"", type:"text"},
        {id: 12, section: "my_company_info", name: "my_company_name", label: "Your company's name", list: null, value: userData.company_name,  type:"text"},
        {id: 13, section: "my_company_info", name: "my_name", label: "Your name", list: null, value:userData.full_name, type:"text"},
        {id: 14, section: "my_company_info", name: "my_job_title", label: "Your job title", list: null, value:userData.job_title, type:"text"},
      ]
      setFormData(form_data)

      let sectionSet = new Set()
      form_data.map(item=>{
        sectionSet.add(item.section)
      })
      let sectionList = Array.from(sectionSet);
      setSections(sectionList)
}

  useEffect(()=>{
    prepareFormData()
  },[props])


  const createPitch = async(e)=>{
    
    e.preventDefault()
    setResponse("")
    setWaiting(true)

    let conditionList = ""
    Object.entries(pitchParams).map(([key,value], index)=>{
      if(index==0){
        conditionList = `${key.replaceAll("_"," ")}:${value}`
      }else{
        conditionList = `${conditionList}, ${key.replaceAll("_"," ")}:${value}`
      }
    })
    console.log(conditionList)

    const prompt = `please generate a sales pitch based on the following conditions: ${conditionList}`
    console.log(prompt)
    
    try{
        const result = await askGPT(prompt)
        console.log(result.data)
        setResponse(result.data)
        setWaiting(false)
    }catch(error){
      console.log(error)
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

const handlePageChange = (e)=>{
  const {name,value} = e.target
  name=="nextButton" && setPageNumber(Math.floor(pageNumber+1,numPages))
  name=="backButton" && setPageNumber(Math.ceil(pageNumber-1,1))
}

const handleInputChange = (e)=>{
    const {name,value} = e.target
    setPitchParams({...pitchParams,...{[name]:value}})
}

  return (
    <div className="d-flex justify-content-center w-100">
      {/* File Config and Preview */}
      <div className="d-flex flex-column p-3" style={{width: "40%", minWidth:500}}>
          <div className="d-flex flex-column bg-light p-3 rounded-3 shadow">
            <h6>Please complete the following information:</h6>
          <form>
            {/* Form Input */}
            <div className="d-flex flex-column" style={{height: 500, overflowY:"auto"}}>
                {sections.map((section,index)=>(
                    <div className="d-flex flex-column p-1">
                        {toProperCase(section.replaceAll("_"," "))}
                    {
                    formData && formData.map((item,index)=>(
                        item.section == section &&
                            <MultiInput 
                            key={item.id}
                            id={item.name}
                            name={item.name}
                            label={item.label}
                            value={item.value}
                            list = {item.list ? item.list : []}
                            type={item.type}
                            onChange={(e)=>handleInputChange(e)}
                        />
                    ))
                    }
                    </div>
                ))
            }
            </div>


            {/* create pitch */}
            <div className="d-flex justify-content-center mt-3" style={{width: "100%"}}>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button id="createPitchButton" className="btn btn-primary" onClick={createPitch}>Create Pitch</button>
                </div>
            </div>
          </form>
          </div>
      </div>

       {/* Summary */}
       {response.length>0 && (
        <div className="d-flex flex-column p-3 animate__animated animate__fadeIn aniamte__duration-0.5s" style={{width: "60%", minWidth:400, overflowY:"auto"}}>
            <div className="d-flex flex-column p-3 border rounded rounded-3" 
            style={{height: "90%", backgroundColor: "rgba(255,255,255,0.75"}}>
                <h5>Result: </h5>
                <textarea style={{fontSize:"16px", fontFamily:"verdana"}} rows={40} className = "form-control"  readonly>{response}</textarea>
            </div>
          </div>
      )}

      {
        waiting && 
        <div className="d-flex flex-column justify-content-center bg-light shadow p-3 text-center border border-3 rounded-3" style={waitingModalStyle}>
            <Spinner/>
            <div>ChatGPT is working on a response.</div> 
            <div>Please wait...</div> 
        </div>
      }
    </div>
  );
};

export default GenAICreateSalesPitch;