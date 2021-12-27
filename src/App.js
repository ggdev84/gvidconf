import logo from './logo.svg';
import './App.css';
import Loginpage from './loginpage';
import {BrowserRouter, Link, Route, Routes} from "react-router-dom"
import Main from './main';
import Register from "./register"
import {useDispatch} from "react-redux"
import {useEffect, useState} from "react"
import { changeruserdata } from './actions';

function App() {


  useEffect(()=>{
    fetch("/amiloggedin")
    .then(data=>data.text())
    .then(data=>{
        if(data.includes("logged in")){
            if(window.location.href.includes("/main") ===false){
              window.location =  "http://localhost:3000/main"
            }
        }
    })
  }, [])


  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/*" exact element={<Loginpage/>}/>
                <Route path="/login" element={<Loginpage/>}/>
                <Route path="/main" exact element={<Main/>}/>
                <Route path="/main/*" element={<Main/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
