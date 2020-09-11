import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux';
import MainBanner from '../../components/AddWords/MainBanner';
import Table from '../../components/UI/Table/Table';
import TableRow from '../../components/UI/Table/TableRow/TableRow';
import Buttons from '../../components/UI/Buttons/Buttons';
import * as actionTypes from '../../store/words/actions';

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
        newWord: ''
    }

    componentDidMount = () => {
        this.setState({words: dummyWords})
    }

    onSubmitWord = (event) => {
        event.preventDefault();
        let wordResult = testDict[this.state.newWord];
        this.props.onAddWord(wordResult);
        this.setState({
            newWord: ''
        });
    }

    onInputChangedHandler = (event) => {
        this.setState({newWord: event.target.value})
    }
    

    render() {
        let tableRows = this.props.words.map((row, index) => (
            <TableRow 
                removed={() => this.props.onRemoveWord(index)} 
                key={index} removable>
                    {[row.character, row.pinyin, row.meaning]}
            </TableRow>
        ));

        return (
            <Aux>
                <MainBanner 
                    inputChanged={this.onInputChangedHandler}
                    newWord={this.state.newWord}
                    submitClicked={this.onSubmitWord}/>
                <Table headings={['Character(s)', 'Pinyin', 'Meaning', 'Remove']}>
                    {tableRows}
                </Table>
                <Buttons clickedHandlers={[null, this.onClearHandler]}>{['Test', 'Clear']}</Buttons>
            </Aux>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        words: state.words
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAddWord: word => dispatch({type: actionTypes.ADD_WORD, word: word}),
        onRemoveWord: index => dispatch({type: actionTypes.REMOVE_WORD, index: index}),
        onClearWords: () => dispatch({type: actionTypes.CLEAR_WORDS})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddWords);