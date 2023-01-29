/** @format */

import React, { useState, useRef, useEffect } from "react";
import jsonTiles from "../map.json";
import "./Canvas.css";
import { Space, Pressable, PressEventCoordinates } from "react-zoomable-ui";
import config from "./config";
import Row from "./Row";
import buildingsConfig from "./buildingsConfig.json";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get, child } from "firebase/database";

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
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);
const db = getDatabase();
//For some reason, calling the database a second time helped debounce the database calls
//Deleting the getDatabase(app) call broke the code
//Worth investigating, this is too ugly even for me

//Since the react-zoomable-component box only takes hardcoded pixel values, we need to size it in javascript
//TODO: Make it work cleaner. I might be able to just wrap it in a css container and give it an arbitrarily large constant value
const useWindowSize = () => {
	const [windowSize, setWindowSize] = React.useState({
		width: 1000,
		height: 1000,
	});

	React.useEffect(() => {
		const handleResize = () =>
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});

		window.addEventListener("resize", handleResize);

		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return windowSize;
};

//Was needed for the old method of memoizing dom components. Keeping it here in case I need it again
function checksum(array) {
	var chk = 0x12345678;
	let x = 0;
	for (let i = 0; i < array.length; i++) {
		let len = array[i].type.length;
		for (let j = 0; j < len; j++) {
			chk += array[i].type.charCodeAt(j) * (x + 1);
			x++;
		}
	}
	return (chk & 0xffffffff).toString(16);
}

//Custom method for generating unique chronological IDs
//Returns a short string, functionally the time in duotrigesimal plus a checksum of the x, y, and building
function newID(x, y) {
	const time = (Date.now() - 1672549200000).toString(32);
	const newId = time.concat((x + y * 120).toString(32));
	return newId;
}

