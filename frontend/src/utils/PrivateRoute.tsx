import React from "react";
import {Navigate} from "react-router-dom";
import Cookies from "js-cookie";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";

type Props = {
    children: JSX.Element;
};

const PrivateRoute = ({children}: Props) => {
    const isDevEnv = process.env.NODE_ENV === "development"
    const isProdEnv = process.env.NODE_ENV === "production"

    const hasLoggedInCookie = Cookies.get('isLoggedIn'); // returns - true/false
    const isLoggedInDev = hasLoggedInCookie && isDevEnv
    const isLoggedInProd = useSelector((state: RootState) => state.user.name) && isProdEnv

    if ((isDevEnv && !isLoggedInDev) || (isProdEnv && !isLoggedInProd)) {
        return <Navigate to="/login" replace/>;
    }

    return children;
};
export default PrivateRoute;
