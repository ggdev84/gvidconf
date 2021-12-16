import React, { useEffect, useState } from "react"
import { Route, Routes } from "react-router"
import Call from "./call"
import Messaging from "./messaging"

export default function Main(){

    const [data, setdata] = useState({})

    useEffect(()=>{
        fetch("http://localhost:8080/getdata")
        .then(data=>data.text())
        .then(data=>{
            if(data.includes("{"))
                setdata(data)
            else
                alert(data)
        })
    }, [])

    return(
        <div className="main">
            <Routes>
                <Route path="/" exact element={<Messaging data={data} />} />
                <Route path="/call" element={<Call data={data} />}/>
            </Routes>
        </div>
    )
}