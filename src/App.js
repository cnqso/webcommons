import React, { useRef, useState } from 'react';
import './App.css';
import jsonTiles from "./map.json";
import ToggleButtons from "./components/ToggleButtons";
import Canvas from "./components/Canvas";
import { Space } from 'react-zoomable-ui';
import config from './components/config';




function App() {

  const MARGIN = 0;
  const xError = 0.01;
  const yError = 0.01;
  const [tiles, setTiles] = useState(jsonTiles.slice(0, config.TILE_WIDTH*config.TILE_HEIGHT));
  const [editSelection, setEditSelection] = useState("road");

  
  const handleOnClick = (coordinates) => {
    //console.log(coordinates)
    const adjustedX = Math.floor((coordinates[0] + xError) / config.TILE_PIXELS);
    const adjustedY = Math.floor((coordinates[1] + yError) / config.TILE_PIXELS);
    //console.log(adjustedX, adjustedY);
    const tileIndex = adjustedX + (adjustedY * config.TILE_WIDTH);
    const tile = tiles[tileIndex];

    let buildingColor = "#000000";
    let buildingSize = 1;
    switch(editSelection) {
      case "road":
        buildingColor = "#463836";
        break;
      case "residential":
        buildingColor = "#700000";
        break;
      case "coal":
        buildingColor = "#ffec41";
        break;
    }

    //console.log(tile);
    let tempTiles = tiles;
    tempTiles[tile.key].color = buildingColor;
    setTiles([...tempTiles]);
  }




  return (
    <div className="App">

<ToggleButtons currentSelection = {editSelection} setEditSelection={setEditSelection}/>


<Canvas buffer={MARGIN}tiles={tiles} handleOnClick={handleOnClick}/>



    </div>
  );
}



export default App;