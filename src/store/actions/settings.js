import * as actionTypes from './actionTypes';

export const setSpeechAvailable = available => {
    return {
        type: actionTypes.SET_SPEECH_AVAILABLE,
        available: available
    }
}

export const setSynthAvailable = available => {
    return {
        type: actionTypes.SET_SYNTH_AVAILABLE,
        available: available
    }
}