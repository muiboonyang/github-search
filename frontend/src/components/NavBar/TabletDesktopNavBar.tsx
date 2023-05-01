import React from 'react';
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./Logo/Logo";
import ProfileButton from "./ProfileButton/ProfileButton";
import LoginButton from "./LoginButton/LoginButton";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {useNavigate} from "react-router-dom";

interface TabletDesktopNavBarProps {
    currentUser: string;
    handleLogout: (event: React.FormEvent) => Promise<void>;
}

const TabletDesktopNavBar = (
    {
        currentUser,
        handleLogout,
    }: TabletDesktopNavBarProps) => {
    const navigate = useNavigate();
    return (
        <AppBar position="fixed">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Logo/>
                    {currentUser
                        ? (
                            <>
                                <Box
                                    sx={{
                                        flexGrow: 0, // 0: end of navBar, 1: middle of NavBar
                                        display: "flex"
                                    }}
                                >
                                    <Button
                                        onClick={() => {
                                            navigate("/favourites");
                                        }}
                                        sx={{my: 0, color: "white", display: "block"}}
                                    >
                                        Favourites
                                    </Button>
                                </Box>

                                <ProfileButton
                                    currentUser={currentUser}
                                    handleLogout={handleLogout}
                                />
                            </>
                        )
                        : (
                            <LoginButton/>
                        )
                    }
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default TabletDesktopNavBar;