import {
    GET_USER_FAIL,
} from '../actions/master';

const initialState = {
    users: [],
    error:'',
    loading: false
}

export function userReducer(state=initialState, action) {
    switch(action.type) {
        case GET_USER_FAIL:
            return{
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}