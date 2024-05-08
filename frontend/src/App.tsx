import React, {useEffect, useState} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import {FormProvider, useForm} from "react-hook-form";

import Toolbar from "@mui/material/Toolbar";
import NavBar from "./components/NavBar/NavBar";
import PrivateRoute from "./utils/PrivateRoute";

import Main from "./pages/Main";
import Favourites from "./pages/Favourites";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Profile from "./pages/Profile";
import {fetchApiWithJwt} from "./utils/fetchApi";
import Cookies from "js-cookie";
import {useDispatch} from "react-redux";
import {logout} from "./redux/userSlice";

export interface FavouriteIdsProps{
    id: string;
}

const App = () => {
    ////////////////////////
    // Setup for react-hook-form
    ////////////////////////

    const methods = useForm();

    ////////////////////////
    // Check login status, redirect to login page when isLoggedIn cookie expires
    ////////////////////////

    // not able to retrieve cookies in prod env due to cross domain
    const isLoggedIn = Cookies.get('isLoggedIn');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            dispatch(logout())
            navigate("/login");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

    ////////////////////////
    // GET - Fetch user's favourites
    ////////////////////////

    const [favouriteIds, setFavouriteIds] = useState<FavouriteIdsProps[]>([]);

    useEffect(() => {
        const getFavouritesId = async () => {
            try {
                const {status, data} = await fetchApiWithJwt(
                    `/api/favourites/`, 'Get'
                );

                if (status === 200) {
                    let userFavs = data.filter(
                        (element: any) => element.favouriteType === "user"
                    );
                    let repoFavs = data.filter(
                        (element: any) => element.favouriteType === "repo"
                    );
                    let userId = userFavs.map((element: any) => element.userId);
                    let repoId = repoFavs.map((element: any) => element.repoId);
                    let combinedArr = favouriteIds.concat(repoId, userId);
                    let removedUndefined = combinedArr.filter((element: any) => {
                        return element !== undefined;
                    });
                    let uniqueArr = [...new Set(removedUndefined)];
                    setFavouriteIds(uniqueArr);
                }
            } catch (err) {
                console.log(err);
            }
        };
        isLoggedIn && getFavouritesId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

    return (
        <>
            <Toolbar/>
            <NavBar/>

            <FormProvider {...methods}>
                <Routes>
                    <Route path="/" element={<Main favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds}/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<CreateAccount/>}/>

                    <React.Fragment>
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile/>
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/favourites"
                            element={
                                <PrivateRoute>
                                    <Favourites favouriteIds={favouriteIds} setFavouriteIds={setFavouriteIds}/>
                                </PrivateRoute>
                            }
                        />
                    </React.Fragment>
                </Routes>
            </FormProvider>
        </>
    );
}

export default App;
