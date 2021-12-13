import React from "react"
import { Route, Routes } from "react-router"
import Messaging from "./messaging"

export default function Main(){
    return(
        <div className="main">
            <Routes>
                <Route path="/" element={<Messaging/>} />
            </Routes>
        </div>
    )
}