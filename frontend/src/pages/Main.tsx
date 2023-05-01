import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CustomAlert from "../components/CustomAlert/CustomAlert";
import Results from "./Results";
import Search from "./Search";
import {FavouriteIdsProps} from "../App";

const headerTheme = createTheme({
    typography: {
        h3: {
            letterSpacing: "0.1rem",
            fontSize: "2.5rem",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "bold",
            textTransform: "uppercase",
            textAlign: "center",
            paddingTop: "50px",
            paddingBottom: "50px",
        },
    },
});

export interface MainProps {
    favouriteIds: FavouriteIdsProps[];
    setFavouriteIds: (x: FavouriteIdsProps[]) => void;
}

export interface UserResultsProps {
    id: FavouriteIdsProps;
    avatar_url: string;
    html_url: string;
    login: string;
}

export interface RepoResultsProps {
    id: FavouriteIdsProps;
    name: string;
    html_url: string;
    owner: {
        id: string;
        avatar_url: string;
        html_url: string;
        login: string;
    }
}

const Main = (
    {
        favouriteIds,
        setFavouriteIds
    }: MainProps) => {

    //================
    // QUERY
    //================

    const [alertMessage, setAlertMessage] = useState("");
    const [userResults, setUserResults] = useState<UserResultsProps[]>([]);
    const [repoResults, setRepoResults] = useState<RepoResultsProps[]>([]);

    return (
        <>
            <CustomAlert
                alertMessage={alertMessage}
                setAlertMessage={setAlertMessage}
            />

            <ThemeProvider theme={headerTheme}>
                <Typography variant="h3">
                    GitHub Search
                </Typography>
            </ThemeProvider>

            <Search
                setAlertMessage={setAlertMessage}
                setUserResults={setUserResults}
                setRepoResults={setRepoResults}
            />

            <Results
                setAlertMessage={setAlertMessage}
                userResults={userResults}
                repoResults={repoResults}
                favouriteIds={favouriteIds}
                setFavouriteIds={setFavouriteIds}
            />
        </>
    );
};

export default Main;
