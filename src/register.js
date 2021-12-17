import React, {useState} from "react"

export default function Register(){

    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [confirmpassword, setconfirmpassword] = useState("")

    let registerfn = (e)=>{
        e.preventDefault()
        fetch("/register",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                name,
                email,
                password,
                confirmpassword
            })
        })
        .then(data=>data.text())
        .then(data=>alert(data))
        .catch(err=>alert(err))
    }


    return(
        <div className="logindiv">
            <h3>
                <img src={require("./images/user.png").default} alt="User"/>
                Register
            </h3>
            <form>
                <input type="text" placeholder="Name / Nickname" value={name} onChange={(e)=>{setname(e.target.value)}} />
                <input type="email" placeholder="Email" value={email} onChange={(e)=>{setemail(e.target.value)}}  />
                <input type="password" placeholder="Password"  value={password} onChange={(e)=>{setpassword(e.target.value)}} />
                <input type="password" placeholder="Confirm password" value={confirmpassword} onChange={(e)=>{setconfirmpassword(e.target.value)}} />
                <button onClick={(e)=>{registerfn(e)}}>Register</button>
            </form>
            <a href="/login">Already registered ? Log in.</a>
        </div>
    )
}