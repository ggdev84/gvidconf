export const changeruserdata = (payload)=>{
    return {
        type:"CHANGEUSERDATA",
        payload
    }
}

export const changesock = (payload)=>{
    return{
        type:"CHANGESOCK",
        payload
    }
}

export const addmessage = (payload)=>{
    return{
        type:"ADDMESSAGE",
        payload
    }
}