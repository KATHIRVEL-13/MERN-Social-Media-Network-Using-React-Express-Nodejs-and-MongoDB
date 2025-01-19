import { postDataApi } from '../../utils/fetchDataApi';
import { ALERT_TYPES } from './alertActions';
import valid from '../../utils/valid';

export const TYPES = {
    AUTH: 'AUTH'
};

export const login = (data) => async (dispatch) => {
    try {
        dispatch({
            type: ALERT_TYPES.ALERT,
            payload: {
                loading: true,
            }
        });

        const res = await postDataApi('login', data);
        localStorage.setItem('login', true);

        dispatch({
            type: 'AUTH',
            payload: {
                token: res.data.access_token,
                user: res.data.user
            }
        });

        dispatch({
            type: ALERT_TYPES.ALERT,
            payload: {
                success: res.data.msg
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        if (error.response) {
            console.error("Login Error Response Data:", error.response.data);
            dispatch({ type: "ALERT", payload: { error: error.response.data.msg } });
        } else if (error.request) {
            console.error("Login Error Request:", error.request);
            dispatch({ type: "ALERT", payload: { error: "Network Error during Login" } });
        } else {
            console.error('Login Error', error.message);
            dispatch({ type: "ALERT", payload: { error: error.message } });
        }
    }
};

export const refreshToken = () => async (dispatch) => {
    const login = localStorage.getItem('login');

    if (login) {
        dispatch({
            type: 'ALERT',
            payload: {
                loading: true
            }
        });

        try {
            const res = await postDataApi('refresh_token');
            dispatch({
                type: 'AUTH',
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                }
            });
            dispatch({
                type: ALERT_TYPES.ALERT,
                payload: {
                    success: res.data.msg
                }
            });
        } catch (error) {
            console.error("Refresh Token Error:", error);
            if (error.response) {
                console.error("Refresh Token Error Response Data:", error.response.data);
                dispatch({ type: "ALERT", payload: { error: error.response.data.msg } });
            } else if (error.request) {
                console.error("Refresh Token Error Request:", error.request);
                dispatch({ type: "ALERT", payload: { error: "Network Error during Refresh Token" } });
            } else {
                console.error('Refresh Token Error', error.message);
                dispatch({ type: "ALERT", payload: { error: error.message } });
            }
        }
    }
};

export const register = (data) => async (dispatch) => {
    try {
        const check = valid(data);
        if (check.errLength > 0) {
            dispatch({ type: 'ALERT', payload: check.errMsg });
            return; // Important: Stop execution if validation fails
        }

        dispatch({ type: "ALERT", payload: { loading: true } });

        const res = await postDataApi('register', data);

        dispatch({
            type: 'AUTH',
            payload: {
                token: res.data.access_token,
                user: res.data.user
            }
        });

        localStorage.setItem('login', true);
        dispatch({
            type: ALERT_TYPES.ALERT,
            payload: {
                success: res.data.msg
            }
        });
    } catch (error) {
        console.error("Registration Error:", error);
        if (error.response) {
            console.error("Registration Error Response Data:", error.response.data);
            dispatch({ type: "ALERT", payload: { error: error.response.data.msg } });
        } else if (error.request) {
            console.error("Registration Error Request:", error.request);
            dispatch({ type: "ALERT", payload: { error: "Network Error during Registration" } });
        } else {
            console.error('Registration Error', error.message);
            dispatch({ type: "ALERT", payload: { error: error.message } });
        }
    }
};

export const logout = () => async (dispatch) => {
    try {
        localStorage.removeItem('login');
        await postDataApi('logout');
        window.location.href = "/";
    } catch (error) {
        console.error("Logout Error:", error);
        if (error.response) {
            console.error("Logout Error Response Data:", error.response.data);
            dispatch({ type: "ALERT", payload: { error: error.response.data.msg } });
        } else if (error.request) {
            console.error("Logout Error Request:", error.request);
            dispatch({ type: "ALERT", payload: { error: "Network Error during Logout" } });
        } else {
            console.error('Logout Error', error.message);
            dispatch({ type: "ALERT", payload: { error: error.message } });
        }
    }
};
