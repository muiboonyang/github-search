import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetchApiWithJwt} from "../../utils/fetchApi";

import {RootState} from "../../redux/store";
import {useDispatch, useSelector} from "react-redux";
import {loadingStatus} from "../../redux/loadingSlice";
import {logout} from "../../redux/userSlice";

import useMediaQuery from '@mui/material/useMediaQuery';
import Container from "@mui/material/Container";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import TabletDesktopNavBar from "./TabletDesktopNavBar";
import MobileNavBar from "./MobileNavBar";
import CustomAlert from "../CustomAlert/CustomAlert";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#1976d2",
        },
    },
});

const NavBar = () => {

    ////////////////////////
    // Media Query (Tablet/Desktop)
    ////////////////////////

    const isTabletOrDesktop = useMediaQuery('(min-width:600px)');

    ////////////////////////
    // Alert
    ////////////////////////

    const [alertMessage, setAlertMessage] = useState("");

    ////////////////////////
    // Current User
    ////////////////////////

    const currentUser = useSelector((state: RootState) => state.user.name);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //================
    // GET - Log out
    //================

    const handleLogout = async (event: React.FormEvent) => {
        // prevents page from refreshing when logging out
        event.preventDefault();
        dispatch(loadingStatus());
        try {
            const {status, data}: any = await fetchApiWithJwt(
                `/api/Sessions/logout`, 'Get'
            );

            if (status === 200) {
                dispatch(logout());
                navigate("/login");
                setAlertMessage(data.message);
            }
        } catch (err) {
            console.log(err);
        }
        dispatch(loadingStatus());
    };

    return (
        <>
            <Container>
                <ThemeProvider theme={darkTheme}>
                    {isTabletOrDesktop
                        ? <TabletDesktopNavBar
                            currentUser={currentUser}
                            handleLogout={handleLogout}
                        />
                        : <MobileNavBar
                            currentUser={currentUser}
                            handleLogout={handleLogout}
                        />
                    }
                </ThemeProvider>
            </Container>

            <CustomAlert
                alertMessage={alertMessage}
                setAlertMessage={setAlertMessage}
            />
        </>
    );
};

export default NavBar;
