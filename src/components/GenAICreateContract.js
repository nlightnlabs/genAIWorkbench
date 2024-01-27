import React, { useState, useEffect } from 'react';
import { askGPT } from './apis/axios'
import {toProperCase} from './functions/formatValue'
import axios,{getList} from './apis/axios.js'
import Spinner from './Spinner'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

import { Document, Page, pdfjs } from 'react-pdf';
import MultiInput from './MultiInput';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const GenAICreateContract = (props) => {

    const userData = props.user
    
    const [prompt, setPrompt] = useState("")
    const [response, setResponse] = useState("")
    const [waiting, setWaiting] = useState(false)
    const [formData, setFormData] = useState([])
    const [sections, setSections] = useState([])
    const [characterLimit, setCharacterLimit] = useState(300)
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const[contractTypes, setContractTypes] = useState([])
    const[businesses, setBusinesses] = useState([])
    const [contractParams, setContractParams] = useState({})


const getBusinesses = async ()=>{
try{
    const response = await getList("businesses","registered_name")
    return(response.sort())
}catch(error){
    console.log(error)
}
}

  const getContractTypes = async ()=>{
    try{
        const response = await getList("contract_types","contract_type")
        return(response)
    }catch(error){
        console.log(error)
    }
  }

const prepareFormData = async ()=>{

    let contract_types = await getContractTypes()
    setContractTypes(contract_types)

    let business_names = await getBusinesses()
    setBusinesses(business_names)

    let form_data = [
        {id: 1, section: "contract_details", name: "type", label: "What type of contract is this?", list: await contract_types, value:"", type:"text"},
        {id: 2, section: "contract_details", name: "term_length", label: "How long is the contract for?", list: null, value:"",  type:"text"},
        {id: 3, section: "contract_details", name: "effective_date", label: "What is the effective start date?", list: null, value:"",  type:"date"},
        {id: 4, section: "contract_details", name: "contract_description_terms_and_notes", label: "Description about the terms and notes", list: null, value:"",  type:"textarea"},
        {id: 5, section: "counter_party_info", name: "counter_party_company_name", label: "Company name to be on contract", list: business_names, value:"",  type:"text"},
        {id: 6, section: "counter_party_info", name: "counter_party_representative_name", label: "Name of contract owner at the counter party", list: null, value:"", type:"text"},
        {id: 7, section: "counter_party_info", name: "counter_party_representative_title", label: "Title of contract at the counter party", list: null, value:"", type:"text"},
        {id: 8, section: "my_company_info", name: "my_company_name", label: "Company name to be on contract", list: null, value: userData.company_name,  type:"text"},
        {id: 9, section: "my_company_info", name: "my_company_representative_name", label: "Name of contract owner", list: null, value:userData.full_name, type:"text"},
        {id: 10, section: "my_company_info", name: "my_company_representative_title", label: "Title of the contract owner", list: null, value:userData.job_title, type:"text"},
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


  const generateContract = async(e)=>{
    
    e.preventDefault()
    setResponse("")
    setWaiting(true)
    
    console.log(JSON.stringify(contractParams))
    const prompt = `please generate a contract with conditions identified in this json object: ${JSON.stringify(contractParams)}`
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
    setContractParams({...contractParams,...{[name]:value}})
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
                            name={item.label}
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


            {/* generate contract */}
            <div className="d-flex justify-content-center mt-3" style={{width: "100%"}}>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button id="askButton" className="btn btn-primary" onClick={generateContract}>Generate Contract</button>
                </div>
            </div>
          </form>
          </div>
      </div>

       {/* Summary */}
       {response.length>0 && (
        <div className="d-flex flex-column p-3 animate__animated animate__fadeIn aniamte__duration-0.5s" style={{width: "60%", minWidth:400, overflowY:"auto"}}>
            <div className="d-flex flex-column p-3 border rounded rounded-3" 
            style={{height: 500, backgroundColor: "rgba(255,255,255,0.75"}}>
                <h5>Result: </h5>
                <textarea style={{fontSize:"12px"}} rows={40} className = "form-control"  readonly>{response}</textarea>
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

export default GenAICreateContract;