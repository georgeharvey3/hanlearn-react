import * as actionTypes from './actions';

const initialState = {
    words: []
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_WORD:
            return {
                ...state,
                words: state.words.concat(action.word)
            }
        case actionTypes.REMOVE_WORD:
            console.log(action.index);
            let newWords = state.words.slice();
            console.log('Before', newWords);
            newWords.splice(action.index, 1);
            console.log('After', newWords);
            return {
                ...state,
                words: newWords
            }
        case actionTypes.CLEAR_WORDS:
            return {
                ...state,
                words: []
            }
        default:
            return state;
    }
}

export default reducer;