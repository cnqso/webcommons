import React, { useRef, useState } from "react";
import "./App.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";

import { useAuthState } from "react-firebase-hooks/auth";
import { useList, useListVals } from "react-firebase-hooks/database";

import ToggleButtons from "./components/ToggleButtons";
import Canvas from "./components/Canvas";
import config from "./components/config";
import NavBar from "./components/NavBar";

const firebaseConfig = {
	apiKey: process.env.REACT_APP_PRIV_KEY,
	authDomain: "reactcommons.firebaseapp.com",
	databaseURL: "https://reactcommons-default-rtdb.firebaseio.com",
	projectId: "reactcommons",
	storageBucket: "reactcommons.appspot.com",
	messagingSenderId: "1065691708142",
	appId: "1:1065691708142:web:11c9050fc656410b9b11ff",
	measurementId: "G-PQHKRQWR78",
};
//Initialize fb modules
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);








function sendRequest(method, y, x, building, handler = "") {
	const url = "http://localhost:8080/" + handler;
	const body = JSON.stringify({
		id: "placeholder",
		x: x, //keep
		y: y, //keep
		building: building, //keep
		owner: "xds9lVZJJSXnDyDOB39o4mlKjij1", //authentication
		power: true,
		pop: 0,
		dev: 0,
		time: 61304000,
	});

	const xhr = new XMLHttpRequest();
	xhr.withCredentials = false;
	// xhr.responseType = "json";

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === this.DONE) {
			console.log(this.responseText);
		}
	});
	auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
		xhr.open(method, url);
		xhr.setRequestHeader("Authorization", idToken);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(body);
	  }).catch(function(error) {
		console.log(error);
	  });

}






function App() {
	const [user] = useAuthState(auth);

	const editSelection = useRef("road");

	const setEditSelection = (value) => {
		editSelection.current = value;
	};


	const signInWithGoogle = () => {
		console.log(auth);
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider);
	  }
	const signOut = () => {
		auth.signOut();
	}
	
	return (
		<div className="App">
			<NavBar signIn={signInWithGoogle} signOut={signOut} user={user}/>
			<ToggleButtons
				currentSelection={editSelection}
				setEditSelection={setEditSelection}
			/>
			<Canvas editSelection={editSelection} sendRequest={sendRequest} />
		</div>
	);
}

export default App;
