import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux';
import Modal from '../../components/UI/Modal/Modal';
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
        newWord: '',
        errorMessage: '',
        showErrorMessage: false
    }

    onSubmitWord = (event) => {
        event.preventDefault();
        let wordResult = testDict[this.state.newWord];

        let alreadyAdded = false;

        for (let i = 0; i < this.props.words.length; i ++) {
            if (this.props.words[i].character === wordResult.character &&
                this.props.words[i].pinyin === wordResult.pinyin &&
                this.props.words[i].meaning === wordResult.meaning) {
                    alreadyAdded = true;
            }
        }
        if (wordResult === undefined) {
            this.processWordError('not found', this.state.newWord);
        } else if (alreadyAdded) {
            this.processWordError('duplicate', this.state.newWord);
        }
        else {
            this.props.onAddWord(wordResult);
            this.setState({
                newWord: ''
            });
        }
    }

    onInputChangedHandler = (event) => {
        this.setState({newWord: event.target.value})
    }

    processWordError = (type, content) => {
        if (type === 'not found') {
            this.setState({
                errorMessage: `The word ${content} could not be found`,
                showErrorMessage: true
            });    
        } else if (type === 'duplicate') {
            this.setState({
                errorMessage: `The word ${content} is already in your bank`,
                showErrorMessage: true
            }); 
        }
    }

    dismissModal = () => {
        this.setState({
            showErrorMessage: false,
            newWord: ''
        });
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
                <Modal 
                    show={this.state.showErrorMessage}
                    modalClosed={this.dismissModal}>
                        <p>{this.state.errorMessage}</p>
                </Modal>    
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