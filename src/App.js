/** @format */

import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./App.css";
import ToggleButtons from "./components/ToggleButtons";
import Canvas from "./components/Canvas";
import config from "./components/config";
import NavBar from "./components/NavBar";
import emptyPlot from "./rawTiles.json";

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
import { common } from "@mui/material/colors";

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
const userDataRef = ref(database, "userData");
const userListRef = ref(database, "userList");
const userLocationsRef = ref(database, "userLocations");
const userTilesRef = ref(database, "userTiles");

function sendRequest(method, y, x, building, buildingId, folder, handler = "") {
	const url = "http://localhost:8080/" + handler;
	const body = JSON.stringify({
		folder: folder,
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

function reverseSquareSpiral(coordinates) {
	const [x, y] = coordinates;
	let targetCoordinates = [
		[x - 1, y + 1],
		[x, y + 1],
		[x + 1, y + 1],
		[x - 1, y],
		[x + 1, y],
		[x - 1, y - 1],
		[x, y - 1],
		[x + 1, y - 1],
	];
	targetCoordinates = targetCoordinates.map(String);
	let outputArray = new Array(8).fill(-1);
	let foundBuildings = 0;
	let dir = 1;
	let loc = [0, 0];
	let len = 1;
	let runi = 1;
	let i = 0;
	while (true) {
		for (let k = 0; k < 2; k++) {
			runi = len + i;
			while (i < runi) {
				if (targetCoordinates.indexOf(loc.toString()) !== -1) {
					outputArray[targetCoordinates.indexOf(loc.toString())] = i;
					foundBuildings++;
				}
				if (foundBuildings > 7 || i > 500) {
					return outputArray;
				}
				loc[k] += dir;
				i++;
			}
		}
		len++;
		dir = ~dir + 1;
	}
}

function App() {
	const lastSnapshot = useRef({});
	const [user] = useAuthState(auth);
	const [mapSelection, setMapSelection] = useState("city");
	const [userData, setUserData] = useState({});
	const userNameInput = useRef("");
	const [open, setOpen] = useState(false);
	const [mapDataLocation, setMapDataLocation] = useState("buildings");
	const [loggedIn, setLoggedIn] = useState(false);
	const editSelection = useRef("road");
	const setEditSelection = (value) => {
		editSelection.current = value;
	};
	const [neighborTiles, setNeighborTiles] = useState([]);

	//I'd like to implement the code below, but I'm worried about an infinite loop

	// if (!loggedIn && user || loggedIn && !user) {
	// 	console.log("Preauthenticated user returning")
	// 	try { get(child(userListRef, user.uid))
	// 		.then((snapshot) => {
	// 			if (snapshot.exists()) {
	// 				commonsLogin(snapshot.val());
	// 			} else {
	// 				//Redundancy because an infinite auth loop would be very bad
	// 				auth.signOut();
	// 				setLoggedIn(false);
	// 				signOut();
	// 			}
	// 		})
	// 	} catch (error) {
	// 		console.log(error);
	// 		auth.signOut();
	// 		setLoggedIn(false);
	// 		signOut();
	// 	}
	// }

	const signInWithGoogle = () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider).then((result) => {
			console.log(result.user.uid);
			get(child(userListRef, auth.currentUser.uid)).then((snapshot) => {
				if (snapshot.exists()) {
					commonsLogin(snapshot.val());
				} else {
					setOpen(true);
				}
			});
		});
	};

	const signOut = () => {
		setOpen(false);
		auth.signOut();
		setLoggedIn(false);
	};

	const handleNewUser = () => {
		get(child(userListRef, auth.currentUser.uid))
			.then((snapshot) => {
				if (!snapshot.exists()) {
					newUser(userNameInput.current.value);
				} else {
					setOpen(false);
					commonsLogin(auth.currentUser.uid);
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const newUser = () => {
		const userName = userNameInput.current.value;
		if (userName === "") {
			signOut();
			return;
		}
		let excessiveDownload = {};
		get(userListRef).then((snapshot) => {
			excessiveDownload = snapshot.val();
			const userListLength = Object.keys(excessiveDownload).length;
			let newUser = {};
			// Check if the user already has an account. If so, let them change username but don't let them cheat
			if (excessiveDownload[auth.currentUser.uid]) {
				newUser = {
					userName: userName,
					location: excessiveDownload[auth.currentUser.uid].location,
					money: excessiveDownload[auth.currentUser.uid].money,
				};
			} else {
				const [x, y] = cnqsoFastSquareSpiral(userListLength);
				newUser = { location: [x, y], money: 1000, userName: userName };
				set(child(userLocationsRef, userListLength.toString()), auth.currentUser.uid);
			}
			try {
				set(child(userListRef, auth.currentUser.uid), newUser);
				setOpen(false);
				commonsLogin(newUser);
			} catch (error) {
				signOut();
			}
		});
	};

	const commonsLogin = ({ location, money, userName }) => {
		setUserData({ location, money, userName });
		console.log(`Logging in ${userName} - uid ${auth.currentUser.uid} - at ${location} with $${money}`);
		setMapDataLocation(`userData/${auth.currentUser.uid}`);

		let surroundingTiles = [];
		const surroundingUsers = reverseSquareSpiral(location);
		console.log(surroundingUsers[0]);
		for (let i = 0; i < 8; i++) {
			get(child(userTilesRef, surroundingUsers[i].toString())).then((snapshot) => {
				if (snapshot.exists()) {
					console.log(snapshot.val());
					surroundingTiles[i] = snapshot.val();
				} else {
					surroundingTiles[i] = emptyPlot;
				}
			});
		}
		console.log(surroundingUsers);
		console.log(surroundingTiles);
		setNeighborTiles(surroundingTiles);
		//setSurroundingTiles state to surroundingTiles

		setLoggedIn(true);

		//Switch map to user's
		//grab the tiles from neighbors
		//set user data
	};

	return (
		<div className='App'>
			<Dialog open={open} onClose={signOut}>
				<DialogContent>
					<DialogContentText>Choose a new userName</DialogContentText>
					<TextField
						inputRef={userNameInput}
						autoFocus
						id='commonsuserName'
						label='userName'
						variant='standard'
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={signOut}>Cancel</Button>
					<Button onClick={handleNewUser}>Start</Button>
				</DialogActions>
			</Dialog>

			<NavBar signIn={signInWithGoogle} signOut={signOut} user={loggedIn} />

			<ToggleButtons
				currentSelection={editSelection}
				setEditSelection={setEditSelection}
				mapSelection={mapSelection}
				setMapSelection={setMapSelection}
				sendRequest={sendRequest}
			/>
			{loggedIn ? (
				<Canvas
					key={mapDataLocation}
					editSelection={editSelection}
					mapSelection={mapSelection}
					sendRequest={sendRequest}
					mapDataLocation={mapDataLocation}
					neighborTiles={neighborTiles}
				/>
			) : null}
		</div>
	);
}

export default App;
