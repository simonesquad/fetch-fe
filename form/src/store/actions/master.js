export const SET_ERRORS = 'SET_ERRORS';
export const TOGGLE_MAIN = 'TOGGLE_MAIN';
export const GET_USER_FAIL = "GET_USER_FAIL";

export const setErrors = (err) => (dispatch) => {
    dispatch({ type: GET_USER_FAIL, payload: err.message })
}

export const toggleMain = () => (dispatch) => {
    dispatch({ type: TOGGLE_MAIN })
}