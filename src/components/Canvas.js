import React, { useState, useRef, useEffect } from "react";
import jsonTiles from "../map.json";
import { FixedSizeGrid as Grid } from "react-window";
import "./Canvas.css";
import { Space, Pressable, PressEventCoordinates } from "react-zoomable-ui";
import config from "./config";
import Row from "./Row";
import buildingsConfig from "./buildingsConfig.json";


import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, get, child } from "firebase/database";
import { useList, useListVals } from "react-firebase-hooks/database";

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
const database = getDatabase(app);

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

//It seems like React checks memoization in the naive way (store every value, check each value one at a time)
//There are 12,000*N key-value pairs that need to be checked, 120*N for each row.
//This is a lot of work for the browser to do, and it's not necessary. We can just check the checksum.
function checksum(array) {
	var chk = 0x12345678;
	let x = 0;
	for (let i = 0; i < array.length; i++) {
		let len = array[i].color.length;
		for (let j = 0; j < len; j++) {
			chk += array[i].color.charCodeAt(j) * (x + 1);
			x++;
		}
	}
	return (chk & 0xffffffff).toString(16);
}

const RowMemo = React.memo(Row);

const db = getDatabase();
const buildingsRef = ref(db, 'buildings');


const Canvas = (props) => {



	
	const MARGIN = 0;
	const xError = 0.01;
	const yError = 0.01;
	const { width, height } = useWindowSize();
	const imageWidth = config.TILE_WIDTH * config.TILE_PIXELS;
	const imageHeight = config.TILE_HEIGHT * config.TILE_PIXELS;

	const clickxy = useRef([0, 0]);
	const [tiles, setTiles] = useState(jsonTiles);
	const lastSnapshotLength = useRef(0);






	const boundsempty = (yMin, yMax, xMin, xMax) => {
		if (
			xMin < 0 ||
			yMin < 0 ||
			xMax >= config.TILE_WIDTH ||
			yMax >= config.TILE_HEIGHT
		) {
			console.log("Out of bounds");
			return false;
		}
		for (let i = yMin; i <= yMax; i++) {
			for (let j = xMin; j <= xMax; j++) {
				if (tiles[i][j].color !== "#000000") {
					console.log("Space already occupied");
					return false;
				}
			}
		}
		return true;
	};

	const drawBuilding = (yMin, yMax, xMin, xMax, color) => {
		let tempTiles = tiles;
		for (let i = yMin; i <= yMax; i++) {
			for (let j = xMin; j <= xMax; j++) {
				tempTiles[i][j].color = color;
			}
		}
		setTiles([...tempTiles]);
	};

	const editMap = (x, y) => {
		let buildingColor = "#000000";
		let buildingSize = 0;
		switch (props.editSelection.current) {
			case "road":
				buildingColor = "#463836";
				buildingSize = 1;
				break;
			case "residential":
				buildingColor = "#700000";
				buildingSize = 3;
				break;
			case "coal":
				buildingColor = "#ffec41";
				buildingSize = 5;
				break;
			case "delete":
				buildingColor = "#000000";
				buildingSize = 1;
				break;
			default:
				console.log("Invalid selection");
		}

		//checkboundaries
		const { xMin, xMax, yMin, yMax } = getBounds(x, y, buildingSize);
		//console.log(xMin, xMax, yMin, yMax);
		if (
			boundsempty(yMin, yMax, xMin, xMax) === true ||
			props.editSelection.current === "delete"
		) {
			props.sendRequest("POST", y, x, props.editSelection.current);
			drawBuilding(yMin, yMax, xMin, xMax, buildingColor);
			//if the post request fails, the tilemap will be reverted to the previous state
		}
	};

	const getBounds = (x, y, size) => {
		const xMin = x - Math.floor((size - 1) / 2);
		const xMax = x + Math.floor(size / 2);
		const yMin = y - Math.floor((size - 1) / 2);
		const yMax = y + Math.floor(size / 2);
		return { xMin, xMax, yMin, yMax };
	}

	const handleOnClick = (coordinates) => {
		//console.log(coordinates)
		const adjustedX = Math.floor(
			(coordinates[0] + xError) / config.TILE_PIXELS
		);
		const adjustedY = Math.floor(
			(coordinates[1] + yError) / config.TILE_PIXELS
		);
		//console.log(adjustedX, adjustedY);
		const tileIndex = adjustedX + adjustedY * config.TILE_WIDTH;
		const tile = tiles[adjustedY][adjustedX];

		if ("authentication" !== "placeholder") {
			editMap(adjustedX, adjustedY);
		}
	};


	useEffect(() => {
		onValue(buildingsRef, (snapshot) => {
			const data = snapshot.val();
			const keys = Object.keys(data);
			console.log(keys.length, data);

			let tempTiles2 = tiles;
			for (let i = lastSnapshotLength.current; i < keys.length; i++) {
				let thisBuilding = data[keys[i]];
				let { xMin, xMax, yMin, yMax } = getBounds(thisBuilding.x, thisBuilding.y, buildingsConfig[thisBuilding.building].size);
				for (let i = yMin; i <= yMax; i++) {
					for (let j = xMin; j <= xMax; j++) {
						tempTiles2[i][j].color = buildingsConfig[thisBuilding.building].color;
						tempTiles2[i][j].buildingId = thisBuilding.id;
						//Turn back all ye who enter the 6th tab of hell
						//Splitting imperative code is hard/ugly in react and useEffect has weird scoping problems
						//You don't know what I've been through trying to get this to work
						//12,000 DOM elements is a lot, and react is not built for that
						//Those motherfuckers on stack overflow said it was impossible
						//I had to implement a checksum to hack around react's shitty diffing. TWICE.
						//Look at me now, 100 memos, 12,000 DOM elements, and a 5ms render time
						//"Why not just use canvas?" you might ask
						//Because then I can't use react and I have to write my own rendering pipeline
						//I'm trying to be software engineer not a game dev lol
						//Thanks for reading
				}}
			}

			setTiles([...tempTiles2]);

			lastSnapshotLength.current = keys.length;
		});
	  }, []);

	return (
		<div
			style={{ width: width, height: height / 1.2, position: "relative" }}
		>
			<Space
				onDecideHowToHandlePress={(e, coords) => {
					clickxy.current = [coords.x, coords.y];
				}}
				//onHover={(e, c) => setHover(c)}
				style={{ border: "solid 1px black" }}
				onCreate={(viewPort) => {
					viewPort.setBounds({
						x: [0, imageWidth],
						y: [0, imageHeight],
					});
					viewPort.camera.centerFitAreaIntoView({
						left: 0,
						top: 0,
						width: imageWidth,
						height: imageHeight,
					});
				}}
			>
				<Pressable
					style={{
						gridTemplateColumns: `repeat(${config.TILE_WIDTH}, 8px)`,
						gridTemplateRows: `repeat(${config.TILE_HEIGHT}, 8px)`,
						width: `${imageWidth}`,
						height: `${imageHeight}`,
					}}
					className={"Grid"}
					onTap={() => {
						handleOnClick(clickxy.current);
					}}
				>
					{/* {tiles.map((row, i) => <>
            {row.map((tile, j) => <div key={j} style={{background: tile.color}} className="tile"></div>)}
          </>)} */}
					{tiles.map((row, i) => (
						<RowMemo
							key={i}
							rowChecksum={checksum(row)}
							row={row}
						/>
					))}
				</Pressable>
			</Space>
		</div>
	);
};

export default Canvas;

// const SimpleTapCountingButton = React.memo(() => {
//   const [tapCount, setTapCount] = React.useState(0);
//   const [message, setMessage] = React.useState('TAP ME');
//   return (
//     <Pressable
//       className={'prez'}
//       potentialTapStyle={{ backgroundColor: 'blue' }}
//       potentialLongTapStyle={{ backgroundColor: 'darkblue' }}
//       hoverStyle={{ backgroundColor: 'orchid' }}
//       onTap={() => {
//         props.handleOnClick(0,0)
//       }}
//       onLongTap={() => {
//         setMessage('LONG TAPPED!');
//       }}
//     >
//       {message}
//     </Pressable>
//   );
// });
