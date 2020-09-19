import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (userId, token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId
    }
}

export const registerSuccess = () => {
    return {
        type: actionTypes.REGISTER_SUCCESS
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeOut = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    }
}

export const auth = (email, password) => {
    return dispatch => {
        dispatch(authStart());
        fetch('login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('expiresAt', data.expires_at);
                    localStorage.setItem('userId', data.user_id);
                    dispatch(authSuccess(data.user_id, data.token))
                    dispatch(checkAuthTimeOut(new Date(data.expires_at).getTime() - new Date().getTime()));
                });
            } else {
                response.json().then(data => {
                    dispatch(authFail(data));
                });
            }
        })
        .catch(err => {
            dispatch(authFail(err));
        })
    }
}

export const register = (email, username, password) => {
    return dispatch => {
        dispatch(authStart());
        fetch('create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            })
        })
        .then(response => {
            if (response.ok) {
                dispatch(registerSuccess());
            } else {
                response.json().then(data => {
                    dispatch(authFail(data));
                })
            }
        })
        .catch(err => {
            dispatch(authFail(err));
        })
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expiresAt'));
            if (expirationDate > new Date()) {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(userId, token));
                dispatch(checkAuthTimeOut((expirationDate.getTime() - new Date().getTime())));
            } else {
                dispatch(logout());
            }
        }
    }
}