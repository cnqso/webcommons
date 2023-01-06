import React, { useRef, useState } from 'react';
import './App.css';

import ToggleButtons from "./components/ToggleButtons";
import Canvas from "./components/Canvas";
import { Space } from 'react-zoomable-ui';
import config from './components/config';



function App() {

  

  
  const [editSelection, setEditSelection] = useState("road");

  





  return (
    <div className="App">

<ToggleButtons currentSelection = {editSelection} setEditSelection={setEditSelection}/>


<Canvas editSelection={editSelection}/>



    </div>
  );
}



export default App;