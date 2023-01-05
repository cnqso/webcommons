import React, { useRef, useState } from 'react';
import './App.css';
import jsonTiles from "./map.json";
import ToggleButtons from "./components/ToggleButtons";
import Canvas from "./components/Canvas";





function App() {

  const [tiles, setTiles] = useState(jsonTiles);
  const [editSelection, setEditSelection] = useState("road");

  
  const handleOnClick = (x, y) => {

    const tileIndex = x + (y * 120);
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

    console.log(tile);
    let tempTiles = tiles;
    tempTiles[tile.key].color = buildingColor;
    setTiles([...tempTiles]);
  }

  return (
    <div className="App">

<ToggleButtons currentSelection = {editSelection} setEditSelection={setEditSelection}/>

<Canvas tiles={tiles} handleOnClick={handleOnClick}/>
      {/* <div className="Grid">
          {tiles.map((tile, i) => <div onClick={() => handleOnClick(tile)} key={tile.key} style={{background: tile.color}} className="tile"></div>)}
      </div> */}
    </div>

  );
}



export default App;