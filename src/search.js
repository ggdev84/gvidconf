import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as actions from "./actions"

export default function Search(){

    const [data, setdata] = useState([])
    const [search, setsearch] = useState("")

    let dispatch = useDispatch()
    let userdata=useSelector(state=>state.userdata)

    let searchcontacts = ()=>{
        fetch("/getallcontacts",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                search
            })
        })
        .then(data=>data.text())
        .then(data=>{
            if(data.includes("{")){
                setdata(JSON.parse(data).userslist)
            }
            else{
                alert(data)
            }
        })

    }

    let addfriend = (token)=>{
        fetch("/addfriend", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                token
            })
        })
        .then(data=>data.text())
        .then(data=>{
            dispatch({type:"UPDATE"})
            alert(data)
        })
    }

    return(
        <div className="search">
            <h1>Add contact</h1>
            <div className="searchinputdiv">
                <input type="text" placeholder="Search people" value={search} onKeyUp={(e)=>{if(e.key==="Enter"){searchcontacts()}}} onChange={(e)=>{setsearch(e.target.value)}}/>
                <button className="searchbtn" onClick={searchcontacts} >{">"}</button>
            </div>
            <div className="receivedFriendsRequests">
                {
                    data.length > 0 ? 
                    data.map(i=>{
                        return(
                            <div className="receivedfriendsrequest">
                                <p>{i.name}{`  (${i.token})`}</p>
                                <button disabled={userdata.friends.find(el=>el.token===i.token)!==undefined ? true:false} onClick={()=>{addfriend(i.token)}}>Send</button>
                            </div>
                        )
                    }) : ""
                }
            </div>
            
        </div>
    )
}