import * as actionTypes from '../actions/actionTypes';

const initialState = {
    speechAvailable: true,
    synthAvailable: true
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_SPEECH_AVAILABLE:
            return {
                ...state,
                speechAvailable: action.available
            }
        case actionTypes.SET_SYNTH_AVAILABLE:
            return {
                ...state,
                synthAvailable: action.available
            }
        default:
            return state;
    }
}

export default reducer;