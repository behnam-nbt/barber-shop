import Cookies from 'js-cookie';

export const setTokens = ({ accessToken, refreshToken }) => {
    Cookies.set("accessToken", accessToken, { expires: 1, secure: true, path: "/", sameSite: 'Strict' });
    Cookies.set("refreshToken", refreshToken, { expires: 30, secure: true, path: "/", sameSite: 'Strict' });
};


export const getToken = (tokenName) => {
    const token = Cookies.get(tokenName);
    if (!token) {
        console.warn(`Token ${tokenName} not found`);
    }
    return token;
};