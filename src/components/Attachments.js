import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react'

const Attachments = (props) => {

    const id=props.id
    const name=props.name
    const onChange = props.onChange
    const currentAttachments = props.currentAttachments
    const prepareAttachments = props.prepareAttachments
    const userData = props.userData || []
    const [attachments, setAttachments] = useState([])
    const readonly= props.readonly
    const disabled= props.disabled
    const required = props.required

    const valueColor = props.valueColor

    const inputProps = {
      readOnly: readonly || false,
      disabled: disabled || false,
      required: required || false,
      multiple: true 
    }

    const getAttachmentData=(attachmentString)=>{
      console.log(attachmentString)
      console.log(typeof attachmentString)
        try{
          if(attachmentString.length>0){
            setAttachments(JSON.parse(attachmentString))
          }
        }catch(error){
          console.log(error)
        }
      }
    

    let fileData=[]
    useEffect(()=>{
      getAttachmentData(props.currentAttachments)
    },[props.currentAttachments])


    const handleChange = async (e)=>{ 
        
        if(e.target.files.length >0){
            e.target.className="form-control text-primary"
          }else{
            e.target.className="form-control text-body-tertiary"
          }  
        const fileList = Array.from(e.target.files)
        
        fileList.forEach(item=>{
          let att = {name: item.name, type: item.type, size: item.size, url: "",  data: item}
          fileData.push(att)
        })
        setAttachments(fileData)

        if(typeof onChange =="function"){
            let target = {
              ...props,
              value: fileData,
            }
            onChange({target})
          }
        prepareAttachments(fileData)
    }

    

  return (
    <div className="form-group">
      <label className="form-label">Attachments:</label>
      <input 
          id={id}
          name={name}  
          type="file" 
          onChange={(e)=>handleChange(e)}
          className="form-control"
          multiple 
          {...inputProps}
          >    
      </input>
      {attachments.length>0? 
          <div className="d-flex flex-column mt-1 p-2 text-primary border border-1 rounded-3">
          {attachments.length>0 && Array.isArray(attachments) && 
          <table className="table table-striped table-borderless p-0" style={{fontSize: 12}}>
            <thead className="position-sticky top-0">
              <tr className="position-sticky top-0 bg-light">
                <th scope="col" className="p-1">File Name</th>
                <th scope="col" className="p-1">Type</th>
                <th scope="col" className="p-1">Size</th>
              </tr>
            </thead>
            <tbody>
            {attachments.map((item,attIndex)=>(
                <tr key={attIndex}>
                  <td className="p-1" style={{padding:0, color: "blue", fontWeight: "bold"}}>
                    {(item.url).length>1 ? <a href={item.url}>{item.name}</a> : item.name}
                  </td>
                  <td className="p-1" style={{padding:0}}>{item.type}</td>
                  <td className="p-1" style={{padding:0}}>{Math.round(Number(item.size)/1000,1)} KB</td>
                </tr>
            ))}
            </tbody>
          </table>
          }
      </div>
      :
      null
      }
    </div>
  )
}

export default Attachments