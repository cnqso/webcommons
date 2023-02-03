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
			label = "Map";
			maxWidth = 70;
			maxHeight = 70;
		}
		return (
			<FormControl
				sx={{ m: !matches, maxHeight: maxHeight, maxWidth: maxWidth, pt: !matches }}
				size='small'>
				{matches ? (
					<InputLabel />
				) : (
					<InputLabel id='map-select' sx={{ mt: 1 }}>
						Map
					</InputLabel>
				)}
				<Select
					labelId='map-select'
					id='map-select'
					value={props.mapSelection}
					label={label}
					onChange={handleMapChange}>
					<MenuItem value={"city"}>
						<CityIcon />
					</MenuItem>
					<MenuItem value={"resDemand"}>
						<ResidentialIcon />
					</MenuItem>
					<MenuItem value={"indDemand"}>
						<IndustrialIcon />{" "}
					</MenuItem>
					<MenuItem value={"comDemand"}>
						<CommercialIcon />
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
					<Text variant='outlined' square sx={{ borderRadius: 1 }}>
						<h2 style={{ margin: 3, padding: 0 }}>${props.userData.money}</h2>
					</Text>
				) : null}
				<ToggleButton value='road'>
					{matches ? (
						"Road"
					) : (
							<RoadIcon />
					)}
				</ToggleButton>
				<ToggleButton value='pole'>
					{matches ? (
						"Pole"
					) : (
							<PoleIcon />
					)}
				</ToggleButton>
				<ToggleButton value='residential'>
					{matches ? (
						"Residential"
					) : (
							<ResidentialIcon />
					)}
				</ToggleButton>
				<ToggleButton value='commercial'>
					{matches ? (
						"Commercial"
					) : (
							<CommercialIcon />
					)}{" "}
				</ToggleButton>
				<ToggleButton value='industrial'>
					{matches ? (
						"Industrial"
					) : (
							<IndustrialIcon />
					)}
				</ToggleButton>
				<ToggleButton value='coal'>
					{matches ? (
						"Coal"
					) : (
							<NuclearIcon />
					)}
				</ToggleButton>
				<ToggleButton value='delete'>
					{matches ? (
						"Bulldoze"
					) : (
							<BulldozeIcon />
					)}
				</ToggleButton>
				<ToggleButton value='info'>
					{matches ? (
						"Info"
					) : (
							<AboutIcon />
					)}
				</ToggleButton>
				{matches ? MapSelection() : null}
			</ToggleButtonGroup>
			<br />
			{matches ? null : (
				<>
					<MapSelection />{" "}
					<Text sx={{ display: "inline-block", p: 0, m: "auto", align: "center", left: 5 }}>
						<h2 style={{ margin: 10 }}>${props.userData.money}</h2>
					</Text>{" "}
				</>
			)}
		</Paper>
	);
}

export default ToggleButtons;
