import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux';
import Modal from '../../components/UI/Modal/Modal';
import MainBanner from '../../components/AddWords/MainBanner';
import Table from '../../components/UI/Table/Table';
import Buttons from '../../components/UI/Buttons/Buttons';
import * as wordActions from '../../store/actions/index';
import Remove from '../../components/UI/Table/TableRow/Remove/Remove';


let CHAR_SET = 'simp';

class AddWords extends Component {

    state = {
        newWord: '',
        errorMessage: '',
        showErrorMessage: false,
        clashChar: '',
        clashWords: [],
        showClashTable: false
    }

    onInputChangedHandler = (event) => {
        this.setState({newWord: event.target.value})
    }

    dismissModal = () => {
        this.setState({
            showErrorMessage: false,
            newWord: ''
        });
    }

    dismissClashTable = () => {
        this.setState({
            showClashTable: false,
            newWord: ''
        });
    }

    componentDidMount = () => {
        this.props.onInitWords(this.props.token);
    }

    handleSearchResult = (res, searchedWord) => {
        if (res.length === 0) {
            this.setState({
                errorMessage: `The word ${searchedWord} could not be found`,
                showErrorMessage: true
            });
            return;
        }
        if (res.length === 1) {
            let word = res[0];
            for (let i = 0; i < this.props.words.length; i ++) {
                if (this.props.words[i].id === word.id) {
                    this.setState({
                        errorMessage: `The word ${searchedWord} is already in your bank`,
                        showErrorMessage: true
                    });
                    return;
                }
            }
            this.props.onPostWord(this.props.token, word);
            this.setState({newWord: ''});  
        }

        if (res.length > 1) {
            this.setState({
                clashChar: res[0][CHAR_SET],
                clashWords: res,
                showClashTable: true
            })
        }
    }

    searchForWord = (e) => {
        e.preventDefault();
        fetch(`/get-word/${this.state.newWord}/${CHAR_SET}`).then(response => {
            response.json().then(data => {
                this.handleSearchResult(data.words, this.state.newWord);
            })
        });
    }

    onMeaningKeyPress = (e, wordID) => {
        if (e.key !== 'Enter') {
            return;
        }

        e.preventDefault();

        let newMeaning = e.target.textContent;

        let regex = "^[A-Za-z'()\-\? ]+(?:\/[[A-Za-z'()\-\? ]+)*$"
        
        if (!(newMeaning.match(regex))) {
            return;
        }

        e.target.dataset.orig = newMeaning;
        this.sendMeaningUpdate(wordID, newMeaning);
        e.target.blur()
    }

    onBlurMeaning = (e) => {
        e.target.textContent = e.target.dataset.orig;
    }

    sendMeaningUpdate = (wordID, newMeaning) => {
        fetch('/update-word-meaning', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-access-token': this.props.token
            },
            body: JSON.stringify({word_id: wordID, new_meaning:  newMeaning})
        }).then(response => {
            if (response.status !== 200) {
                console.log(`Problem. Status Code: ${response.status}`);
                return;
            }
        }
        );
    }

    onTestHandler = () => {
        this.props.history.push('/test-words');
    }
    

    render() {

        let table = null;
        
        if (this.props.words && this.props.words.length > 0) {
            let tableRows = this.props.words.map((row, index) => {
                let dueDateRow = window.screen.width > 500 ? <td>{row.due_date}</td> : null;
                return (
                    <tr key={index}>
                        <td>{row.simp}</td>
                        <td>{row.pinyin}</td>
                        <td 
                            contentEditable='true' 
                            suppressContentEditableWarning='true'
                            onKeyPress={(e) => this.onMeaningKeyPress(e, row.id)}
                            onBlur={this.onBlurMeaning}
                            data-orig={row.meaning}>
                                {row.meaning}
                        </td>
                        <td className="Disappear">{row.due_date}</td>
                        <td><Remove clicked={() => this.props.onDeleteWord(this.props.token, row.id)}/></td>
                    </tr>
                );
            });

            let tableHeadings = window.screen.width > 500 ? ['Character(s)', 'Pinyin', 'Meaning', 'Due Date', 'Remove'] : 
                ['Character(s)', 'Pinyin', 'Meaning','Remove'];

            table = (
                <Table headings={['Character(s)', 'Pinyin', 'Meaning', 'Due Date', 'Remove']}>
                    {tableRows}
                </Table>
            )
        }

        let clashTableRows = null;

        if (this.state.clashWords.length > 0) {
            clashTableRows = (
                this.state.clashWords.map((word, index) => {
                    return (
                        <tr 
                            key={index}
                            className="Hoverable"
                            style={{cursor: 'pointer'}}
                            onClick={() => {
                            this.handleSearchResult([word], word['CHAR_SET']);
                            this.setState({
                                clashChar: '',
                                clashWords: [],
                                showClashTable: false
                            })
                        }}>
                            <td>{word.pinyin}</td>
                            <td>{word.meaning}</td>
                        </tr>
                    );
                })
            );
        }

        return (
            <Aux>
                <Modal 
                    show={this.state.showClashTable}
                    modalClosed={this.dismissClashTable}>
                        <h2>Select entry for {this.state.clashChar}</h2>
                        <Table 
                            headings={['Pinyin', 'Meaning']}>
                                {clashTableRows}
                        </Table>
                </Modal>
                <Modal 
                    show={this.state.showErrorMessage}
                    modalClosed={this.dismissModal}>
                        <p>{this.state.errorMessage}</p>
                </Modal>    
                <MainBanner 
                    inputChanged={this.onInputChangedHandler}
                    newWord={this.state.newWord}
                    submitClicked={this.searchForWord}/>
                {table}
                <Buttons clickedHandlers={[this.onTestHandler, this.onClearHandler]}>{['Test', 'Clear']}</Buttons>
            </Aux>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        words: state.addWords.words,
        error: state.addWords.error,
        token: state.auth.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onPostWord: (token, word) => dispatch(wordActions.postWord(token, word)),
        onDeleteWord: (token, word_id) => dispatch(wordActions.deleteWord(token, word_id)),
        onInitWords: (token) => dispatch(wordActions.initWords(token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddWords);