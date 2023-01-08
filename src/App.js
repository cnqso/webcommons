import React, { useRef, useState } from 'react';
import './App.css';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth , GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";


import { useAuthState } from 'react-firebase-hooks/auth';
import { useList, useListVals } from 'react-firebase-hooks/database';

import ToggleButtons from "./components/ToggleButtons";
import Canvas from "./components/Canvas";
import { Space } from 'react-zoomable-ui';
import config from './components/config';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_PRIV_KEY,
  authDomain: "reactcommons.firebaseapp.com",
  databaseURL: "https://reactcommons-default-rtdb.firebaseio.com",
  projectId: "reactcommons",
  storageBucket: "reactcommons.appspot.com",
  messagingSenderId: "1065691708142",
  appId: "1:1065691708142:web:11c9050fc656410b9b11ff",
  measurementId: "G-PQHKRQWR78"
};
//Initialize fb modules
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);


//communicate with backend
export var url = "http://localhost:8080/"
export function regularRequest(handler, method, body, callback) {
    const http = new XMLHttpRequest()
    http.responseType = 'json'

    http.open(method, url + handler, true)

    //firebase.auth().currentUser.getIDToken(/* forceRefresh */ true).then((idToken) =>
    //  http.setRequestHeader('Authorization',idToken)

    if (body != null) {
        http.setRequestHeader('Content-Type', 'application/json')
    }

    http.onload = function () {
        callback(http.response)
    }

    http.send(JSON.stringify(body))
}//).catch((error) => {
  //callback("Auth Error")
//});



function sendRequest (method, y, x, building) {

  const data = JSON.stringify({
    "id": "placeholder",
    "x": x, //keep
    "y": y, //keep
    "building": building, //keep
    "owner": "xds9lVZJJSXnDyDOB39o4mlKjij1", //authentication
    "power": true,
    "pop": 0,
    "dev": 0,
    "time": 61304000
});
  
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      console.log(this.responseText);
    }
  });
  
  xhr.open(method, "http://localhost:8080/");
  xhr.setRequestHeader("Content-Type", "application/json");
  
  xhr.send(data);
}


function App() {

  const editSelection = useRef("road");
  const setEditSelection = (value) => {
    editSelection.current = value;
  }


  return (
    <div className="App">

      <ToggleButtons currentSelection = {editSelection} setEditSelection={setEditSelection}/>
      <Canvas editSelection={editSelection} sendRequest={sendRequest}/>

    </div>
  );
}

export default App;