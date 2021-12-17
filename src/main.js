import React, { useEffect, useReducer, useState } from "react"
import { Route, Routes } from "react-router"
import Call from "./call"
import Messaging from "./messaging"
import { changeruserdata } from "./actions"
import { useDispatch } from "react-redux"


export default function Main(){

    

    return(
        <div className="main">
            <Routes>
                <Route path="/" exact element={<Messaging />} />
                <Route path="/call" element={<Call />}/>
            </Routes>
        </div>
    )
}