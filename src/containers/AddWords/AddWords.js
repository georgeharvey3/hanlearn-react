import React, { Component } from 'react';

import classes from './AddWords.module.css';

import Aux from '../../hoc/Aux';
import MainBanner from '../../components/AddWords/MainBanner';
import Table from '../../components/UI/Table/Table';
import TableRow from '../../components/UI/Table/TableRow/TableRow';
import Buttons from '../../components/UI/Buttons/Buttons';

let dummyWords = [
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
    }
];

let testDict = {
    '你好': {
        character: '你好',
        pinyin: 'ni3 hao3',
        meaning: 'hello'
    },
    '再见': {
        character: '再见',
        pinyin: 'zai4 jian4',
        meaning: 'goodbye'
    },
    '非常': {
        character: '非常',
        pinyin: 'fei1 chang2',
        meaning: 'very'
    },
    '特别': {
        character: '特别',
        pinyin: 'te4 bie2',
        meaning: 'special'
    },
    '雨伞': {
        character: '雨伞',
        pinyin: 'yu3 san3',
        meaning: 'umbrella'
    }
}


class AddWords extends Component {

    state = {
        words: [],
        newWord: ''
    }

    componentDidMount = () => {
        this.setState({words: dummyWords})
    }

    onRemoveWordHandler = (word) => {
        this.setState(prevState => {
            let newWords = prevState.words
            let removeIndex = newWords.indexOf(word);
            if (removeIndex >= 0) {
                newWords.splice(removeIndex, 1);
            }
            return {
                words: newWords
            }
        });
    }

    onClearHandler = () => {
        this.setState({words: []});
    }

    onSubmitWord = (event) => {
        event.preventDefault();
        let wordResult = testDict[this.state.newWord];
        this.setState(prevState => {
            return {
                words: prevState.words.concat(wordResult),
                newWord: ''
            }
        });
    }

    onInputChangedHandler = (event) => {
        this.setState({newWord: event.target.value})
    }

    keyPressHandler (event) {
        if (event.keyCode !== 13) {
            return;
        }
        this.onSubmitWord(event.target.value);
    }

    render() {
        let tableRows = this.state.words.map((row, index) => (
            <TableRow 
                removed={() => this.onRemoveWordHandler(row)} 
                key={index} removable>
                    {[row.character, row.pinyin, row.meaning]}
            </TableRow>
        ));

        return (
            <div>
                <MainBanner 
                    inputChanged={this.onInputChangedHandler}
                    newWord={this.state.newWord}
                    submitClicked={this.onSubmitWord}/>
                <Table headings={['Character(s)', 'Pinyin', 'Meaning', 'Remove']}>
                    {tableRows}
                </Table>
                <Buttons clickedHandlers={[null, this.onClearHandler]}>{['Test', 'Clear']}</Buttons>
            </div>
        );
    }
}

export default AddWords;