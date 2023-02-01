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


export default function NavBar({ signIn, signOut, user, userName }) {
	function onMenuClick() {
		console.log("hello");
	}
	function onNightMode() {
		setNightMode(!nightMode);
		console.log("hello");
	}

	const [nightMode, setNightMode] = useState(false);
	const [state, setState] = React.useState("closed");
	const toggleDrawer = (anchor, open) => (event) => {
		if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

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
					<ListItemButton>
						<ListItemIcon>
							<InboxIcon />
						</ListItemIcon>
						<ListItemText primary={"HOW TO"} />
					</ListItemButton>
				</ListItem>

				<ListItem key={"ABOUT"} disablePadding>
					<ListItemButton>
						<ListItemIcon>
							<InboxIcon />
						</ListItemIcon>
						<ListItemText primary={"ABOUT"} />
					</ListItemButton>
				</ListItem>
				<ListItem key={"LOGOUT"} disablePadding>
					<ListItemButton>
						<ListItemIcon>
							<InboxIcon />
						</ListItemIcon>
						<ListItemText primary={"LOGOUT"} />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);

	return (
		<Box className='NavBar' sx={{ flexGrow: 1 }}>
			<Drawer anchor={"left"} open={state["left"]} onClose={toggleDrawer("left", false)}>
				{list("left")}
			</Drawer>
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
						<Button color='inherit' onClick={signOut}>
							<Typography variant='h6'>{userName}</Typography>
						</Button>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
}
