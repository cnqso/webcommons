import React, { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';




function ToggleButtons(props) {

    const [alignment, setAlignment] = useState('road');
  
    const handleChange = (event, newAlignment) => {
      setAlignment(newAlignment);
      props.setEditSelection(newAlignment);
    };


    function sendTickRequest() {
      props.sendRequest("POST", 0, 0, "tick", 0, "tick");
    }


    return (
      <>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        <ToggleButton value="road">Road</ToggleButton>
        <ToggleButton value="residential">Residential</ToggleButton>
        <ToggleButton value="commercial">Commercial </ToggleButton>
        <ToggleButton value="industrial">Industrial</ToggleButton>
        <ToggleButton value="coal">Power</ToggleButton>
        <ToggleButton value="delete">Bulldoze</ToggleButton>
        <ToggleButton value="info">?</ToggleButton>
      </ToggleButtonGroup>
      <span><button onClick={sendTickRequest}>Simulate one tick</button></span>
      </>
    );
  }

  export default ToggleButtons