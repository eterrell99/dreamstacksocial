import logo from './logo.svg';
import React, { Component, useState, useEffect } from "react";
import {createRoot} from "react-dom/client";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dash from './components/Dashboard/dash';
import store from './components/Redux/store';
import Register from './components/Users/register';
import SignIn from './components/Users/login';
import Profile from './components/Users/profile';
import ExpandedPost from './components/Dashboard/Post/postExpanded';
import { Provider } from 'react-redux';
import TagSlash from './components/Dashboard/Tags/tagSlash';
import TagDash from './components/Dashboard/Tags/tagDash';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dash/>}/>
        <Route path="" element={<Dash/>}/>
        <Route path="/post/:post/" element={<ExpandedPost/>}/>
        <Route path="/signup/" element={<Register/>}/>
        <Route path="/login/" element={<SignIn/>}/>
        <Route path="/Profile/" element={<Profile/>}/>
        <Route path="/ee/" element={<TagDash/>}/>
        <Route path="/ee/:eee/" element={<TagSlash/>}/>

      </Routes>
    </Router>
  );
}


const appDiv = createRoot(document.getElementById("app"));
appDiv.render(
  <Provider store={store}>
    
    <App />

    </Provider>
);
