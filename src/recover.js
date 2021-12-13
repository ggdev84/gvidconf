import React, { useState } from "react"
import { Routes, Route } from "react-router-dom"



export default function Recover(){

    const [email, setemail] = useState("")
    const [code, setcode] = useState("")
    const [password, setpassword] = useState("")
    const [confirmpassword, setconfirmpassword] = useState("")

    
    return(
        <div className="logindiv"> 
            <h3>
                <img src={require("./images/user.png").default} alt="User"/>
                Recover your password
            </h3>
            <Routes>

                <Route path="/recover/newpassword" element={
                    <form>
                        <input type="email" placeholder="Email" value={email} onChange={(e)=>{setemail(e.target.value)}} />
                        <input type="text" placeholder="Recover code" value={code} onChange={(e)=>{setcode(e.target.value)}}  />
                        <input type="password" placeholder="Password" value={password} onChange={(e)=>{setpassword(e.target.value)}}  />
                        <input type="password" placeholder="Confirm password" value={confirmpassword} onChange={(e)=>{setconfirmpassword(e.target.value)}}  />
                        <button>Recover</button>
                    </form>
                }/>


                <Route path="/recover/*" element={
                    <form>
                        <input type="email" placeholder="Email" value={email} onChange={(e)=>{setemail(e.target.value)}} />
                        <button>Get code </button>
                    </form>
                }/>


                <Route path="/recover" exact element={
                    <form>
                        <input type="email" placeholder="Email" value={email} onChange={(e)=>{setemail(e.target.value)}} />
                        <button>Get code </button>
                    </form>
                }/>


            </Routes>
            <a href="/login">Log in.</a>
        </div>
    )
}