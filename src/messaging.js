import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Contacts from "./contacts"
import Search from "./search"
import Settings from "./settings"

export default function Messaging(){

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


    let data2 = [
        {
            name:"Emma",
            status:"online",
            photo:"https://images.assetsdelivery.com/compings_v2/puhhha/puhhha1608/puhhha160800271.jpg",
            messages : [
                {
                    type:"incoming",
                    content:"HELLO",
                    date:"13/12/21 17:10"
                },
                {
                    type:"outgoing",
                    content:"How are you honey ?",
                    date:"13/12/21 17:21"
                },
                {
                    type:"incoming",
                    content:"find and ya ?",
                    date:"13/12/21 17:34"
                },
                {
                    type:"incoming",
                    content:"Are you coming to Mike's party ?",
                    date:"13/12/21 17:35"
                }
            ]
        },
        {
            name:"Laura",
            status:"offline",
            photo:"https://images.assetsdelivery.com/compings_v2/puhhha/puhhha1608/puhhha160800271.jpg",
            messages : [
                {
                    type:"incoming",
                    content:"Hi !",
                    date:"13/12/21 17:10"
                },
                {
                    type:"outgoing",
                    content:"How are you ?",
                    date:"13/12/21 17:21"
                },
                {
                    type:"incoming",
                    content:"find and ya ?",
                    date:"13/12/21 17:34"
                },
                {
                    type:"outgoing",
                    content:"Fine thx",
                    date:"13/12/21 17:35"
                }
            ]
        },
        {
            name:"John",
            status:"online",
            photo:"https://images.assetsdelivery.com/compings_v2/puhhha/puhhha1608/puhhha160800271.jpg",
            messages : [
                {
                    type:"incoming",
                    content:"Hello dear friend",
                    date:"13/12/21 17:10"
                },
                {
                    type:"incoming",
                    content:"How are you ?",
                    date:"13/12/21 17:21"
                },
                {
                    type:"incoming",
                    content:"Are you there ?",
                    date:"13/12/21 17:34"
                }
            ]
        }
    ]

    let userdata = useSelector(state=>state.userdata.userdata)

    let win 
    if(page === "search")
        win=<Search/>
    else if(page==="settings")
        win=<Settings/>
    else if(page==="contacts")
        win=<Contacts receivedFriendsRequests={userdata.receivedFriendsRequests} friends={userdata.friends} />
    else
        win=<Search/>


    return(
        <div className="messaging">

            <div className="modal" style={{display:display===true?"block":"none"}} onClick={()=>{setdisplay(false)}}>
                <div className="modalcontent" onClick={(e)=>{e.stopPropagation()}}>
                    <button className="close" onClick={()=>{setdisplay(false)}}>x</button>
                    {win}
                </div>
            </div>

            <div className="mainmenu">
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
                        userdata.friends.length !== 0 ?
                        data2.map(i=>{
                            return(
                                <div className="contact" onClick={()=>{setcurrent(i)}}>
                                    <div className="imgdiv">
                                        <img src={i.photo} alt="Picture"/>
                                    </div>
                                    <p>{i.name}</p>
                                    <div className="status">
                                        <div  style={{backgroundColor:i.status==="online" ? "#004F89":"gray"}}></div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <p>You have no conversations.</p>
                    }
                </div>

            </div>

            {
                "messages" in current  ? 
                <div className="messagesdiv">
                <div className="messagestitle">
                    <h2>{current.name}</h2>
                    <button><img src={require("./images/phone-call.png").default} alt="Call"/> </button>
                    <button><img src={require("./images/video-camera.png").default} alt="Video call"/> </button>
                </div>
                <div className="messages">
                    {
                        "messages" in current ? current.messages.map(i=>{
                            return(
                                <div className={"messageitem "+ (i.type==="incoming" ? "incoming":"outgoing")}>
                                    <p>{i.content}</p>
                                    <p>{i.date}</p>
                                </div>
                            )
                        }) : <p className="empty">Click on someone's name to start conversation</p>
                    } 
                </div>    
                <div className="messagesinput">
                    <input type="text" placeholder="Your message.."/>
                    <button><img src={require("./images/send.png").default} alt="Send"/></button>
                </div>
            </div> :
            <div className="emptymessagesdiv">
                <p className="empty">Click on someone's name to start conversation</p>
            </div>
            }
        </div>
    )
}