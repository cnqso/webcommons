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
	width: "min(100vw, 500px)",
	bgcolor: "background.paper",
	fontSize: "min(3vw, 1.3em)",
	boxShadow: 15,
	p: 3,
};

export default function NavBar({ signIn, signOut, user, userName, darkMode, setDarkMode }) {
	const [aboutOpen, setAboutOpen] = useState(false);
	const [howToOpen, setHowToOpen] = useState(false);
	const [endOpen, setEndOpen] = useState(true);
	const [drawer, setDrawer] = useState(false);

	const toggleDrawer = (open) => (event) => {
		setDrawer(!drawer);
	};
	const onDarkMode = () => setDarkMode(!darkMode);
	const handleAboutOpen = () => setAboutOpen(true);
	const handleAboutClose = () => setAboutOpen(false);
	const handleHowToOpen = () => setHowToOpen(true);
	const handleHowToClose = () => setHowToOpen(false);
	const handleEndClose = () => setEndOpen(false);

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
						Commons was a minimal city-builder mmo. Users built persistent cities in an asynchronous multiplayer mosaic of 40x40 squares. Its mechanics are based on Sim City 1989.
						<hr />
						The front end was built with React, leaning heavily on HTML Canvas and Material UI. 
						<br/>
						The back end was built using Node.js, Express, and GCP.
						<br/>
						For more information, see the <a href="https://cnqso.github.io/#/Blog/post/commons" target="_blank" rel="noreferrer">overlong technical blog</a>
						<div className='centerSpan'>
						   <WebsiteIcon ic="menubtn"/> <GithubIcon ic="menubtn"/>  
						</div>
				</Box>
			</Modal>
			<Modal open={howToOpen} onClose={handleHowToClose} aria-labelledby='modal-how-to' disableScrollLock={true}>
				<Box sx={modalStyle}>
				<h2>
						How to play
						</h2>
						Commons is a game played over many days. There is no predetermined goal.
						<br/>
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
						Buildings cost money to build, and generate money over time. Power plants cost $300, zones cost $100, and roads/power lines cost $10. 
						Every building requires power to grow. Power travels across all building types, not just power lines.
						<br />
						<br/>
						There are 8 plots around you, each of which can be built on by another player. You can connect your towns together through roads, 
						power lines, or adjacent buildings. This may be mutually beneficial, but it may also be detrimental to one or both of you. Consider
						the relative supply and demand of your zones before connecting.
				</Box>
			</Modal>
			<Modal open={endOpen} onClose={handleEndClose} aria-labelledby='modal-end'>
				<Box sx={modalStyle}>
					<h2>
						Thanks for playing!
					</h2>
						After a year, I've made the decision to close Commons. My dearest apologies to the fine folks who were still playing after all that time. Thanks! 💖
						<hr />
						More detail <a href="https://cnqso.github.io/#/Blog/post/commons-hubris" target="_blank" rel="noreferrer"> here.</a>
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
