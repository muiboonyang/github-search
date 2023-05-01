import React from 'react';
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {createTheme, styled, ThemeProvider} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import {v4 as uuidv4} from "uuid";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FavoriteIcon from "@mui/icons-material/Favorite";
import grey from "@mui/material/colors/grey";
import {fetchApiWithJwt} from "../utils/fetchApi";
import {RepoResultsProps, UserResultsProps} from "./Main";
import {FavouriteIdsProps} from "../App";

const lightTheme = createTheme({palette: {mode: "light"}});
const darkTheme = createTheme({palette: {mode: "dark"}});

const buttonTheme = createTheme({
    palette: {
        primary: {
            main: grey[500],
        },
    },
});

interface ResultsProps {
    setAlertMessage: (x: string) => void;
    userResults: UserResultsProps[];
    repoResults: RepoResultsProps[];
    favouriteIds: FavouriteIdsProps[];
    setFavouriteIds: (x: FavouriteIdsProps[]) => void;
}

const Results = (
    {
        userResults,
        repoResults,
        favouriteIds,
        setFavouriteIds,
        setAlertMessage,
    }: ResultsProps
) => {

    //////////////////////
    // TABLE - DARK / LIGHT THEME
    //////////////////////
    let StyledTableCell: any;
    let StyledTableRow: any;

    const [dense, setDense] = React.useState(false);
    const [dark, setDark] = React.useState(false);

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const handleChangeDark = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDark(event.target.checked);
    };

    if (dark) {
        StyledTableCell = styled(TableCell)(({theme}) => ({
            [`&.${tableCellClasses.head}`]: {
                backgroundColor: theme.palette.common.black,
                color: theme.palette.common.white,
            },
            [`&.${tableCellClasses.body}`]: {
                fontSize: 14,
            },
        }));

        StyledTableRow = styled(TableRow)(({theme}) => ({
            "&:nth-of-type(odd)": {
                backgroundColor: theme.palette.action.hover,
            },
        }));
    } else {
        StyledTableCell = styled(TableCell)(({theme}) => ({
            [`&.${tableCellClasses.head}`]: {
                backgroundColor: theme.palette.common.white,
                color: theme.palette.common.black,
            },
            [`&.${tableCellClasses.body}`]: {
                fontSize: 14,
            },
        }));

        StyledTableRow = styled(TableRow)(({theme}) => ({
            "&:nth-of-type(odd)": {
                backgroundColor: theme.palette.action.hover,
            },
        }));
    }

    /////////////////
    // TABLE - PAGINATION
    ////////////////

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    //////////////////////
    // USERS - SHOW RESULTS ON TABLE
    //////////////////////

    const displayUserResults = userResults
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((userResult) => {
        const isFavourite = favouriteIds && favouriteIds.indexOf(userResult.id) >= 0
        return (
            <StyledTableRow key={uuidv4()}>
                <StyledTableCell align="center"> {userResult.id}</StyledTableCell>

                <StyledTableCell align="center">
                    <img src={userResult.avatar_url} alt="" width="42" height="42"/>
                </StyledTableCell>

                <StyledTableCell align="center">
                    <Typography
                        component="a"
                        href={userResult.html_url}
                        target="_blank"
                        sx={{
                            color: "inherit",
                            textDecoration: "none",
                            "&:hover": {
                                color: "inherit",
                            },
                        }}
                    >
                        {userResult.login}
                    </Typography>
                </StyledTableCell>

                <StyledTableCell align="center">
                    <Typography
                        component="a"
                        href={userResult.html_url}
                        target="_blank"
                        sx={{
                            color: "inherit",
                            textDecoration: "none",
                            "&:hover": {
                                color: "inherit",
                            },
                        }}
                    >
                        <GitHubIcon/>
                    </Typography>
                </StyledTableCell>

                <StyledTableCell align="center">
                    <IconButton
                        aria-label="copy"
                        onClick={() => {
                            navigator.clipboard.writeText(userResult.html_url);
                        }}
                    >
                        <ContentCopyIcon/>
                    </IconButton>
                </StyledTableCell>

                <StyledTableCell align="center">
                    <ThemeProvider theme={buttonTheme}>
                        <IconButton
                            onClick={() => addFavourite(userResult)}
                            color={
                                isFavourite ? "error" : "primary"
                            }
                        >
                            <FavoriteIcon/>
                        </IconButton>
                    </ThemeProvider>
                </StyledTableCell>
            </StyledTableRow>
        );
    });

    //////////////////////
    // REPO - SHOW RESULTS ON TABLE
    //////////////////////

    const displayRepoResults = repoResults
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((repoResult) => {
        const isFavourite = favouriteIds && favouriteIds.indexOf(repoResult.id) >= 0
        return (
            <StyledTableRow key={uuidv4()}>
                <StyledTableCell align="center"> {repoResult.owner.id}</StyledTableCell>

                <StyledTableCell align="center">
                    <img src={repoResult.owner.avatar_url} alt="" width="42" height="42"/>
                </StyledTableCell>

                <StyledTableCell align="center">
                    <Typography
                        component="a"
                        href={repoResult.owner.html_url}
                        target="_blank"
                        sx={{
                            color: "inherit",
                            textDecoration: "none",
                            "&:hover": {
                                color: "inherit",
                            },
                        }}
                    >
                        {repoResult.owner.login}
                    </Typography>
                </StyledTableCell>

                <StyledTableCell align="center">{repoResult.id}</StyledTableCell>

                <StyledTableCell align="center">
                    <Typography
                        component="a"
                        href={repoResult.html_url}
                        target="_blank"
                        sx={{
                            color: "inherit",
                            textDecoration: "none",
                            "&:hover": {
                                color: "inherit",
                            },
                        }}
                    >
                        {repoResult.name}
                    </Typography>
                </StyledTableCell>

                <StyledTableCell align="center">
                    <Typography
                        component="a"
                        href={repoResult.html_url}
                        target="_blank"
                        sx={{
                            color: "inherit",
                            textDecoration: "none",
                            "&:hover": {
                                color: "inherit",
                            },
                        }}
                    >
                        <GitHubIcon/>
                    </Typography>
                </StyledTableCell>

                <StyledTableCell align="center">
                    <IconButton
                        aria-label="copy"
                        onClick={() => {
                            navigator.clipboard.writeText(repoResult.html_url);
                        }}
                    >
                        <ContentCopyIcon/>
                    </IconButton>
                </StyledTableCell>

                <StyledTableCell align="center">
                    <ThemeProvider theme={buttonTheme}>
                        <IconButton
                            onClick={() => addFavourite(repoResult)}
                            color={
                                isFavourite ? "error" : "primary"
                            }
                        >
                            <FavoriteIcon/>
                        </IconButton>
                    </ThemeProvider>
                </StyledTableCell>
            </StyledTableRow>
        );
    });

    //================
    // POST - ADD FAVOURITE
    //================

    const addFavourite = async (result: any) => {
        let body;
        if (result.owner) {
            body = {
                favouriteType: "repo",
                userId: result.owner.id,
                avatar: result.owner.avatar_url,
                username: result.owner.login,
                profileLink: result.owner.html_url,
                repoId: result.id,
                repoName: result.name,
                repoLink: result.html_url,
            };
        } else {
            body = {
                favouriteType: "user",
                userId: result.id,
                avatar: result.avatar_url,
                username: result.login,
                profileLink: result.html_url,
            };
        }

        const userOrRepoId = body.repoId ?? body.userId
        const favouriteExits = favouriteIds.includes(userOrRepoId)

       if (!favouriteExits) {
           try {
               const {status, data} = await fetchApiWithJwt(
                   `/api/Favourites/new`, 'Post',
                   body
               );

               if (status === 200) {
                   setFavouriteIds([...new Set([...favouriteIds, result.id])]);
                   setAlertMessage(data.message);
               }
               // else if (status === 403) {
               //     setAlertMessage(data.message);
               // }
           } catch (err) {
               console.log(err);
           }
       } else {
           setAlertMessage("Favourite already exists!");
       }
    };

    const isLoading = useSelector((state: RootState) => state.loading.isLoading);
    if (isLoading) return <LoadingSpinner/>;

    return (
        <>
            {/* User Results */}
            {userResults.length === 0 ? (
                ""
            ) : (
                <Container>
                    <br/>

                    <Grid
                        container
                        sx={{width: "100%"}}
                        direction="row-reverse"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                    >
                        <FormControlLabel
                            control={
                                <Switch checked={dense} onChange={handleChangeDense}/>
                            }
                            label="Dense padding"
                        />
                        <FormControlLabel
                            control={
                                <Switch checked={dark} onChange={handleChangeDark}/>
                            }
                            label="Dark mode"
                        />
                    </Grid>

                    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
                        <Box sx={{width: "100%"}}>
                            <Paper sx={{width: "100%", mb: 2}} elevation={2}>
                                <TableContainer>
                                    <Table
                                        sx={{minWidth: 650}}
                                        aria-label="simple table"
                                        size={dense ? "small" : "medium"}
                                    >
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    "& th": {
                                                        fontWeight: 700,
                                                    },
                                                }}
                                            >
                                                <StyledTableCell align="center">
                                                    User ID
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    Avatar
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    Username
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    GitHub Profile
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    Copy Link
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    Favourite
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>{displayUserResults}</TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 20, 30]}
                                    component="div"
                                    count={userResults.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </Box>
                    </ThemeProvider>
                </Container>
            )}

            {/* Repo Results */}
            {repoResults.length === 0 ? (
                ""
            ) : (
                <Container>
                    <br/>

                    <Grid
                        container
                        sx={{width: "100%"}}
                        direction="row-reverse"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                    >
                        <FormControlLabel
                            control={
                                <Switch checked={dense} onChange={handleChangeDense}/>
                            }
                            label="Dense padding"
                        />
                        <FormControlLabel
                            control={
                                <Switch checked={dark} onChange={handleChangeDark}/>
                            }
                            label="Dark mode"
                        />
                    </Grid>

                    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
                        <Box sx={{width: "100%"}}>
                            <Paper sx={{width: "100%", mb: 2}} elevation={2}>
                                <TableContainer>
                                    <Table
                                        sx={{minWidth: 650}}
                                        aria-label="simple table"
                                        size={dense ? "small" : "medium"}
                                    >
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    "& th": {
                                                        fontWeight: 700,
                                                    },
                                                }}
                                            >
                                                <StyledTableCell align="center">
                                                    User ID
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    Avatar
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    Username
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    Repo ID
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    Repo Name
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    Open Repo
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    Copy Link
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    Favourite
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>{displayRepoResults}</TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 20, 30]}
                                    component="div"
                                    count={repoResults.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </Box>
                    </ThemeProvider>
                </Container>
            )}
        </>
    );
};

export default Results;