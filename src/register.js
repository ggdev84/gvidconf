import React, {useState} from "react"

export default function Register(){

    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [confirmpassword, setconfirmpassword] = useState("")


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
                <button>Register</button>
            </form>
            <a href="/login">Already registered ? Log in.</a>
        </div>
    )
}