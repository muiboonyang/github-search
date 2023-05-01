import React from 'react';
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";

const Logo = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{flexGrow: 1}}>
            <Typography
                variant="h6"
                noWrap
                component="a"
                 onClick={() => {
                     navigate("/");
                 }}
                sx={{
                    mr: 2,
                    display: "flex",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".1rem",
                    color: "inherit",
                    textDecoration: "none",
                    "&:hover": {
                        color: "white",
                    },
                }}
            >
                <Box sx={{
                    cursor: 'pointer',
                    display: "flex",
                }} >
                    <GitHubIcon
                        sx={
                            {
                                // display: {xs: "none", md: "flex"},
                                display: "flex",
                                mr: 1,

                            }
                        }
                    />
                    <SearchIcon
                        sx={
                            {
                                // display: {xs: "none", md: "flex"},
                                display: "flex",
                                mr: 1,
                            }
                        }
                    />
                </Box>
            </Typography>
        </Box>
    );
};

export default Logo;