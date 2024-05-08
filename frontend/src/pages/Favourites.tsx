import React, {useState, useEffect} from "react";
import {v4 as uuidv4} from "uuid";
// import LoadingSpinner from "../components/LoadingSpinner";

import {fetchApiWithJwt} from "../utils/fetchApi";

import {RootState} from "../redux/store";
import {useDispatch, useSelector} from "react-redux";
import {loadingStatus} from "../redux/loadingSlice";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import {createTheme, ThemeProvider} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";

import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import GitHubIcon from "@mui/icons-material/GitHub";
import DeleteIcon from "@mui/icons-material/Delete";
import Skeleton from "@mui/material/Skeleton";
import CustomAlert from "../components/CustomAlert/CustomAlert";

const headerTheme = createTheme({
    typography: {
        h3: {
            letterSpacing: "0.1rem",
            fontSize: "2.5rem",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "bold",
            textTransform: "uppercase",
            textAlign: "center",
            paddingTop: "10px",
            paddingBottom: "30px",
        },
    },
});

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 0}}>
                    <Typography component="span">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

interface FavouritesProps {
    favouriteIds: any;
    setFavouriteIds: any;
}

const Favourites = ({favouriteIds, setFavouriteIds}: FavouritesProps) => {
    /////////////////
    // TABS
    ////////////////

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

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

    ////////////////////////
    // Alert
    ////////////////////////

    const [alertMessage, setAlertMessage] = useState("");

    ////////////////////////
    // Favourite Users, Repos
    ////////////////////////

    const dispatch = useDispatch();
    const isLoading = useSelector((state: RootState) => state.loading.isLoading);

    const [favourites, setFavourites] = useState<any[]>([]);

    //================
    // GET - Fetch user's favourites
    //================

    const getFavourites = async () => {
        dispatch(loadingStatus());
        try {
            const {status, data} = await fetchApiWithJwt(
                `/api/favourites/`, 'Get'
            );

            if (status === 200) {
                setFavourites(data);
            }
        } catch (err) {
            console.log(err);
        }
        dispatch(loadingStatus());
    };

    useEffect(() => {
        getFavourites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //================
    // DELETE - Delete selected favourite item
    //================

    const deleteFavourite = async (id: any, userOrRepoId: any) => {
        try {
            const {status} = await fetchApiWithJwt(
                `/api/favourites/delete/${id}`, 'Delete'
            );
            if (status === 200) {
                let filteredArray = favouriteIds.filter(
                    (element: any) => element !== userOrRepoId
                );
                setFavouriteIds(filteredArray);
                getFavourites();
                setAlertMessage("Favourite deleted successfully!");
            }
        } catch (err) {
            console.log(err);
        }
    };

    //////////////////////
    // USERS - SHOW RESULTS ON TABLE
    //////////////////////

    const ids = ["user"],
        newArr = {
            records: favourites,
        };

    const favouriteUsers = newArr.records.filter((element: any) =>
        ids.includes(element.favouriteType)
    );

    const displayUserResults = favouriteUsers
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((result) => {
        return (
            <TableRow key={uuidv4()}>
                <TableCell align="center"> {result.userId}</TableCell>

                <TableCell align="center">
                    <img src={result.avatar} alt="" width="42" height="42"/>
                </TableCell>

                <TableCell align="center">
                    <Typography
                        component="a"
                        href={result.profileLink}
                        target="_blank"
                        sx={{
                            color: "inherit",
                            textDecoration: "none",
                            "&:hover": {
                                color: "inherit",
                            },
                        }}
                    >
                        {result.username}
                    </Typography>
                </TableCell>

                <TableCell align="center">
                    <Typography
                        component="a"
                        href={result.profileLink}
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
                </TableCell>

                <TableCell align="center">
                    <IconButton
                        aria-label="copy"
                        onClick={() => {
                            navigator.clipboard.writeText(result.profileLink);
                        }}
                    >
                        <ContentCopyIcon/>
                    </IconButton>
                </TableCell>

                <TableCell align="center">
                    <IconButton onClick={() => deleteFavourite(result._id, result.userId)}>
                        <DeleteIcon/>
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    });

    //////////////////////
    // REPO - SHOW RESULTS ON TABLE
    //////////////////////

    const ids2 = ["repo"],
        newArr2 = {
            records: favourites,
        };
    const favouriteRepos = newArr2.records.filter((element: any) =>
        ids2.includes(element.favouriteType)
    );

    const displayRepoResults = favouriteRepos
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((result) => {
        return (
            <TableRow key={uuidv4()}>
                <TableCell align="center"> {result.userId}</TableCell>

                <TableCell align="center">
                    <img src={result.avatar} alt="" width="42" height="42"/>
                </TableCell>

                <TableCell align="center">
                    <Typography
                        component="a"
                        href={result.profileLink}
                        target="_blank"
                        sx={{
                            color: "inherit",
                            textDecoration: "none",
                            "&:hover": {
                                color: "inherit",
                            },
                        }}
                    >
                        {result.username}
                    </Typography>
                </TableCell>

                <TableCell align="center">{result.repoId}</TableCell>

                <TableCell align="center">
                    <Typography
                        component="a"
                        href={result.repoLink}
                        target="_blank"
                        sx={{
                            color: "inherit",
                            textDecoration: "none",
                            "&:hover": {
                                color: "inherit",
                            },
                        }}
                    >
                        {result.repoName}
                    </Typography>
                </TableCell>

                <TableCell align="center">
                    <Typography
                        component="a"
                        href={result.repoLink}
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
                </TableCell>

                <TableCell align="center">
                    <IconButton
                        aria-label="copy"
                        onClick={() => {
                            navigator.clipboard.writeText(result.repoLink);
                        }}
                    >
                        <ContentCopyIcon/>
                    </IconButton>
                </TableCell>

                <TableCell align="center">
                    <IconButton onClick={() => deleteFavourite(result._id, result.repoId)}>
                        <DeleteIcon/>
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    });

    //////////////////////
    // SKELETON - PENDING DISPLAY OF RESULTS IN TABLE
    //////////////////////

    const skeletonArray = Array(5).fill('');

    return (
        <>
            <CustomAlert
                alertMessage={alertMessage}
                setAlertMessage={setAlertMessage}
            />

            <Tabs value={value} onChange={handleChange} centered sx={{mt: 3}}>
                <Tab label="Users" {...a11yProps(0)} />
                <Tab label="Repositories" {...a11yProps(1)} />
            </Tabs>

            <Container>
                <Box sx={{mt: 3}}>
                    <ThemeProvider theme={headerTheme}>
                        <TabPanel value={value} index={0}>
                            <Typography variant="h3">Favourite Users</Typography>

                            {favouriteUsers.length === 0 ? (
                                <Typography align="center">
                                    No favourites yet :( <br/>
                                    Start adding favourites from your search results!
                                </Typography>
                            ) : (
                                <Box sx={{width: "100%"}}>
                                    <Paper sx={{width: "100%", mb: 2}} elevation={2}>
                                        <TableContainer>
                                            <Table
                                                sx={{minWidth: 650}}
                                                aria-label="simple table"
                                                size={"medium"}
                                            >
                                                <TableHead>
                                                    <TableRow
                                                        sx={{
                                                            "& th": {
                                                                fontWeight: 700,
                                                            },
                                                        }}
                                                    >
                                                        <TableCell align="center">User ID</TableCell>
                                                        <TableCell align="center">Avatar</TableCell>
                                                        <TableCell align="center">Username</TableCell>
                                                        <TableCell align="center"> GitHub Profile </TableCell>
                                                        <TableCell align="center">Copy Link</TableCell>
                                                        <TableCell align="center">Delete</TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    <>
                                                        {isLoading &&
                                                            skeletonArray.map((item, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell component="th" scope="row">
                                                                        <Skeleton/>
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton/>
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton/>
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton/>
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton/>
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton/>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}

                                                        {!isLoading &&
                                                            <>
                                                                {displayUserResults}
                                                            </>
                                                        }
                                                    </>
                                                </TableBody>


                                            </Table>
                                        </TableContainer>
                                        <TablePagination
                                            rowsPerPageOptions={[10, 20, 30]}
                                            component="div"
                                            count={favouriteUsers.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </Paper>
                                </Box>
                            )
                            }
                        </TabPanel>

                        <TabPanel value={value} index={1}>
                            <Typography variant="h3">Favourite Repos</Typography>

                            {favouriteRepos.length === 0 ? (
                                <Typography align="center">
                                    No favourites yet :( <br/>
                                    Start adding favourites from your search results!
                                </Typography>
                            ) : (
                                <Box sx={{width: "100%"}}>
                                    <Paper sx={{width: "100%", mb: 2}} elevation={2}>
                                        <TableContainer>
                                            <Table
                                                sx={{minWidth: 650}}
                                                aria-label="simple table"
                                                size={"medium"}
                                            >
                                                <TableHead>
                                                    <TableRow
                                                        sx={{
                                                            "& th": {
                                                                fontWeight: 700,
                                                            },
                                                        }}
                                                    >
                                                        <TableCell align="center">User ID</TableCell>
                                                        <TableCell align="center">Avatar</TableCell>
                                                        <TableCell align="center">Username</TableCell>
                                                        <TableCell align="center">Repo ID</TableCell>
                                                        <TableCell align="center">Repo Name</TableCell>
                                                        <TableCell align="center">Open Repo</TableCell>
                                                        <TableCell align="center">Copy Link</TableCell>
                                                        <TableCell align="center">Delete</TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    <>
                                                        {isLoading &&
                                                            skeletonArray.map((item, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell component="th" scope="row">
                                                                        <Skeleton/>
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton/>
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton/>
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton/>
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton/>
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton/>
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton/>
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton/>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}

                                                        {!isLoading &&
                                                            <>
                                                                {displayRepoResults}
                                                            </>
                                                        }
                                                    </>
                                                </TableBody>

                                            </Table>
                                        </TableContainer>

                                        <TablePagination
                                            rowsPerPageOptions={[10, 20, 30]}
                                            component="div"
                                            count={favouriteRepos.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </Paper>
                                </Box>
                            )}
                        </TabPanel>
                    </ThemeProvider>
                </Box>
            </Container>
        </>
    );
};

export default Favourites;
