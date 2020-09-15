import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux';
import Modal from '../../components/UI/Modal/Modal';
import MainBanner from '../../components/AddWords/MainBanner';
import Table from '../../components/UI/Table/Table';
import TableRow from '../../components/UI/Table/TableRow/TableRow';
import Buttons from '../../components/UI/Buttons/Buttons';
import * as wordActions from '../../store/actions/index';

let CHAR_SET = 'simp';

class AddWords extends Component {

    state = {
        newWord: '',
        errorMessage: '',
        showErrorMessage: false
    }

    onSubmitWord = (event) => {
        event.preventDefault();
        let wordResult = 'punk';
        this.searchForWord(this.state.newWord);

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

    componentDidMount = () => {
        this.props.onInitWords();
    }

    handleSearchResult = (res) => {
        if (res.length === 1) {
            let word = res[0];
            this.props.onPostWord(word);
        }
    }

    searchForWord = (e) => {
        e.preventDefault();
        this.setState({newWord: ''});
        fetch(`/get-word/${this.state.newWord}/${CHAR_SET}`).then(response => {
            response.json().then(data => {
                this.handleSearchResult(data.words);
            })
        })        
    }
    

    render() {

        let table = null;
        
        if (this.props.words && this.props.words.length > 0) {
            let tableRows = this.props.words.map((row, index) => (
                <TableRow 
                    removed={() => this.props.onDeleteWord(row.id)} 
                    key={index} removable>
                        {[row.simp, row.pinyin, row.meaning]}
                </TableRow>
            ));

            table = (
                <Table headings={['Character(s)', 'Pinyin', 'Meaning', 'Remove']}>
                    {tableRows}
                </Table>
            )
        }

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
                    submitClicked={this.searchForWord}/>
                {table}
                <Buttons clickedHandlers={[null, this.onClearHandler]}>{['Test', 'Clear']}</Buttons>
            </Aux>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        words: state.words,
        error: state.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onPostWord: word => dispatch(wordActions.postWord(word)),
        onDeleteWord: word_id => dispatch(wordActions.deleteWord(word_id)),
        onInitWords: () => dispatch(wordActions.initWords())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddWords);