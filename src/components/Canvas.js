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
const db = getDatabase(app);



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

const Canvas = ({
	editSelection,
	mapSelection,
	sendRequest,
	mapDataLocation,
	neighborTiles,
	userData,
	setUserData,
	TILE_PIXELS,
	themeString
}) => {

	const buildingsRef = ref(db, mapDataLocation);
	const mapWidth = config.TILE_WIDTH * TILE_PIXELS;
	const mapHeight = config.TILE_HEIGHT * TILE_PIXELS;

	const clickxy = useRef([0, 0]);
	const [tiles, setTiles] = useState(jsonTiles);
	const lastSnapshot = useRef({});
	const [isOpen, setIsOpen] = useState(false);
	const [tooltipText, setTooltipText] = useState("hello");
	const [tooltipPosition, setTooltipPosition] = useState({x:0,y:0});

	const infoHandler = (x, y, clientX, clientY) => {
		//Gives tile and building information at click lcoation
		//Todo - make this a tooltip
		const thisBuildingData = lastSnapshot.current[tiles[y][x].buildingId];
		let buildingType = buildingsConfig[tiles[y][x].type].prettyName;
		let tooltipContent = (`<h1> ${buildingType} </h1>`)

		if (buildingType !== "Empty Space" && buildingType !== "Road") {
		tooltipContent = tooltipContent.concat(`<h2>Level: ${thisBuildingData.level} <br/> $ per cycle: ${thisBuildingData.level * 5}</h2>`);
		}
		if (buildingType === "Road") {
			tooltipContent = tooltipContent.concat(`<h2>Residential Supply: ${Math.floor(thisBuildingData.heatMap[0])} <br/> Industrial Supply: ${Math.floor(thisBuildingData.heatMap[1])} <br/> Commercial Supply: ${Math.floor(thisBuildingData.heatMap[2])}</h2>`);
		}
			setTooltipText("<div>" + tooltipContent + "</div>");

		//tooltip Position should be (40+x)*TILE_PIXELS, (40+y)*TILE_PIXELS
		setTooltipPosition({x:clientX, y:clientY});
		console.log(
			`Building data: \n ${tiles[y][x].buildingId}: ${JSON.stringify(
				lastSnapshot.current[tiles[y][x].buildingId],
				null,
				2
			)} \nTile data: [${x}, ${y}] \n${JSON.stringify(tiles[y][x], null, 2)}`
		);
		setIsOpen(true);

	};

	const boundsempty = (yMin, yMax, xMin, xMax) => {
		if (xMin < 0 || yMin < 0 || xMax >= config.TILE_WIDTH || yMax >= config.TILE_HEIGHT) {
			return false;
		}
		for (let i = yMin; i <= yMax; i++) {
			for (let j = xMin; j <= xMax; j++) {
				if (tiles[i][j].type !== "empty") {
					return false;
				}
			}
		}
		return true;
	};

	
	const drawBuilding = (yMin, yMax, xMin, xMax, type, id, level = 0) => {
		let tempTiles = tiles;
		let k = 0;

		//Determine the offset based on building levels
		const developmentOffset = level * 9;

		const spriteOffset =
			buildingsConfig[type].sprite.y * config.SPRITEMAP_WIDTH + buildingsConfig[type].sprite.x + developmentOffset;
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

	const editMap = (x, y, clientX, clientY) => {
		//For special buildings, send to unique handlers. Otherwise, create an arbitrary building
		if (editSelection.current === "delete") {
			deleteBuilding(tiles[y][x].buildingId);
		} else if (editSelection.current === "info") {
			infoHandler(x, y, clientX, clientY);
		} else {
			const buildingSize = buildingsConfig[editSelection.current].size;

			const { xMin, xMax, yMin, yMax } = getBounds(x, y, buildingSize);

			if (userData.money < buildingsConfig[editSelection.current].cost) {
				return;
			}

			if (boundsempty(yMin, yMax, xMin, xMax) === true) {
				const newId = newID(x, y);
				sendRequest("POST", y, x, editSelection.current, newId, mapDataLocation);
				drawBuilding(yMin, yMax, xMin, xMax, editSelection.current, newId);

				setUserData({
					...userData,
					money: userData.money - buildingsConfig[editSelection.current].cost,
				});
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
				setUserData({ ...userData, money: userData.money - 1 });
			} catch (error) {
				console.log(error);
			}
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
		setIsOpen(false);
		const adjustedX =
			Math.floor((coordinates[0] + config.X_ERROR) / TILE_PIXELS) - config.TILE_WIDTH;
		const adjustedY =
			Math.floor((coordinates[1] + config.Y_ERROR) / TILE_PIXELS) - config.TILE_HEIGHT;

		if (adjustedX >= 0 && adjustedY >= 0 && adjustedX < config.TILE_WIDTH && adjustedY < config.TILE_HEIGHT) {
			editMap(adjustedX, adjustedY, coordinates[2], coordinates[3]);
		}
	};
	//This function is in charge of keeping the map in sync with the database
	//In the current configuration, this is largely uncessary.
	//However, it prevents many potential bugs and would be useful if I ever redesign the game
	useEffect(() => {
		onValue(buildingsRef, (snapshot) => {
			const data = snapshot.val();
			const oldKeys = Object.keys(lastSnapshot.current);
			const keys = Object.keys(data);
			let lastSnapshotLength = oldKeys.length;

			let tempTiles2 = tiles;

			if (keys.length < lastSnapshotLength) {
				//search for deleted buildings
				for (let i = 0; i < lastSnapshotLength; i++) {
					if (!data[oldKeys[i]] && lastSnapshot.current[oldKeys[i]]) {
						try {
						const { x, y, building } = lastSnapshot.current[oldKeys[i]];
						const { xMin, xMax, yMin, yMax } = getBounds(x, y, buildingsConfig[building].size);
						drawBuilding(yMin, yMax, xMin, xMax, "empty", "");
						} catch (e) {
							console.log(e);
						}
					}
				}
				lastSnapshot.current = data;
				lastSnapshotLength = keys.length;
			} else {
				//Check the previous snapshot length and render all objects after that
				//Building IDs are chronological by time for this purpose, best of both worlds of arrays and objects
				for (let i = lastSnapshotLength; i < keys.length; i++) {
					let thisBuilding = data[keys[i]];
					try {
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
						buildingsConfig[thisBuilding.building].sprite.y * config.SPRITEMAP_WIDTH +
						buildingsConfig[thisBuilding.building].sprite.x +
						developmentOffset;
					for (let j = yMin; j <= yMax; j++) {
						for (let k = xMin; k <= xMax; k++) {
							tempTiles2[j][k].type = thisBuilding.building;
							tempTiles2[j][k].buildingId = keys[i];
							tempTiles2[j][k].spriteIndex = spriteOffset + l;
							l++;
						}
					}
				}
					catch (e) {
						console.log(thisBuilding, e);
						sendRequest("DELETE", 0, 0, "delete", keys[i], mapDataLocation);
					}
				}

				setTiles([...tempTiles2]);
			}

			//Lastly, check for important changes to buildings
			for (let i = 0; i < keys.length; i++) {
				if (lastSnapshot.current[keys[i]] === undefined) continue;
				if (data[keys[i]].level !== lastSnapshot.current[keys[i]].level) {
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
						TILE_PIXELS={TILE_PIXELS}
						loggedIn={true}
						isOpen = {isOpen}
						tooltipText = {tooltipText}
						tooltipPosition = {tooltipPosition}
						themeString = {themeString}
					/>
				</Pressable>
			</Space>
		</div>
	);
};

export default Canvas;
