import React, {useEffect} from 'react'
import './App.css';
import Header from './components/layout/Header/Header'
import Home from './components/Home/Home';
import Footer from './components/layout/Footer/Footer';
import {BrowserRouter as Router} from "react-router-dom"
import { Routes, Route } from 'react-router-dom';
import WebFont from 'webfontloader'


function App() {

  useEffect(()=>{
    WebFont.load({
      google:{
        families:["Roboto", "Droid san", "Chilanka"]
      }
    })
  },[]);


  return (
    <Router>
       <Header/>
        <Routes>
         <Route path="/" element={<Home />} />
        </Routes>
       <Footer/>
    </Router>
  )
}

export default App;
