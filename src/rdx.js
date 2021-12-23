export const window = (state="landingpage", action)=>{
    if(action.type==="CHANGEWINDOW"){
        state=action.payload
    }
    return state
}

export const mainwindow = (state="home", action)=>{
    if(action.type==="CHANGEMAINWINDOW"){
        state=action.payload
    }
    return state
}

let tmpuserdata = {
    friends:[],
    name:"",
    token:"",
    receivedFriendsRequests:[],
    sentFriendsRequests:[],
    messages:[],
    email:""
}

export const userdata = (state=tmpuserdata, action)=>{
    if(action.type==="CHANGEUSERDATA"){
        let data  = action.payload
        state={
            ...state,
            friends:data.friends,
            name:data.name,
            token:data.token,
            receivedFriendsRequests:data.receivedFriendsRequests,
            sentFriendsRequests:data.sentFriendsRequests,
            messages:data.messages,
            email:data.email
        }
    }
    if(action.type==="ADDMESSAGE"){
        state ={
            ...state,
            messages:[...state.messages, action.payload]
        }
    }
    return state
}

export const update = (state=0, action)=>{
    if(action.type ==="UPDATE"){
        state+=1
    }
    return state
}

export const sock = (state={sock:{}}, action)=>{
    if(action.type==="CHANGESOCK"){
        state={
            ...state,
            sock:action.payload
        }
    }
    return state
}