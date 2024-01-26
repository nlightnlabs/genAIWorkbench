import React, {useState, useContext} from 'react'
import {Context} from './Context.js'
import axios from './apis/axios.js'
import fileServer from "./fileServer.js"

const Upload = (e) => {

  const {page, setPage} = useContext(Context)
  const {formData, setFormData} = useContext(Context)
  const {attachments, setAttachments} = useContext(Context)

  const [files, setFiles] = useState(null)

  let fileData = []

  const uploadFile = async (e)=>{

    e.preventDefault()

    const fileList = Array.from(files)

    if(fileList.length>0){

      fileList.forEach(file=>{
        let fileName = file.name.replaceAll(" ","_").replaceAll("%","pct").replaceAll("&","and").toLowerCase()
        console.log(fileName)
        
        const upload = async (req, res)=>{

        //get secure url from our server
        const response = await fileServer.get(`/s3Url/${fileName}`)
        console.log(response)
        const url = await response.data
        console.log(url)

        //Post file directly to s3 bucket
        await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            body: file
        })

        const fileURL = url.split('?')[0]
        console.log(fileURL)

        let data = {name: fileName, type: file.type, url: fileURL}
        fileData.push(data)
      }
      upload()
    })
  }
  setAttachments(fileData)
  setFormData({...formData,["attachments"]:fileData})
}

  return (
    <div className="row align-content-center">
        <form>
          <div className="form-group">
            <input className = "form-control" type="file" onChange={(e)=>{setFiles(e.target.files)}} multiple></input>    
            <button type="submit" onClick={(e)=>uploadFile(e)}>Upload</button>
          </div>
        </form>
    </div>
  )
}

export default Upload