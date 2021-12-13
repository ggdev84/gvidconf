import React from "react"
import Register from "./register"
import Login from "./login"
import Recover from "./recover"
import { Route, Routes } from "react-router-dom"

export default function Loginpage({match}){


    return(
        <div className="loginpage">
            <h1><img src={require("./images/logoicon.svg").default} alt="Logo"/> Gconf</h1>
            <h2>Self-hosted open-source videoconference tool.</h2>
            <div className="banner">
                <img src={require("./images/screenshot.png").default} alt="Screenshot"/>

                <Routes>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/recover/*" element={<Recover/>}/>
                    <Route path="/recover" element={<Recover/>}/>
                    <Route path="" exact element={<Login/>}/>

                </Routes>

            </div>
        </div>
    )
}