const Canvas = ({ editSelection, mapSelection, sendRequest, mapDataLocation, neighborTiles, userData, setUserData }) => {
	const buildingsRef = ref(db, mapDataLocation);
	const userLocationsRef = ref(db, "userLocations");
	const { width, height } = useWindowSize();
	const mapWidth = config.TILE_WIDTH * config.TILE_PIXELS;
	const mapHeight = config.TILE_HEIGHT * config.TILE_PIXELS;

	const clickxy = useRef([0, 0]);
	const [tiles, setTiles] = useState(jsonTiles);
	const [surroundingTiles, setSurroundingTiles] = useState([[0],[0],[0],[0],[1],[1],[1],[1]]);
	const lastSnapshot = useRef({});

	const infoHandler = (x, y) => {
		//Gives tile and building information at click lcoation
		//Todo - make this a tooltip
		console.log(
			`Building data: \n ${tiles[y][x].buildingId}: ${JSON.stringify(
				lastSnapshot.current[tiles[y][x].buildingId],
				null,
				2
			)} \nTile data: [${x}, ${y}] \n${JSON.stringify(tiles[y][x], null, 2)}`
		);
	};

	const boundsempty = (yMin, yMax, xMin, xMax) => {
		if (xMin < 0 || yMin < 0 || xMax >= config.TILE_WIDTH || yMax >= config.TILE_HEIGHT) {
			console.log("Out of bounds");
			return false;
		}
		for (let i = yMin; i <= yMax; i++) {
			for (let j = xMin; j <= xMax; j++) {
				if (lastSnapshot.current[tiles[i][j].buildingId]) {
					console.log("Space already occupied");
					return false;
				}
			}
		}
		return true;
	};

	//Update the tilemap according to building type.
	//The tilemap takes in the building type, the ID of its associated building, and the index of its sprite in the sprite sheet
	//For some buildings, we also need to take additional info like development level or traffic
	const drawBuilding = (yMin, yMax, xMin, xMax, type, id, level = 0) => {
		let tempTiles = tiles;
		let k = 0;

		//Determine the offset based on building levels
		const developmentOffset = level * 9;

		const spriteOffset =
			buildingsConfig[type].sprite.y * 16 + buildingsConfig[type].sprite.x + developmentOffset;
		for (let i = yMin; i <= yMax; i++) {
			for (let j = xMin; j <= xMax; j++) {
				tempTiles[i][j].type = type;
				tempTiles[i][j].buildingId = id;
				tempTiles[i][j].spriteIndex = spriteOffset + k;
				k++;
			}
		}
		setTiles([...tempTiles]);
	};

	const editMap = (x, y) => {
		//For special buildings, send to unique handlers. Otherwise, create an arbitrary building
		if (editSelection.current === "delete") {
			deleteBuilding(tiles[y][x].buildingId);
		} else if (editSelection.current === "info") {
			infoHandler(x, y);
		} else {
			const buildingSize = buildingsConfig[editSelection.current].size;

			const { xMin, xMax, yMin, yMax } = getBounds(x, y, buildingSize);

			if (userData.money < buildingsConfig[editSelection.current].cost) {
				console.log("Not enough money");
				return;
			}

			if (boundsempty(yMin, yMax, xMin, xMax) === true) {
				const newId = newID(x, y);
				sendRequest("POST", y, x, editSelection.current, newId, mapDataLocation);
				drawBuilding(yMin, yMax, xMin, xMax, editSelection.current, newId);

				setUserData({...userData, money: userData.money - buildingsConfig[editSelection.current].cost});
			}
		}
	};

	const deleteBuilding = (buildingID) => {
		if ("allowed to do this" !== "placeholder" && buildingID) {
			try {
				const { x, y, building } = lastSnapshot.current[buildingID];
				const { xMin, xMax, yMin, yMax } = getBounds(x, y, buildingsConfig[building].size);
				sendRequest("DELETE", y, x, "delete", buildingID, mapDataLocation);
				drawBuilding(yMin, yMax, xMin, xMax, "empty", "");
				setUserData({...userData, money: userData.money - 1})
			} catch (error) {
				console.log(error);
			}
		} else {
			console.log("There is no building there");
		}
	};

	const getBounds = (x, y, size) => {
		const xMin = x - Math.floor((size - 1) / 2);
		const xMax = x + Math.floor(size / 2);
		const yMin = y - Math.floor((size - 1) / 2);
		const yMax = y + Math.floor(size / 2);
		return { xMin, xMax, yMin, yMax };
	};

	const handleOnClick = (coordinates) => {
		const adjustedX = Math.floor((coordinates[0] + config.X_ERROR) / config.TILE_PIXELS) - config.TILE_WIDTH;
		const adjustedY = Math.floor((coordinates[1] + config.Y_ERROR) / config.TILE_PIXELS) - config.TILE_HEIGHT;

		if ("authentication" !== "placeholder") {
			editMap(adjustedX, adjustedY);
		}
	};

	//Listen to the database for changes and update immediately
	//Calls once on initial render, but never closes the listener
	//TODO: Ensure update on deletes, not just adds -- rename lastSnapshot to currentSnapshot
	useEffect(() => {
		onValue(buildingsRef, (snapshot) => {
			const data = snapshot.val();
			const oldKeys = Object.keys(lastSnapshot.current);
			const keys = Object.keys(data);
			let lastSnapshotLength = oldKeys.length;

			let tempTiles2 = tiles;

			if (keys.length < lastSnapshotLength) {
				//search for deleted buildings
				console.log("something was deleted");
				for (let i = 0; i < lastSnapshotLength; i++) {
					if (!data[oldKeys[i]]) {
						const { x, y, building } = lastSnapshot.current[oldKeys[i]];
						const { xMin, xMax, yMin, yMax } = getBounds(x, y, buildingsConfig[building].size);
						drawBuilding(yMin, yMax, xMin, xMax, "empty", "");
					}
				}
				lastSnapshot.current = data;
				lastSnapshotLength = keys.length;
			} else {
				//Check the previous snapshot length and render all objects after that
				//Building IDs are chronological by time for this purpose, best of both worlds of arrays and objects
				for (let i = lastSnapshotLength; i < keys.length; i++) {
					let thisBuilding = data[keys[i]];
					let { xMin, xMax, yMin, yMax } = getBounds(
						thisBuilding.x,
						thisBuilding.y,
						buildingsConfig[thisBuilding.building].size
					);
					//This is like editMap() but doesn't change state until all calculations are done. Faster.
					//TODO: tempTiles was already a bad enough variable name
					let l = 0;
					let developmentOffset = thisBuilding.level * 9;

					const spriteOffset =
						buildingsConfig[thisBuilding.building].sprite.y * 16 +
						buildingsConfig[thisBuilding.building].sprite.x +
						developmentOffset;
					for (let j = yMin; j <= yMax; j++) {
						for (let k = xMin; k <= xMax; k++) {
							tempTiles2[j][k].type = thisBuilding.building; //Turn back all ye who enter the 7th tab of hell
							tempTiles2[j][k].buildingId = keys[i];
							tempTiles2[j][k].spriteIndex = spriteOffset + l;
							l++;
							//Splitting imperative code is hard/ugly in react and useEffect has weird scoping problems
							//You don't know what I've been through trying to get this to run well
							//12,000 DOM elements is a lot, and react is not built for that
							//Those motherfuckers on stack overflow said it was impossible
							//I had to implement a checksum to hack around react's shitty diffing. TWICE.
							//Look at me now, 100 memos, 12,000 DOM elements, and a 5ms render time
							//Thanks for reading
						}
					}
				}

				setTiles([...tempTiles2]);
			}

			//Lastly, check for important changes to buildings
			for (let i = 0; i < keys.length; i++) {
				if (lastSnapshot.current[keys[i]] === undefined) continue;
				if (data[keys[i]].level !== lastSnapshot.current[keys[i]].level) {
					console.log("Level changed");
					let thisBuilding = data[keys[i]];
					let { xMin, xMax, yMin, yMax } = getBounds(
						thisBuilding.x,
						thisBuilding.y,
						buildingsConfig[thisBuilding.building].size
					);
					drawBuilding(yMin, yMax, xMin, xMax, thisBuilding.building, keys[i], thisBuilding.level);
				}
			}
			lastSnapshot.current = data;
			//Save the length of the snapshot so that we only render the
		});
	}, []);



	// useEffect(() => {
	// 	get(child(dbRef, `users/${userId}`)).then((snapshot) => {
	// 		if (snapshot.exists()) {
	// 		  console.log(snapshot.val());
	// 		} else {
	// 		  console.log("No data available");
	// 		}
	// 	  }).catch((error) => {
	// 		console.error(error);
	// 	  });
	// 	console.log("run exactly once")
	// },[]
	// ) ;

	//Tooltip should live at exactly client 0,0 at all times and on click move to the offset of clickxy.current clientX and clientY
	return (
		<div
			className='Canvas'
			style={{
				position: "relative",
			}}>
			<Space
				onDecideHowToHandlePress={(e, coords) => {
					clickxy.current = [coords.x, coords.y, coords.clientX, coords.clientY]; //[virtualx, virtualy, clientX, clientY] ommited are containerX and containerY
				}}
				//onHover={(e, c) => setHover(c)}
				style={{ border: "solid 1px black" }}
				onCreate={(viewPort) => {
					viewPort.setBounds({
						x: [mapWidth * -3, mapWidth * 6],
						y: [mapHeight * -3, mapHeight * 6],
					});
					viewPort.camera.centerFitAreaIntoView({
						left: mapWidth*3 / 10,
						top: mapHeight*3 / 10,
						width: 1000,
						height: 1000,
					});
				}}>
				<Pressable
					style={{ width: `${mapWidth}`, height: `${mapHeight}` }}
					onTap={() => {
						handleOnClick(clickxy.current);
					}}>
					<Row
						rowChecksum={checksum(tiles[0])}
						tiles={tiles}
						mapSelection={mapSelection}
						lastSnapshot={lastSnapshot}
						neighborTiles={neighborTiles}
					/>
				</Pressable>
			</Space>
		</div>
	);
};

export default Canvas;
