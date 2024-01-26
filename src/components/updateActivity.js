import axios from './apis/axios.js'

const updateActivity = async (req,res)=>{

    // req should include the follow arguments: app, record, user, description

    const {app, record, user, description} = req

    const params={
        table:"activities",
        columns: ['"app"', '"record_id"', '"user"', '"description"'],
        values: [app,record,user,description]
    }
    const response = await axios.post(`/db/addRecord`,{params})
    console.log(response)

}

export default updateActivity