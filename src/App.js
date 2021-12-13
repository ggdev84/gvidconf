import logo from './logo.svg';
import './App.css';
import Loginpage from './loginpage';
import {BrowserRouter, Link, Route, Routes} from "react-router-dom"
import Main from './main';
import Register from "./register"

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/*" exact element={<Loginpage/>}/>
                <Route path="/login" element={<Loginpage/>}/>
                <Route path="/main/*" element={<Main/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
