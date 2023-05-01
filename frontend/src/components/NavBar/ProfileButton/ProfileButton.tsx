import React from 'react';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from '@mui/material/Box';
import {Avatar, ListItemIcon, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Logout} from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import {useNavigate} from "react-router-dom";

interface ProfileButtonProps {
    currentUser: string,
    handleLogout: (event: React.FormEvent) => Promise<void>;
}

const ProfileButton = (
    {
        currentUser,
        handleLogout,
    }: ProfileButtonProps) => {

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
        <Box sx={{flexGrow: 0}}>
            <Tooltip title="Account settings">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ml: 2}}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{width: 32, height: 32}}>
                        {Array.from(currentUser)[0]}
                    </Avatar>
                </IconButton>
            </Tooltip>

            {/*// Profile menu dropdown */}
            <Menu
                sx={{
                    mt: "45px"
                }}
                id="menu-appbar"
                anchorEl={anchorEl}
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
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
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
    );
};

export default ProfileButton;