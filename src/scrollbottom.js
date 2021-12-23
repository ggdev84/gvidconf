import React, { useEffect, useRef } from "react"

export default function Scrollbottom(){

    const divref = useRef()

    useEffect(()=>{
        divref.current.scrollIntoView()
    })

    return (
        <div ref={divref}/>
    )
}