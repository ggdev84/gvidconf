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

export const userdata = (state={userdata:{friends:[]}}, action)=>{
    if(action.type==="CHANGEUSERDATA"){
        state={
            ...state,
            userdata:action.payload
        }
    }
    return state
}