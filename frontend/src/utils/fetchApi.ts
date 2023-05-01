import Cookies from 'js-cookie'
import axios from "axios";

////////////////////////////////////////////////////////////
// Custom hook (fetchApi) to check token expiry during each request and initiate token refresh when access token is expiring
///////////////////////////////////////////////////////////

///////////////////////////
// Using Fetch
///////////////////////////

export const fetchApi = async (url: string, config?: {}) => {
    const baseURL = process.env.REACT_APP_BASE_URL;
    url = `${baseURL}${url}`;
    let res = await fetch(url, config);
    let status = res.status
    let data = await res.json();
    console.log(status, data);
    return {status, data};
};

const extendSessionWithRefreshToken = async () => {
    await fetchApi(`/api/Sessions/refresh`, {
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        }
    });
};

export const fetchApiWithJwt = async (url: string, method: string, body?: any) => {
    // not able to retrieve cookies in prod env due to cross domain
    const isLoggedIn = Cookies.get('isLoggedIn');
    isLoggedIn && await extendSessionWithRefreshToken();

    // Config for request
    const config = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        method: method,
        body: JSON.stringify(body)
    }

    return await fetchApi(url, config);
};

///////////////////////////
// Using Axios
///////////////////////////y

export const axiosApi = async (url: string, config?: {}) => {
    const baseURL = process.env.REACT_APP_BASE_URL;
    url = `${baseURL}${url}`;
    const {status, data} = await axios(url, config);
    console.log(status, data);
    return {status, data};
};

const axiosExtendSessionWithRefreshToken = async () => {
    await fetchApi(`/api/Sessions/refresh`);
};

export const axiosApiWithJwt = async (url: string, method: string, body?: any) => {
    const isLoggedIn = Cookies.get('isLoggedIn');
    isLoggedIn && await axiosExtendSessionWithRefreshToken();

    // Config for request
    const config = {
        method: method,
        withCredentials: true,
        headers: {'content-type': 'application/json'},
        data: body
    }

    return await fetchApi(url, config);
};
