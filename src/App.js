import React, { useRef, useState } from 'react';
import './App.css';
import jsonTiles from "./map.json";
import ToggleButtons from "./components/ToggleButtons";





function App() {

  const [tiles, setTiles] = useState(jsonTiles);

  
  const handleOnClick = (tile) => {
    console.log(tile);
    let tempTiles = tiles;
    tempTiles[tile.key].color = "#000000";
    setTiles([...tempTiles]);
  }

  return (
    <div className="App">

<ToggleButtons/>


      <div className="Grid">
          {tiles.map((tile, i) => <div onClick={() => handleOnClick(tile)} key={tile.key} style={{background: tile.color}} className="tile"></div>)}
      </div>
    </div>
  );
}



export default App;