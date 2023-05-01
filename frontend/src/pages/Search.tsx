import React, {useState} from 'react';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import grey from "@mui/material/colors/grey";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SourceIcon from '@mui/icons-material/Source';
import {fetchApi} from "../utils/fetchApi";
import {loadingStatus} from "../redux/loadingSlice";
import {useDispatch} from "react-redux";
import {RepoResultsProps, UserResultsProps} from "./Main";

const buttonTheme = createTheme({
    palette: {
        primary: {
            main: grey[900],
        },
    },
});

// const queryType = [
//     {
//         value: "repositories",
//         label: "Repository",
//     },
//     {
//         value: "users",
//         label: "User",
//     },
// ];

interface SearchProps {
    setAlertMessage: (x: string) => void
    setUserResults: (x: UserResultsProps[]) => void;
    setRepoResults: (x: RepoResultsProps[]) => void;
}

interface UsersProps {
    login: string
}

const Search = (
    {
        setUserResults,
        setRepoResults,
        setAlertMessage,
    }: SearchProps
) => {
    const [type, setType] = useState("users");
    const [input, setInput] = useState("");
    const [users, setUsers] = useState<UsersProps[]>([]);

    const dispatch = useDispatch();

    ///////////////////////////////////////
    // Octokit - Check GitHub API Search Limit
    ///////////////////////////////////////

    const getLimit = async () => {
        try {
            await fetchApi(`/api/Limit`);
        } catch (err) {
            console.log(err);
        }
    };

    const searchUser = async (query: string) => {
        try {
            const {status, data} = await fetchApi(`/api/Github`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: type,
                    query: query,
                }),
            });

            if (status === 200) {
                getLimit();
                setUsers(data.items); // searches as you type, save results
                if (data.message) {
                    setAlertMessage(data.message); // Sends GitHub error message as alert
                }
            } else if (status === 403) {
                setAlertMessage("Too many searches. Please try again later!");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const generateTable = async () => {
        dispatch(loadingStatus());
        try {
            const {status, data} = await fetchApi(`/api/Github`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: type,
                    query: input,
                }),
            });

            if (status === 200) {
                if (data.items.length === 0) {
                    setAlertMessage("No results found. Please try again!");
                }
                if (type === "users") {
                    setUserResults(data.items);
                } else if (type === "repositories") {
                    setRepoResults(data.items);
                }
                getLimit();
            } else if (status === 403) {
                setAlertMessage("Too many searches. Please try again later!");
                setInput("");
                setUsers([]);
                setUserResults([]);
                setRepoResults([]);
            }
        } catch (err) {
            console.log(err);
        }
        dispatch(loadingStatus());
    };

    const handleTypeChange = (event: React.MouseEvent<HTMLElement>, newType: string) => {
        setType(newType);
        setUsers([]);
        setRepoResults([]);
        setUserResults([]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setInput(query);
        if (query.length === 0) {
            setUsers([]);
        }
        if (type === "users" && query.length > 0) {
            searchUser(query);
        }
    };

    const handleGenerateTable = (event: React.FormEvent) => {
        // prevents page from refreshing when submitting
        event.preventDefault();
        if (input.length > 0) {
            generateTable();
            setInput("");
            setUsers([]);
        }
    };

    return (

        <>
            <Container
                component="form"
                onSubmit={handleGenerateTable}
                autoComplete="off"
            >
                <Box
                    sx={{
                        m: 1,
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                    }}
                >
                    <Grid
                        container
                        spacing={1}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <ToggleButtonGroup
                            color="primary"
                            value={type}
                            onChange={handleTypeChange}
                            exclusive
                        >
                            <ToggleButton value="users">
                                <PersonIcon/>
                            </ToggleButton>
                            <ToggleButton value="repositories">
                                <SourceIcon/>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Box>

                {/*Search Bar*/}
                <Box
                    sx={{
                        mt: 5,
                        mb: 5,
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                    }}
                >
                    <Grid
                        container
                        spacing={1}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item xs={8}>
                            <Autocomplete
                                freeSolo
                                sx={{width: "100%"}}
                                disableClearable
                                options={
                                    users && users.map((result) => result.login)
                                }
                                value={input}
                                id="outlined"
                                onInputChange={(event, newInputValue) => {
                                    setInput(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Query"
                                        variant="standard"
                                        id="outlined"
                                        onChange={handleInputChange}
                                        InputProps={{
                                            ...params.InputProps,
                                            type: "search",
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Box>


                {/*Buttons*/}
                <Box
                    sx={{
                        mt: 5,
                        display: "flex",
                        flexWrap: "nowrap"
                    }}
                    justifyContent="center"
                    alignItems="center"
                >
                    <ThemeProvider theme={buttonTheme}>
                        {/*Submit button*/}
                        <Button
                            variant="contained"
                            sx={{
                                m: 1,
                                width: 100,
                                bgcolor: "black"
                            }}
                            type="submit"
                        >
                            Submit
                        </Button>

                        {/*Reset button*/}
                        <Button
                            variant="outlined"
                            sx={{
                                m: 1,
                                width: 100,
                            }}
                            onClick={() => {
                                setInput("");
                                setUsers([]);
                                setUserResults([]);
                                setRepoResults([]);
                            }}
                        >
                            Reset
                        </Button>
                    </ThemeProvider>
                </Box>
            </Container>
        </>
    );
};

export default Search;