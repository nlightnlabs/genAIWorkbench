import React, { useState } from 'react';
import { askGPT } from './apis/axios'
import axios from 'axios'
import Spinner from './Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

import { Document, Page, pdfjs } from 'react-pdf';
import MultiInput from './MultiInput';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const GenAISummarizeDocument = () => {

  const [formData, setFormData] = useState({})
  const [waiting, setWaiting] = useState(false)

  const [characterLimit, setCharacterLimit] = useState(300)
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfText, setPdfText] = useState('');
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);

  const [selectedOption, setSelectedOption] = useState("View & Extract")
  // const [preview, setPreview] = useState(true)
  // const [extract, setExtract] = useState(false)

  const [summary, setSummary] = useState("")

  const summarize = async(documentText)=>{

    const prompt = `please summarize this text in less than 300 characters: ${documentText}`
    
    try{
      const response = await axios.post(`http://localhost:3001/gpt`,{prompt})
      const result = await response.data
      console.log(result)
      setSummary(result)
    }catch(error){
      console.log(error)
    }

    function updateSummary(result){
      console.log(`updating...${result}`)
        setSummary(result)
      }
  }

  function handleFileChange(event) {
    event.preventDefault()
    
    const selectedFile = event.target.files[0];
    setFileType(selectedFile.type)

    if(selectedFile.type == "application/pdf"){
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = async function (event) {
        const typedArray = new Uint8Array(event.target.result);
        const pdf = await pdfjs.getDocument(typedArray).promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const textItems = textContent.items.map((item) => item.str);
          const pageText = textItems.join(' ');
          fullText += pageText + '\n';
        }
        setPdfText(fullText);
        setNumPages(pdf.numPages);
      };
    reader.readAsArrayBuffer(selectedFile);
    }else{
      alert(`Can not read ${fileType} file type. Please upload a PDF file only.`)
      setFile(null)
    }
  }

const handleSummarize = async(e)=>{
  e.preventDefault()
  if(file && fileType=="application/pdf"){
    setSummary("")
    setWaiting(true)
    let prompt = `Summarize the following text from a document in less than ${characterLimit} characters: ${pdfText}`
    try{
        const result = await askGPT(prompt)
        console.log(result.data)
        setSummary(result.data)
        setWaiting(false)
    }catch(error){
        console.log(error)
        setWaiting(false)
    }
  }else{
    alert("No file has been uploaded")
  }
}
  

const waitingModalStyle={
  position: "fixed", 
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: "300px", 
  width: "25%vw", 
  top: "30vh",
  fontSize: "24px",
  fontWeight: "bold",
  zIndex: 999,
  cursor: "grab",
}

const handlePageChange = (e)=>{
  e.preventDefault()
  const {name,value} = e.target
  name=="nextButton" && setPageNumber(Math.floor(pageNumber+1,numPages))
  name=="backButton" && setPageNumber(Math.ceil(pageNumber-1,1))
}

  return (
    <div className="d-flex justify-content-center w-100">
      {/* File Config and Preview */}
      <div className="d-flex flex-column p-3" style={{minWidth: "50%"}}>
          <div className="d-flex flex-column bg-light p-3 rounded-3 shadow">
          <form>
            {/* File Input */}
            <div className="row align-items-center">
              <div className="form-group">
                <div className="col-sm-12">
                  <input 
                    id="file"
                    name="file"
                    className="form-control" 
                    type="file" 
                    style={{ color: "rgb(0,100,255)" }} 
                    onChange={handleFileChange} 
                    />
                </div>
                <p className="ms-1" style={{fontSize:"14px", color: "red"}}><span style={{fontWeight: "bold", color: "black"}}>Note: </span>Must be a PDF (Non Image Scan) File</p>
              </div>
            </div>

             {/* Character Limit */}
             <div className="mb-3 row align-items-center">
              <label htmlFor="character_limit" className="ms-1 col-sm-2 col-form-label">Character limit:</label>
              <div className="col-sm-2">
                <input
                  id="character_limit"
                  name="character_limit"
                  className="form-control"
                  type="number"
                  value={characterLimit}
                  onChange={(e) => setCharacterLimit(e.target.value)}
                  style={{ color: "rgb(0,100,255)" }}
                />
              </div>
            </div>

            {/* Initate summary */}
            <div className="d-flex justify-content-center mt-1" style={{width: "100%"}}>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button id="askButton" className="btn btn-primary" onClick={handleSummarize}>Summarize</button>
                </div>
            </div>
          </form>
          </div>
          {file &&
              <div className="d-flex flex-column p-3 rounded-3 shadow mt-3" style={{maxHeight:"400px", overflowY:"auto", backgroundColor: "rgba(255,255,255,0.75"}}>
                <div className="d-flex justify-content-between">
                  <h5>Preview: </h5>
                  <p>
                    Page {pageNumber} of {numPages}
                  </p>
                  <form>
                    <div className="btn-group">
                      {pageNumber>1 && <button name="backButton" className="btn text-secondary" onClick={handlePageChange}>{"Back"}</button>}
                      {pageNumber<numPages && <button name="nextButton" className="btn text-secondary" onClick={handlePageChange}>{"Next"}</button>}
                    </div>
                  </form>
                </div>
                {}
                <Document file={file}>
                    <Page pageNumber={pageNumber} />
                </Document>
              </div>
          }
      </div>

       {/* Summary */}
       {file && summary.length>0 && (
        <div className="d-flex flex-column p-3 w-50 animate__animated animate__fadeIn aniamte__duration-0.5s">
            <div className="d-flex flex-column p-3 border rounded rounded-3" 
            style={{maxHeight: "500px", backgroundColor: "rgba(255,255,255,0.75"}}>
                <h5>Summary: </h5>
                <textarea rows={20} className = "form-control"  readonly>{summary}</textarea>
            </div>
          </div>
      )}

      {waiting &&
        <div className="d-flex flex-column justify-content-center bg-light shadow p-3 text-center border border-3 rounded-3" style={waitingModalStyle}>
            <Spinner/>
            <div>ChatGPT is working on a response.</div> 
            <div>Please wait...</div> 
        </div>
        }
    </div>
  );
};

export default GenAISummarizeDocument;
