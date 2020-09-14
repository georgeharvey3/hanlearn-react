import * as actionTypes from './actions';

const initialState = {
    words: [
        {
            character: '雨伞',
            pinyin: 'yu3 san3',
            meaning: 'umbrella'
        },
        {
            character: '特别',
            pinyin: 'te4 bie2',
            meaning: 'special'
        },
        {
            character: '非常',
            pinyin: 'fei1 chang2',
            meaning: 'very'
        },
        {
            character: '你好',
            pinyin: 'ni3 hao3',
            meaning: 'hello'
        },
        {
            character: '再见',
            pinyin: 'zai4 jian4',
            meaning: 'goodbye'
        }
    
    ]
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
            newWords.splice(action.index, 1);
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