import React, { useState } from "react"

export default function Test(){

    const [email, setemail] = useState("")
    const [code, setcode] = useState("")
    const [password, setpassword] = useState("")
    const [confirmpassword, setconfirmpassword] = useState("")

    return(
        <form>
            <input type="email" placeholder="Email" value={email} onChange={(e)=>{setemail(e.target.value)}} />
            <input type="text" placeholder="Recover code" value={code} onChange={(e)=>{setcode(e.target.value)}}  />
            <input type="password" placeholder="Password" value={password} onChange={(e)=>{setpassword(e.target.value)}}  />
            <input type="password" placeholder="Confirm password" value={confirmpassword} onChange={(e)=>{setconfirmpassword(e.target.value)}}  />
            <button>Recover</button>
        </form>
    )
}