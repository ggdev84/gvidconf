import React, { useEffect, useReducer, useState } from "react"
import { Route, Routes } from "react-router"
import Call from "./call"
import Messaging from "./messaging"
import { changeruserdata } from "./actions"
import { useDispatch } from "react-redux"


export default function Main(){

    let dispatch = useDispatch()

    useEffect(()=>{
        fetch("/getdata")
        .then(data=>data.text())
        .then(data=>{
            if(data.includes("{")){
                alert(data)
                dispatch(changeruserdata(JSON.parse(data)))
                if(window.location.href.includes("/main") ===false){
                  window.location =  "http://localhost:3000/main"
                }
            }
        })
    }, [])

    return(
        <div className="main">
            <Routes>
                <Route path="/" exact element={<Messaging />} />
                <Route path="/call" element={<Call />}/>
            </Routes>
        </div>
    )
}