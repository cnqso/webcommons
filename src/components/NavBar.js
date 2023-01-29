import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import "./NavBar.css";

export default function NavBar({ signIn, signOut, user, userName }) {
	return (
		<Box className="NavBar" sx={{ flexGrow: 1 }}>
			<AppBar position="static" style={{ background: "black" }}>
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1 }}
					>
						{/* News */}
					</Typography>
					{!user ? (
						<Button color="inherit" onClick={signIn}>
							Login
						</Button>
					) : (
						<Button color="inherit" onClick={signOut}>
							{userName}
						</Button>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
}
