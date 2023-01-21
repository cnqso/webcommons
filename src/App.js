import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./App.css";
import ToggleButtons from "./components/ToggleButtons";
import Canvas from "./components/Canvas";
import config from "./components/config";
import NavBar from "./components/NavBar";



import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set, push, onValue, get, child } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { useList, useListVals } from "react-firebase-hooks/database";
import { CompareSharp } from "@mui/icons-material";

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
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);




function sendRequest(method, y, x, building, buildingId, handler = "") {
	const url = "http://localhost:8080/" + handler;
	const body = JSON.stringify({
		id: buildingId,
		x: x,
		y: y, 
		building: building
	});
	const xhr = new XMLHttpRequest();
	xhr.withCredentials = false;
	// xhr.responseType = "json";

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === this.DONE) {
			const response = this.responseText;
			if (response) {
				//If you get a negative response, do a get request to get the current state of the tilemap
				console.log(response);
			}
		}
	});
	auth
	.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
		xhr.open(method, url);
		xhr.setRequestHeader("Authorization", idToken);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(body);
	  }).catch(function(error) {
		console.log(error);
	  });

}
//This works well for initial loading of the map
// let initialBuildings = {};
// const dbRef = ref(getDatabase());
// get(child(dbRef, "buildings")).then((snapshot) => {
//   if (snapshot.exists()) {
//     console.log(snapshot.val());
// 	initialBuildings = snapshot.val();

//   } else {
//     console.log("No data available");
//   }
// }).catch((error) => {
//   console.error(error);
// });


function App() {
	const [user] = useAuthState(auth);
	

	const editSelection = useRef("road");
	const [mapSelection, setMapSelection] = useState("city");
	// const [mapSelection, setMapSelection] = useState("city");

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
				mapSelection={mapSelection}
				setMapSelection={setMapSelection}
				sendRequest={sendRequest}
			/>
			<Canvas editSelection={editSelection} mapSelection={mapSelection} sendRequest={sendRequest}/>
		</div>
	);
}

export default App;
