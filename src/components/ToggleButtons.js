/** @format */

import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tooltip from "@mui/material/Tooltip";
import "./ToggleButtons.css";
import {
	AboutIcon,
	BulldozeIcon,
	CityIcon,
	CommercialIcon,
	IndustrialIcon,
	NuclearIcon,
	PoleIcon,
	ResidentialIcon,
	RoadIcon,
} from "./icons";

function ToggleButtons(props) {
	const theme = props.theme;
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

	const Text = styled("h1")(({theme}) => ({
		color: theme.palette.primary.main,
		textAlign: "center",
		margin: "auto", 
	}));

	const MapSelection = (matches) => {
		let label = "";
		let topPadding = '-4px';
		if (!matches) {
			label = "Map";
			topPadding = '10px';
		}

		return (
			<FormControl
			color='primary'
				sx={{ m:"5px", maxHeight: 70, maxWidth: 70, pt: topPadding }}
				size='small'>
				{matches ? ( null
				) : (
					<InputLabel id='map-select' sx={{ mt: 1 }}>
						Map
					</InputLabel>
				)}
				<Select
					color='primary'
					id='map-select'
					value={props.mapSelection}
					label={label}
					onChange={handleMapChange}>
					<MenuItem value={"city"}>
						<CityIcon ic={'menubtn'}/>
					</MenuItem>
					<MenuItem value={"resDemand"}>
						<ResidentialIcon ic={'menubtn'}/>
					</MenuItem>
					<MenuItem value={"indDemand"}>
						<IndustrialIcon ic={'menubtn'}/>{" "}
					</MenuItem>
					<MenuItem value={"comDemand"}>
						<CommercialIcon ic={'menubtn'}/>
					</MenuItem>
				</Select>
			</FormControl>
		);
	};

	return (
		<Paper className='toggleButtons'>
			{matches ? <button onClick={sendTickRequest}>tick</button> : null}
			<ToggleButtonGroup
				color='primary'
				value={alignment}
				exclusive
				onChange={handleChange}
				aria-label='Platform'
				orientation={orientation}>
				{matches ? (
					<Text>
					${props.userData.money}
				</Text>
				) : null}
				<ToggleButton value='road'>{matches ? "Road" : null} <RoadIcon ic={"btn"} /></ToggleButton>
				<ToggleButton value='pole'>{matches ? "Pole" : null} <PoleIcon ic={"btn"} /></ToggleButton>
				<ToggleButton value='residential'>
					{matches ? "Residential" : null} <ResidentialIcon ic={"btn"} />
				</ToggleButton>
				<ToggleButton value='commercial'> {matches ? "Commercial" : null}<div style={{paddingLeft: '7px'}}/> <CommercialIcon ic={"btn"} /></ToggleButton>
				<ToggleButton value='industrial'>{matches ? "Industrial" : null}<IndustrialIcon ic={"btn"} /> </ToggleButton>
				<ToggleButton value='coal'>{matches ? "Coal" : null} <NuclearIcon ic={"btn"} /></ToggleButton>
				<ToggleButton value='delete'>{matches ? "Bulldoze" : null}<BulldozeIcon ic={"btn"} /> </ToggleButton>
				<ToggleButton value='info'>{matches ? "Info" : null}<AboutIcon ic={"btn"} /> </ToggleButton>
				{matches ? MapSelection() : null}
			</ToggleButtonGroup>
			<br />
			{matches ? null : (
				<>
					<MapSelection />
					<Text>
						${props.userData.money}
					</Text>
				</>
			)}
		</Paper>
	);
}

export default ToggleButtons;
