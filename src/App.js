/** @format */

import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./App.css";
import ToggleButtons from "./components/ToggleButtons";
import Canvas from "./components/Canvas";
import config from "./components/config";
import NavBar from "./components/NavBar";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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
const userListRef = ref(database, "userList");
const userDataRef = ref(database, "userData");

function sendRequest(method, y, x, building, buildingId, handler = "") {
	const url = "http://localhost:8080/" + handler;
	const body = JSON.stringify({
		id: buildingId,
		x: x,
		y: y,
		building: building,
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
	auth.currentUser
		.getIdToken(/* forceRefresh */ true)
		.then(function (idToken) {
			xhr.open(method, url);
			xhr.setRequestHeader("Authorization", idToken);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(body);
		})
		.catch(function (error) {
			console.log(error);
		});
}


function cnqsoFastSquareSpiral(n) {
	let dir = 1;
	let loc = [0, 0];
	let run = 1;
	let runi = 0;
	let i = 0;
	while (i < n) {
		runi = run + i;
		while (i < runi) {
			loc[0] += dir;
			i++;
			if (i >= n) {
				return loc;
			}
		}
		runi = run + i;
		while (i < runi) {
			loc[1] += dir;
			i++;
			if (i >= n) {
				return loc;
			}
		}

		run++;
		dir = dir * -1;
	}
	return loc;
}



function App() {
	const [user] = useAuthState(auth);

	const editSelection = useRef("road");
	const [mapSelection, setMapSelection] = useState("city");
	const [userNameTaken, setUserNameTaken] = useState(false);
	const userNameInput = useRef("");
	// const [mapSelection, setMapSelection] = useState("city");

	const setEditSelection = (value) => {
		editSelection.current = value;
	};

	const [open, setOpen] = useState(false);

	const noSignup = () => {
		setOpen(false);
		auth.signOut();
	};

	const handleStart = () => {
		setUserNameTaken(false);
		console.log(userNameInput.current.value)
		get(child(userListRef, userNameInput.current.value)).then((snapshot) => {
			if (snapshot.exists()) {
			  console.log("Already exists!" + snapshot.val());
			  setUserNameTaken(true);
			} else {
			  newUser(userNameInput.current.value);
			}
		  }).catch((error) => {
			console.error(error);
		  });
	}

	const newUser = (userName) => {
		let excessiveDownload = {};
		get(userListRef).then((snapshot) => {
			excessiveDownload = snapshot.val();	
			console.log(excessiveDownload)
		})

		const userListLength = Object.keys(excessiveDownload).length;
		const [x, y] = cnqsoFastSquareSpiral(userListLength);

		const newUser = {userName: userName, location: `${y},${x}`, money: 1000};
		try {set(child(userListRef, auth.currentUser.uid), newUser);
		} catch (error) {
			console.log(error);
		}
	}

	const signInWithGoogle = () => {
		// console.log(auth);
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider).then((result) => {
			console.log(result.user.uid);
			if ("userRef" !== "placeholder") {
				setOpen(true);
			}
		});
	};
	const signOut = () => {
		auth.signOut();
	};

	return (
		<div className='App'>
			<Dialog open={open} onClose={noSignup}>
				<DialogContent>
					<DialogContentText>Choose a new userName</DialogContentText>
					{userNameTaken ? (
						<TextField inputRef={userNameInput} error autoFocus id='commonsuserName' label='userName' variant='standard' />
					) : (
						<TextField inputRef={userNameInput} autoFocus id='commonsuserName' label='userName' variant='standard' />
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={noSignup}>Cancel</Button>
					<Button onClick={handleStart}>Start</Button>
				</DialogActions>
			</Dialog>
			<NavBar signIn={signInWithGoogle} signOut={signOut} user={user} />
			<ToggleButtons
				currentSelection={editSelection}
				setEditSelection={setEditSelection}
				mapSelection={mapSelection}
				setMapSelection={setMapSelection}
				sendRequest={sendRequest}
			/>
			<Canvas editSelection={editSelection} mapSelection={mapSelection} sendRequest={sendRequest} />
		</div>
	);
}

export default App;
