/** @format */

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import "./NavBar.css";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import Switch from "@mui/material/Switch";
import Modal from "@mui/material/Modal";

const modalStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

export default function NavBar({ signIn, signOut, user, userName }) {
	const [aboutOpen, setAboutOpen] = useState(false);
	const [howToOpen, setHowToOpen] = useState(false);
	const [nightMode, setNightMode] = useState(false);
	const [state, setState] = useState("closed");

	const toggleDrawer = (open) => (event) => {
		setState({ ...state, 'left': open });
	};
	const onNightMode = () => setNightMode(!nightMode);
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
						<InboxIcon />
					</ListItemIcon>
					<ListItemText id='switch-list-label-nightmode' primary='NIGHT MODE' />
					<Switch
						edge='end'
						onChange={onNightMode}
						checked={nightMode}
						inputProps={{
							"aria-labelledby": "switch-list-label-nightmode",
						}}
					/>
				</ListItem>
				<ListItem key={"HOW TO"} disablePadding>
					<ListItemButton onClick={handleHowToOpen}>
						<ListItemIcon>
							<InboxIcon />
						</ListItemIcon>
						<ListItemText primary={"HOW TO"} />
					</ListItemButton>
				</ListItem>

				<ListItem key={"ABOUT"} disablePadding>
					<ListItemButton onClick={handleAboutOpen}>
						<ListItemIcon>
							<InboxIcon />
						</ListItemIcon>
						<ListItemText primary={"ABOUT"} />
					</ListItemButton>
				</ListItem>
				{user ? (
					<ListItem key={"LOGOUT"} disablePadding>
						<ListItemButton onClick={signOut}>
							<ListItemIcon>
								<InboxIcon />
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
			<Drawer anchor={"left"} open={state["left"]} onClose={toggleDrawer(false)}>
				{list("left")}
			</Drawer>
			<Modal open={aboutOpen} onClose={handleAboutClose} aria-labelledby='modal-about'>
				<Box sx={modalStyle}>
					<Typography id='modal-about' variant='h6' component='h2'>
						About
					</Typography>
					<Typography id='modal-about-body' sx={{ mt: 2 }}>
						Based on the original sim city
						Tech stack: React, Firebase Realtime Database NoSQL, Google Cloud Functions
						Personal site, github, technical blog
					</Typography>
				</Box>
			</Modal>
			<Modal open={howToOpen} onClose={handleHowToClose} aria-labelledby='modal-how-to'>
				<Box sx={modalStyle}>
					<Typography id='modal-how-to' variant='h6' component='h2'>
						How to play
					</Typography>
					<Typography id='modal-how-to-body' sx={{ mt: 2 }}>
						Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
					</Typography>
				</Box>
			</Modal>
			<AppBar position='static' style={{ background: "black" }}>
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
