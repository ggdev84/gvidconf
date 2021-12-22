import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Contacts from "./contacts"
import Search from "./search"
import Settings from "./settings"
import sockioclient from "socket.io-client"
import * as actions from "./actions"
import moment from "moment"

export default function Messaging(){

    let dispatch = useDispatch()
    let sock = useSelector(state=>state.sock.sock)
    let userdata = useSelector(state=>state.userdata.userdata)
    let divref = useRef(null)

    let logout = ()=>{
        fetch("/logout")
        .then(data=>data.text())
        .then(data=>{
            if(data.includes("logged out")){
                window.location = new URL("http://localhost:3000/")
            }
        })
    }

    const [current, setcurrent] = useState({})
    const [display, setdisplay] = useState(false)
    const [page, setpage] = useState("search")
    const [reconnect, setreconnect] = useState(0)
    const [msg, setmsg] = useState("")


    useEffect(()=>{
        const socket = sockioclient() 
        socket.on("connection", ()=>{
            alert("Connected")
        })
        socket.on("message", (msg)=>{
            if(msg.includes("{")){
                let obj = JSON.parse(msg)
                console.log(obj)
            }
            else{
                alert(msg)
            }
        })
        dispatch(actions.changesock(socket))
    }, [reconnect])

    
    let sendmessage = ()=>{
        let obj = {
            content:msg,
            otherToken:current.token,
            otherName:current.name
        }
        sock.emit("message", JSON.stringify(obj))
        divref.current.scrollTop =  divref.current.scrollHeight
    }
    
    



    let win 
    if(page === "search")
        win=<Search/>
    else if(page==="settings")
        win=<Settings/>
    else if(page==="contacts")
        win=<Contacts receivedFriendsRequests={userdata.receivedFriendsRequests} friends={userdata.friends} />
    else
        win=<Search/>


    let conversations = []
    userdata.messages.forEach(i=>{
        let found = conversations.find(el=>el.token===i.otherToken)
        if(found===undefined)
            conversations.push({name:i.otherName, token:i.otherToken})
    })
    

    let messages = userdata.messages.filter(i=>i.otherToken === current.token)

    

    return(
        <div className="messaging">

            <div className="modal" style={{display:display===true?"block":"none"}} onClick={()=>{setdisplay(false)}}>
                <div className="modalcontent" onClick={(e)=>{e.stopPropagation()}}>
                    <button className="close" onClick={()=>{setdisplay(false)}}>x</button>
                    {win}
                </div>
            </div>

            <div className="mainmenu" >
                <h1><img src={require("./images/logoicon.svg").default} alt="icon"/> Gvidconf</h1>
                <h3>{userdata.name}</h3>
                <div className="mainmenubtns">

                    <button onClick={logout} >
                        <img src={require("./images/logout.png").default} alt="Logout"/>
                    </button>

                    <button onClick={()=>{setpage("settings"); setdisplay(true)}}>
                        <img src={require("./images/settings.png").default} alt="Settings"/>
                    </button>

                    <button onClick={()=>{setpage("contacts"); setdisplay(true)}}>
                        <img style={{backgroundColor:userdata.receivedFriendsRequests.length >0?"darkred":"transparent"}} src={require("./images/contacts.png").default} alt="Contacts"/>
                    </button>

                    <button onClick={()=>{setpage("search"); setdisplay(true)}}>
                        <img src={require("./images/add.png").default} alt="Add"/>
                    </button>
                </div>

                <div className="contactlist">
                    {
                        conversations.length !== 0 ?
                        conversations.map(i=>{
                            return(
                                <div className="contact" onClick={()=>{
                                    setcurrent(i)
                                }}>
                                    <div className="imgdiv">
                                        <img src={require("./images/user.png").default} alt="User : "/>
                                    </div>
                                    <p>{i.name}</p>
{/*                                    <div className="status">
                                        <div  style={{backgroundColor:i.status==="online" ? "#004F89":"gray"}}></div>
                            </div>*/}
                                </div>
                            )
                        })
                        :
                        <p>You have no conversations.</p>
                    }
                </div>

            </div>

            {
                messages.length !== 0 ? 
                <div className="messagesdiv">
                <div className="messagestitle">
                    <h2>{current.name}</h2>
                    <button><img src={require("./images/phone-call.png").default} alt="Call"/> </button>
                    <button><img src={require("./images/video-camera.png").default} alt="Video call"/> </button>
                </div>
                <div className="messages" ref={divref} onLoad={()=>{divref.current.scrollTop = divref.current.scrollHeight}}>
                    {
                        messages.map(i=>{
                            return(
                                <div className={"messageitem "+ (i.type==="incoming" ? "incoming":"outgoing")}>
                                    <p>{i.content}</p>
                                    <p>{i.date}</p>
                                </div>
                            )
                        })
                    } 
                    
                </div>    
                <div className="messagesinput">
                    <input type="text" placeholder="Your message.." value={msg} onChange={(e)=>{setmsg(e.target.value)}} />
                    <button><img src={require("./images/send.png").default} alt="Send" onClick={sendmessage}/></button>
                </div>
            </div> :
            <div className="emptymessagesdiv">
                <p className="empty">Click on someone's name to start conversation</p>
            </div>
            } 
        </div>
    )
}