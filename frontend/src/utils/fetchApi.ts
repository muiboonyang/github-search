import Cookies from 'js-cookie'

////////////////////////////////////////////////////////////
// Custom hook (fetchApi) to check token expiry during each request and initiate token refresh when access token is expiring
///////////////////////////////////////////////////////////

export const fetchApi = async (url: string, config?: {}) => {
    const response = await fetch(url, config);
    const status = response.status
    const data = await response.json();

    console.log(status, data);

    return {status, data};
};

const extendSessionWithRefreshToken = async () => {
    await fetchApi(`/api/sessions/refresh`, {
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        }
    });
};

export const fetchApiWithJwt = async (url: string, method: string, body?: any) => {
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