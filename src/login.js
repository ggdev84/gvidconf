import React, { useState } from "react"

export default function Login(){

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    let loginfn = (e)=>{
        e.preventDefault()
        fetch("/login",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                email,
                password
            })
        })
        .then(data=>data.text())
        .then(data=>{
            if(data.includes("logged in"))
                window.location = window.location.replace("/login","/main")
            else
                alert(data)
        })
        .catch(err=>alert(err))
    }

    return(
        <div className="logindiv">
            <h3>
                <img src={require("./images/user.png").default} alt="User"/>
                Log in
            </h3>
            <form>
                <input type="email" placeholder="Email" value={email} onChange={(e)=>{setemail(e.target.value)}} />
                <input type="password" placeholder="Password" value={password} onChange={(e)=>{setpassword(e.target.value)}}  />
                <button onClick={(e)=>{loginfn(e)}}>Log in</button>
            </form>
            <a href="/register">Don't have an account ? Register.</a>
            <a href="/recover">Recover your password</a>
        </div>
    )
}