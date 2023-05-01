import React from 'react';
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./Logo/Logo";
import LoginButton from "./LoginButton/LoginButton";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from "@mui/icons-material/Menu";
import Divider from "@mui/material/Divider";
import {Avatar, ListItemIcon} from "@mui/material";
import {FavoriteBorder, Logout} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

interface MobileNavBarProps {
    currentUser: string;
    handleLogout: (event: React.FormEvent) => Promise<void>;
}

const MobileNavBar = (
    {
        currentUser,
        handleLogout,
    }: MobileNavBarProps) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <AppBar position="fixed">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Logo/>
                    {currentUser
                        ?
                        <Box sx={{flexGrow: 0}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleClick}
                                color="inherit"
                            >
                                <MenuIcon/>
                            </IconButton>

                            <Menu
                                sx={{
                                    display: {xs: "block", md: "none"},
                                }}
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                            >

                                <MenuItem onClick={() => {
                                    handleClose();
                                    navigate("/favourites");
                                }}>
                                    <ListItemIcon>
                                        <FavoriteBorder fontSize="small"/>
                                    </ListItemIcon>
                                    Favourites
                                </MenuItem>

                                <MenuItem onClick={() => {
                                    handleClose();
                                    navigate("/profile");
                                }}>
                                    <Avatar/>
                                    {currentUser}
                                </MenuItem>

                                <Divider/>

                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <Logout fontSize="small"/>
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                        :
                        <LoginButton/>
                    }
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default MobileNavBar;