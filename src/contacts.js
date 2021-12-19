import React from "react"

export default function Contacts({receivedFriendsRequests, friends}){

    let acceptfriend=(i)=>{
        fetch("/acceptfriend",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                token:i.token,
                name:i.name
            })
        })
        .then(data=>data.text())
        .then(data=>alert(data))
    }

    return(
        <div className="contacts">
            <h1>Contacts</h1>
            {
                receivedFriendsRequests.length >0?
                <div className="receivedfriendsrequestdiv">
                    <h2>They want to be your friends</h2>
                    {
                        receivedFriendsRequests.map(i=>{
                            return(
                                <div className="receivedfriendsrequest">
                                    <p>{i.name +`  (${i.token})`}</p>
                                    <button className="rejectfriend"  >Reject</button>
                                    <button className="acceptfriend" onClick={()=>{acceptfriend(i)}} >Accept</button>
                                </div>
                            )
                        })
                    }
                </div>:""
            }
            {
                friends.length>0?
                <div className="receivedfriendsrequestdiv">
                    <h2>Your contacts</h2>
                    {
                        friends.map(i=>{
                            return(
                                <div className="receivedfriendsrequest">
                                    <p>{i.name +`  (${i.token})`}</p>
                                    <button className="rejectfriend">Delete</button>
                                    <button className="acceptfriend">Start</button>
                                </div>
                            )
                        })
                    }
                </div>:""
            }   
        </div>
    )
}