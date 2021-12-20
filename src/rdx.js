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

export const userdata = (state={userdata:tmpuserdata}, action)=>{
    if(action.type==="CHANGEUSERDATA"){
        state={
            ...state,
            userdata:action.payload
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