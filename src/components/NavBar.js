/** @format */

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {LogOutIcon, AboutIcon, QuestionIcon, SunMoonIcon, GithubIcon, WebsiteIcon, ResidentialIcon, IndustrialIcon, CommercialIcon} from "./icons";
import "./NavBar.css";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import Modal from "@mui/material/Modal";

const modalStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "50%",
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 3,
};

export default function NavBar({ signIn, signOut, user, userName, darkMode, setDarkMode }) {
	const [aboutOpen, setAboutOpen] = useState(false);
	const [howToOpen, setHowToOpen] = useState(false);
	const [drawer, setDrawer] = useState(false);

	const toggleDrawer = (open) => (event) => {
		setDrawer(!drawer);
	};
	const onDarkMode = () => setDarkMode(!darkMode);
	const handleAboutOpen = () => setAboutOpen(true);
	const handleAboutClose = () => setAboutOpen(false);
	const handleHowToOpen = () => setHowToOpen(true);
	const handleHowToClose = () => setHowToOpen(false);

	const list = (anchor) => (
		<Box
			sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
			role='presentation'
			onKeyDown={toggleDrawer(anchor, false)}>
			<List>
				<ListItem>
					<ListItemIcon>
						<SunMoonIcon />
					</ListItemIcon>
					<ListItemText id='switch-list-label-Darkmode' primary='DARKMODE' />
					<Switch
						color="primary"
						edge='end'
						onChange={onDarkMode}
						checked={darkMode}
						inputProps={{
							"aria-labelledby": "switch-list-label-darkmode",
						}}
					/>
				</ListItem>
				<ListItem key={"HOW TO"} disablePadding>
					<ListItemButton onClick={handleHowToOpen}>
						<ListItemIcon>
							<QuestionIcon />
						</ListItemIcon>
						<ListItemText primary={"HOW TO"} />
					</ListItemButton>
				</ListItem>

				<ListItem key={"ABOUT"} disablePadding>
					<ListItemButton onClick={handleAboutOpen}>
						<ListItemIcon>
							<AboutIcon />
						</ListItemIcon>
						<ListItemText primary={"ABOUT"} />
					</ListItemButton>
				</ListItem>
				{user ? (
					<ListItem key={"LOGOUT"} disablePadding>
						<ListItemButton onClick={signOut}>
							<ListItemIcon>
								<LogOutIcon />
							</ListItemIcon>
							<ListItemText primary={"LOGOUT"} />
						</ListItemButton>
					</ListItem>
				) : null}
			</List>
		</Box>
	);

	return (
		<Box className='NavBar' sx={{ flexGrow: 1 }}>
			<Drawer anchor={"left"} open={drawer} onClose={toggleDrawer(false)}>
				{list("left")}
			</Drawer>
			<Modal open={aboutOpen} onClose={handleAboutClose} aria-labelledby='modal-about'>
				<Box sx={modalStyle}>
					<h2>
						About
					</h2>
						Commons is an minimal city-builder web app. Users build persistent cities in an asynchronous multiplayer mosaic of 40x40 squares. Its mechanics are based on Sim City 1989.
						<hr />
						The front end was built with React, leaning heavily on HTML Canvas and Material UI. 
						<br/>
						The back end was built using Node.js, Express, and GCP.
						<br/>
						For more information, see the <a href="https://www.google.com/" target="_blank" rel="noreferrer">overlong technical blog</a>
						<div className='centerSpan'>
						   <WebsiteIcon ic="menubtn"/> <GithubIcon ic="menubtn"/>  
						</div>
				</Box>
			</Modal>
			<Modal open={howToOpen} onClose={handleHowToClose} aria-labelledby='modal-how-to'>
				<Box sx={modalStyle}>
					<Typography id='modal-how-to' variant='h6' component='h2'>
						How to play
					</Typography>
					<Typography id='modal-how-to-body' sx={{ mt: 2 }}>
						Commons is a game made to be played over many days. There is no predetermined goal.
						<br />
						<br/>
						Every 15 minutes, the game will update and the world will change. At this time, 
						you will receive money from your buildings and all of your 'zones' will have a chance of growth or decay. 
						<br />
						<br/>
						There are 3 types of zones: residential <ResidentialIcon ic="smallbtn"/>, commercial <CommercialIcon ic="smallbtn"/>, 
						and industrial <IndustrialIcon ic="smallbtn"/>. Each zone generates supply and demand of/for their respective good, service, or labor.
						You can view the relative supply of each zone by selecting its icon in the map dropdown. Darker colors indicate a high relative supply, 
						and lighter colors indicate a low relative supply. Buildings grow faster when the local supply of their good, service, or labor is comparatively low.
						<br />
						<br/>
						Buildings cost money to build, and generate money over time. Power plants cost X, zones cost y, and roads/power lines cost z.
					</Typography>
				</Box>
			</Modal>
			<AppBar position='static' sx={{color: 'appBarText', backgroundColor: 'appBar'}} >
				<Toolbar>
					<IconButton
						size='large'
						edge='start'
						color='inherit'
						aria-label='menu'
						sx={{ mr: 2 }}
						onClick={toggleDrawer("left", true)}>
						<MenuIcon />
					</IconButton>
					<Typography sx={{ flexGrow: 1 }}>{}</Typography>
					{!user ? (
						<Button color='inherit' onClick={signIn}>
							<Typography variant='h6'>Login</Typography>
						</Button>
					) : (
						<Typography variant='h6'>{userName}</Typography>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
}
