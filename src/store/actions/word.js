import * as actionTypes  from'./actionTypes';

export const addWord = word => {
    return {
        type: actionTypes.ADD_WORD,
        word: word
    }
}

export const removeWord = wordID => {
    return {
        type: actionTypes.REMOVE_WORD,
        wordID: wordID
    }
}

export const setWords = words => {
    return {
        type: actionTypes.SET_WORDS,
        words: words
    }
}

export const fetchWordsFailed = () => {
    return {
        type: actionTypes.FETCH_WORDS_FAILED
    }
}

export const initWords = (token) => {
    return dispatch => {
        fetch('/get-user-words', {
            headers: {
                'x-access-token': token
            }
        }).then(response =>
            response.json().then(data => {
                dispatch(setWords(data.words));
            })
        .catch(error => {
            dispatch(fetchWordsFailed());
        }))
    }
}


export const postWord = (token, word) => {
    return dispatch => {
        fetch('/add-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(word)
        }).then(response => response.json().then(data => {
            dispatch(addWord(word));
        }));
    }
}

export const deleteWord = (token, wordID) => {
    return dispatch => {
        fetch('/remove-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(wordID)
        }).then(response => response.json().then(data => {
            dispatch(removeWord(wordID));
        }));
    }
}