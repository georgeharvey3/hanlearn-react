import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/Aux';
import Modal from '../../components/UI/Modal/Modal';
import MainBanner from '../../components/AddWords/MainBanner';
import Table from '../../components/UI/Table/Table';
import Button from '../../components/UI/Buttons/Button/Button';
import * as wordActions from '../../store/actions/index';
import Remove from '../../components/UI/Table/TableRow/Remove/Remove';
import Spinner from '../../components/UI/Spinner/Spinner';

import classes from './AddWords.module.css';

class AddWords extends Component {
    constructor () {
        super();

        let charSet = localStorage.getItem('charSet') || 'simp';

        this.state = {
            newWord: '',
            errorMessage: '',
            showErrorMessage: false,
            clashChar: '',
            clashWords: [],
            showClashTable: false,
            charSet: charSet
        }
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
        if (this.props.token !== null) {
            this.props.onInitWords(this.props.token);
        }
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
                clashChar: res[0][this.state.charSet],
                clashWords: res,
                showClashTable: true
            })
        }
    }

    searchForWord = (e) => {
        e.preventDefault();
        if (this.state.newWord === "") {
            return;
        }
        fetch(`/api/get-word/${this.state.newWord}/${this.state.charSet}`).then(response => {
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

        /* eslint-disable */
        let regex = "^[A-Za-z'()\-\? ]+(?:\/[[A-Za-z'()\-\? ]+)*$"
        /* eslint-enable */
        if (!(newMeaning.match(regex))) {
            return;
        }

        e.target.dataset.orig = newMeaning;
        this.props.onPostMeaningUpdate(this.props.token, wordID, newMeaning)
        e.target.blur()
    }

    onBlurMeaning = (e) => {
        e.target.textContent = e.target.dataset.orig;
    }

    onTestHandler = () => {
        let anyDue = this.props.words.some(word => new Date(word.due_date) <= new Date());
        let anyWords = this.props.words.length > 0;

        if (anyDue) {
            this.props.history.push('/test-words');
        } else {
            if (!anyWords) {
                this.setState({
                    showErrorMessage: true,
                    errorMessage: "You don't have any words yet!" 
                })
            } else {
                this.setState({
                    showErrorMessage: true,
                    errorMessage: "You are up to date!" 
                });
            }
            
        }
    }

    convertDateString = initial => {
        let year = initial.slice(0, 4);
        let month = initial.slice(5, 7);
        let day = initial.slice(8);

        return [day, month, year].join("/");
    }
    

    render() {

        if (this.props.token === null) {
            return <Redirect to="/"/>;
        }

        let table = this.props.loading ? <Spinner /> : null;
        
        if (this.props.words && this.props.words.length > 0) {
            let tableRows = this.props.words.map((row, index) => {
                return (
                    <tr key={index}>
                        <td>{row[this.state.charSet]}</td>
                        <td>{row.pinyin}</td>
                        <td 
                            contentEditable='true' 
                            suppressContentEditableWarning='true'
                            onKeyPress={(e) => this.onMeaningKeyPress(e, row.id)}
                            onBlur={this.onBlurMeaning}
                            data-orig={row.meaning}>
                                {row.meaning}
                        </td>
                        <td className="Disappear">{this.convertDateString(row.due_date)}</td>
                        <td><Remove clicked={() => this.props.onDeleteWord(this.props.token, row.id)}/></td>
                    </tr>
                );
            });

            table = (
                <Table headings={['Character(s)', 'Pinyin', 'Meaning', 'Due Date (D/M/Y)', 'Remove']}>
                    {tableRows}
                </Table>
            )
        }

        if (this.props.error) {
            table = <p style={{fontSize: "20px", color: "#E6E0AE"}}>Error: Could not fetch words</p>
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
                            this.handleSearchResult([word], word[this.state.charSet]);
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
                    submitDisabled={this.state.newWord.length === 0} 
                    inputChanged={this.onInputChangedHandler}
                    newWord={this.state.newWord}
                    submitClicked={this.searchForWord}/>
                <div className={classes.TableBoxHolder}>
                    {table}
                </div>
                <Button disabled={this.props.words.length === 0} clicked={this.onTestHandler}>Test</Button>
            </Aux>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        words: state.addWords.words,
        error: state.addWords.error,
        loading: state.addWords.loading,
        token: state.auth.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onPostWord: (token, word) => dispatch(wordActions.postWord(token, word)),
        onDeleteWord: (token, word_id) => dispatch(wordActions.deleteWord(token, word_id)),
        onInitWords: (token) => dispatch(wordActions.initWords(token)),
        onPostMeaningUpdate: (token, word, newMeaning) => dispatch(wordActions.postUpdateMeaning(token, word, newMeaning))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddWords);