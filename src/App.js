/** @format */

import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import ToggleButtons from "./components/ToggleButtons";
import Canvas from "./components/Canvas";
import config from "./components/config";
import NavBar from "./components/NavBar";
import emptyPlot from "./rawTiles.json";
import Row from "./components/Row";
import { Space } from "react-zoomable-ui";
import introTiles from "./components/introTiles.json";
import Welcome from "./components/Welcome";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, get, child } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import useMediaQuery from "@mui/material/useMediaQuery";

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
const userTilesRef = ref(database, "userTiles");

function sendRequest(method, y, x, building, buildingId, folder, handler = "") {
	const url = "https://us-central1-reactcommons.cloudfunctions.net/expressApi/" + handler;
	const body = JSON.stringify({
		folder: folder,
		id: buildingId,
		x: x,
		y: y,
		building: building,
	});
	const xhr = new XMLHttpRequest();
	xhr.withCredentials = false;
	xhr.responseType = "text";

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === this.DONE) {
			const response = this.responseText;
			if (response) {
				console.log(response);
				return response;
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
			return error;
		});
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

const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#aafdc6",
		},
		background: {
			default: "#181818",
		},
		appBar: '#121212',
		appBarText: '#fff',
	},

});

const lightTheme = createTheme({
	palette: {
	  mode: 'light',
	  primary: {
		main: "#32CD32",
	},
	  background: {
		default: "#ccffdd",
	},
	  appBar: 'paleGreen',
	  appBarText: 'black',
	},
  });

function App() {
	const [user] = useAuthState(auth);
	const [mapSelection, setMapSelection] = useState("city");
	const [userData, setUserData] = useState({});
	const userNameInput = useRef("");
	const [open, setOpen] = useState(false);
	const [mapDataLocation, setMapDataLocation] = useState("buildings");
	const [loggedIn, setLoggedIn] = useState(false);
	const [darkMode, setDarkMode] = useState(false);
	const editSelection = useRef("road");
	const isComputer = useMediaQuery("(min-width:600px)");
	const setEditSelection = (value) => {
		editSelection.current = value;
	};
	const [neighborTiles, setNeighborTiles] = useState([]);
	let TILE_PIXELS = config.TILE_PIXELS;
	if (isComputer) {
		TILE_PIXELS = TILE_PIXELS * 2;
	}
	const mapWidth = config.TILE_WIDTH * TILE_PIXELS;
	const mapHeight = config.TILE_HEIGHT * TILE_PIXELS;
	let theme = lightTheme;
	let themeString = "light";
	if (darkMode) {
		theme = darkTheme;
		themeString = "dark";
	}

	useEffect(() => {
		if (user && !loggedIn) {
			get(child(userListRef, user.uid)).then((snapshot) => {
				if (snapshot.exists()) {
					console.log("relogging in!");
					commonsLogin(snapshot.val());
				}
			});
		}
	}, [user]);

	const signInWithGoogle = () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider).then((result) => {
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

	function handleNewUser() {
		const userName = userNameInput.current.value;
		if (userName === "") {
			signOut();
			return;
		}

		newUserRequest("POST", auth.currentUser.uid, userName);
	}

	const commonsLogin = ({ location, money, userName }) => {
		setUserData({ location, money, userName });
		console.log(`Logging in ${userName} - uid ${auth.currentUser.uid} - at ${location} with $${money}`);
		setMapDataLocation(`userData/${auth.currentUser.uid}`);

		let surroundingTiles = [];
		const surroundingUsers = reverseSquareSpiral(location);
		for (let i = 0; i < 8; i++) {
			get(child(userTilesRef, surroundingUsers[i].toString())).then((snapshot) => {
				if (snapshot.exists()) {
					surroundingTiles[i] = snapshot.val();
				} else {
					surroundingTiles[i] = emptyPlot;
				}
			});
		}
		setNeighborTiles(surroundingTiles);
		setLoggedIn(true);
		// setMapSelection("city")
		// setMapSelection("resDemand")
		// setTimeout(() => {
		// 	console.log("setting map selection to city")
		// 	setMapSelection("city")
		// }, 200);
	};

	function newUserRequest(method, userId, folder) {
		const url = "https://us-central1-reactcommons.cloudfunctions.net/expressApi/newUser/";
		const body = JSON.stringify({
			folder: folder,
			id: userId,
		});
		const xhr = new XMLHttpRequest();
		xhr.withCredentials = false;
		xhr.responseType = "text";

		xhr.addEventListener("readystatechange", function () {
			if (this.readyState === this.DONE) {
				const response = this.responseText;
				if (response) {
					console.log(response);
					const location = response.split(",");
					setOpen(false);
					commonsLogin({ location: [location[1], location[2]], money: 1000, userName: body.id });
					return response;
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
				signOut();
				return error;
			});
	}

	return (
		<ThemeProvider theme={theme}>
		<div className='App' style={{backgroundColor: theme.palette.background.default}}>
			<link
				rel='stylesheet'
				href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
			/>
		
				<CssBaseline />
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

				<NavBar
					signIn={signInWithGoogle}
					signOut={signOut}
					user={loggedIn}
					userName={userData.userName}
					darkMode={darkMode}
					setDarkMode={setDarkMode}
				/>
				{loggedIn ? (
					<>
						<ToggleButtons
							currentSelection={editSelection}
							setEditSelection={setEditSelection}
							mapSelection={mapSelection}
							setMapSelection={setMapSelection}
							sendRequest={sendRequest}
							userData={userData}
							theme={theme}
						/>

						<Canvas
							key={mapDataLocation}
							editSelection={editSelection}
							mapSelection={mapSelection}
							sendRequest={sendRequest}
							mapDataLocation={mapDataLocation}
							neighborTiles={neighborTiles}
							userData={userData}
							setUserData={setUserData}
							TILE_PIXELS={TILE_PIXELS}
							themeString={themeString}
						/>
					</>
				) : (
					<>
						<div
							className='Canvas'
							style={{
								position: "relative",
							}}>
							<Welcome />
							<Space
								style={{ border: "solid 1px black" }}
								onCreate={(viewPort) => {
									viewPort.setBounds({
										x: [mapWidth * -1, mapWidth * 4],
										y: [mapHeight * -1, mapHeight * 4],
									});
									viewPort.camera.centerFitAreaIntoView({
										left: mapWidth * 1.2,
										top: mapHeight * 1.2,
										width: 1000,
										height: 1000,
									});
								}}>
								<Row
									key={"Intro"}
									tiles={introTiles[0]}
									mapSelection={mapSelection}
									lastSnapshot={null}
									neighborTiles={introTiles}
									editSelection={editSelection}
									TILE_PIXELS={TILE_PIXELS}
									loggedIn={false}
								/>
							</Space>
						</div>
					</>
				)}
		</div>
			</ThemeProvider>
	);
}

export default App;
