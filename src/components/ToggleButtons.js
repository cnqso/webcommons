/** @format */

import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SvgIcon from "@mui/material/SvgIcon";
import { pink } from "@mui/material/colors";
import FactoryIcon from "@mui/icons-material/Factory";
import StoreIcon from "@mui/icons-material/Store";
import HouseIcon from "@mui/icons-material/House";
import PanoramaIcon from "@mui/icons-material/Panorama";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tooltip from "@mui/material/Tooltip";
import "./ToggleButtons.css";

function ToggleButtons(props) {
	const [map, setMap] = useState("city");
	const [alignment, setAlignment] = useState("road");

	let orientation = "horizontal";
	const matches = useMediaQuery("(min-width:600px)");
	if (matches) {
		orientation = "vertical";
	}

	const handleChange = (event, newAlignment) => {
		setAlignment(newAlignment);
		props.setEditSelection(newAlignment);
	};

	const handleMapChange = (event) => {
		props.setMapSelection(event.target.value);
	};
	function sendTickRequest() {
		props.sendRequest("POST", 0, 0, "tick", 0, 0, "tick", "tick");
	}

	const Text = styled("div")(({ theme }) => ({
		...theme.typography.ToggleButton,
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(0),
		//lime green hex code:
		color: "#32CD32",
		margin: 0,
		//center text
		textAlign: "center",
	}));

	const MapSelection = (matches) => {
		let label = "";
		let maxWidth = 70;
		let maxHeight = 40;
		if (!matches) {
			label = "Map"
			maxWidth = 70;
			maxHeight = 70;
		}
		return (
			<FormControl sx={{ m: (!matches), maxHeight: maxHeight, maxWidth: maxWidth, pt: (!matches) }} size='small'>
				{matches ? <InputLabel/> : <InputLabel id='map-select' sx={{ mt: 1 }}>
					Map
				</InputLabel>}
				<Select
					labelId='map-select'
					id='map-select'
					value={props.mapSelection}
					label={label}
					onChange={handleMapChange}>
					<MenuItem value={"city"}>
						<LocationCityIcon />
					</MenuItem>
					<MenuItem value={"resDemand"}>
						<HouseIcon />
					</MenuItem>
					<MenuItem value={"indDemand"}>
						<FactoryIcon />
					</MenuItem>
					<MenuItem value={"comDemand"}>
						<StoreIcon />
					</MenuItem>
				</Select>
			</FormControl>
		);
	};

	return (
		<Paper className='toggleButtons'>
			<button onClick={sendTickRequest}>tick</button>
			<ToggleButtonGroup
				color='primary'
				value={alignment}
				exclusive
				onChange={handleChange}
				aria-label='Platform'
				orientation={orientation}
				
				>
          {matches ? 
				<Text variant='outlined' square sx={{ borderRadius: 1 }}>
					<h2 style={{ margin: 3, padding: 0 }}>${props.userData.money}</h2>
				</Text> : null}
				<ToggleButton value='road'>
					{matches ? (
						"Road"
					) : (
						<Tooltip title='Road'>
							<LocationCityIcon />
						</Tooltip>
					)}
				</ToggleButton>
				<ToggleButton value='pole'>
					{matches ? (
						"Pole"
					) : (
						<Tooltip title='Pole'>
							<LocationCityIcon />
						</Tooltip>
					)}
				</ToggleButton>
				<ToggleButton value='residential'>
					{matches ? (
						"Residential"
					) : (
						<Tooltip title='Residential'>
							<LocationCityIcon />
						</Tooltip>
					)}
				</ToggleButton>
				<ToggleButton value='commercial'>
					{matches ? (
						"Commercial"
					) : (
						<Tooltip title='Commercial'>
							<LocationCityIcon />
						</Tooltip>
					)}{" "}
				</ToggleButton>
				<ToggleButton value='industrial'>
					{matches ? (
						"Industrial"
					) : (
						<Tooltip title='Industrial'>
							<LocationCityIcon />
						</Tooltip>
					)}
				</ToggleButton>
				<ToggleButton value='coal'>
					{matches ? (
						"Coal"
					) : (
						<Tooltip title='Coal'>
							<LocationCityIcon />
						</Tooltip>
					)}
				</ToggleButton>
				<ToggleButton value='delete'>
					{matches ? (
						"Bulldoze"
					) : (
						<Tooltip title='Bulldoze'>
							<LocationCityIcon />
						</Tooltip>
					)}
				</ToggleButton>
				<ToggleButton value='info'>
					{matches ? (
						"Info"
					) : (
						<Tooltip title='Info'>
							<LocationCityIcon />
						</Tooltip>
					)}
				</ToggleButton>
				{matches ? MapSelection() : null}
			</ToggleButtonGroup>
			<br />
			{matches ? null : <>
			<MapSelection/> 	<Text sx={{ display: "inline-block", p:0, m:"auto", align:"center", left:5}}>
					<h2 style={{margin: 10}} >${props.userData.money}</h2>
				</Text> </>}
		</Paper>
	);
}

export default ToggleButtons;
