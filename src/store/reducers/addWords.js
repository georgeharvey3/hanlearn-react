import * as actionTypes from '../actions/actionTypes';

const initialState = {
    words: [],
    error: false
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_WORD:
            return {
                ...state,
                words: state.words.concat(action.word)
            }
        case actionTypes.REMOVE_WORD:
            let newWords = state.words.slice();
            for (let i = 0; i < newWords.length; i ++) {
                if (newWords[i].id === action.wordID) {
                    newWords.splice(i, 1);
                    break;
                }
            }
            return {
                ...state,
                words: newWords
            }
        case actionTypes.CLEAR_WORDS:
            return {
                ...state,
                words: []
            }
        case actionTypes.SET_WORDS:
            return {
                ...state,
                words: action.words,
                error: false
            }
        case actionTypes.FETCH_WORDS_FAILED:
            return {
                ...state,
                error: true
            }
        default:
            return state;
    }
}

export default reducer;