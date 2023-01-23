import React, { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SvgIcon from '@mui/material/SvgIcon';
import { pink } from '@mui/material/colors';
import FactoryIcon from '@mui/icons-material/Factory';
import StoreIcon from '@mui/icons-material/Store';
import HouseIcon from '@mui/icons-material/House';
import PanoramaIcon from '@mui/icons-material/Panorama';
import LocationCityIcon from '@mui/icons-material/LocationCity';




function ToggleButtons(props) {
    const [map, setMap] = useState('city');
    const [alignment, setAlignment] = useState('road');
  
    const handleChange = (event, newAlignment) => {
      setAlignment(newAlignment);
      props.setEditSelection(newAlignment);
    };

    const handleMapChange = (event) => {
      props.setMapSelection(event.target.value);

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
      <FormControl sx={{ m: 1, minWidth: 50 }} size="small">
      <InputLabel id="demo-select-small">Map</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={props.mapSelection}
        label="Map"
        onChange={handleMapChange}
      >
        <MenuItem value={"city"}><LocationCityIcon/></MenuItem>
        <MenuItem value={"resDemand"}>          <HouseIcon/></MenuItem>
        <MenuItem value={"indDemand"}><FactoryIcon/></MenuItem>
        <MenuItem value={"comDemand"}><StoreIcon/></MenuItem>
      </Select>
    </FormControl>
      <span><button onClick={sendTickRequest}>Simulate one tick</button></span>
      </>
    );
  }

  export default ToggleButtons