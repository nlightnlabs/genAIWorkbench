import React, {useState, useEffect, useRef} from 'react'
import { scanInvoice } from './apis/axios'
import {toProperCase} from './functions/formatValue'
import { Document, Page, pdfjs } from 'react-pdf';
import MultiInput from './MultiInput';
import NewRecordForm from './NewRecordForm';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const GenAIScanInvoice = (props) => {

    const user = props.user
    const appData = props.appData

    const [formData, setFormData] = useState({
        supplier_name:"",
        subject:"",
        total_invoice_amount:"",
        invoice_date:"",
        payment_due_date:"",
        supplier_contact_full_name:"",
        supplier_email:"",
        supplier_phone_number:"",
        notes:""
    })
    const [response, setResponse] = useState(null)
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfText, setPdfText] = useState('');
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState(null);

    const uploadFilesRef = useRef()

    const [waiting, setWaiting] = useState(false)

    const handleFileChange = (e)=>{

        e.preventDefault()
        setFile(e.target.files[0]);

        const selectedFile = e.target.files[0];
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
            reader.readAsArrayBuffer(e.target.files[0]);
        }else{
            alert(`Can not scan ${selectedFile.type} file type.  Please upload a PDF file.`)
        }
    }

    const handleScan = async(e)=>{
        e.preventDefault()
        setResponse("")
        setWaiting(true)
        
        const args = {
            documentText: pdfText,
            record: formData
        }

        try{
            const result = await scanInvoice({args})
            console.log(result)
            setResponse(result)
            setFormData(result)
            setWaiting(false)
        }catch(error){
            console.log(error)
            setWaiting(false)
        }
    }

    const handlePageChange = (e)=>{
        e.preventDefault()
        const {name,value} = e.target
        name=="nextButton" && setPageNumber(Math.floor(pageNumber+1,numPages))
        name=="backButton" && setPageNumber(Math.ceil(pageNumber-1,1))
      }

      const handleInputChange=(e)=>{
        const {name,value} = e.target
        console.log({...formData,...{[name]:value}})
        setFormData({...formData,...{[name]:value}})
      }

    const handleSaveInvoice = ()=>{
        console.log(formData)
    }

      const waitingModalStyle={
        position: "absolute", 
        height: "200px", 
        width: "300px", 
        top: "30vh",
        left: Number("50vw") - Number(150/2),
        fontSize: "16px",
        fontWeight: "bold",
        zIndex: 10
      }


  return (
    <div className="d-flex justify-content-center w-100">
      {/* File Config and Preview */}
      <div className="d-flex flex-column p-3" style={{width: "50%"}}>
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
                <p className="ms-1" style={{fontSize:"14px", color: "red"}}><span style={{fontWeight: "bold", color: "black"}}>Note: </span>Must be a PDF File</p>
              </div>
            </div>

            {/* Initate summary */}
            <div className="d-flex justify-content-center mt-1" style={{width: "100%"}}>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button id="askButton" className="btn btn-primary" onClick={handleScan}>Scan</button>
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
       {file && response && (
        <div className="d-flex flex-column p-3 w-50 animate__animated animate__fadeIn aniamte__duration-0.5s">
            <div className="d-flex flex-column p-3 border rounded rounded-3"
            style={{maxHeight: "90%", backgroundColor: "rgba(255,255,255,0.75"}}>
                <h5>Review and Edit Scanned Details: </h5>
                <div className="d-flex flex-column p-3" style={{height: "90%", overflowY:"auto"}}>
                {Object.entries(formData).map(([key,value])=>(
                    <MultiInput
                        key={key}
                        id={key}
                        name={key}
                        label={toProperCase(key.replaceAll("_"," "))}
                        value={value}
                        onChange={handleInputChange}
                        marginBottom={"10px"}
                    />
                ))
                }
                </div>
            </div>
          </div>
      )}

      {/* Waiting Modal */}
      {
        waiting && 
        <div className="d-flex bg-light shadow p-3 text-center border border-3 rounded-3" style={waitingModalStyle}>
            ChatGPT is working on the summary.  Please wait a few moments...
        </div>
      }
    </div>
  )
}

export default GenAIScanInvoice