import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Button from '../../UI/Buttons/Button/Button';
import PictureButton from '../../UI/Buttons/PictureButton/PictureButton';
import Aux from '../../../hoc/Aux';
import Modal from '../../UI/Modal/Modal';
import Table from '../../UI/Table/Table';
import TableRow from '../../UI/Table/TableRow/TableRow';

import micPic from '../../../assets/images/microphone.png';
import likePic from '../../../assets/images/like.png';
import dislikePic from '../../../assets/images/dislike.png';

import classes from './SentenceStage.module.css';

class SentenceStage extends Component {
    state = {
        currentWord: null,
        wordIndex: 0,
        charSet: localStorage.getItem('charSet') || 'simp',
        finished: false,
        sentence: null,
        chineseSentence: null,
        entered: "",
        error: false,
        errorMessage: "",
        message: "",
        sentences: []
    }

    componentDidMount = () => {
        this.selectNextWord();

        document.addEventListener('keypress', event => {
                
            let sourceElement = event.target.tagName.toLowerCase();

            if (event.key === " " && sourceElement !== "input") {
                this.onListenPinyin();
            }
        });

        document.addEventListener('keyup', event => {
            if (event.ctrlKey && event.key === "m") {
                this.onListenPinyin();
            }        
        });

        document.addEventListener('keydown', event => {
                
            if (event.key === "ArrowUp" && this.state.sentence !== null) {
                this.onYesClicked();
            }
    
            if (event.key === "ArrowDown" && this.state.sentence !== null) {
                this.onNoClicked();
            }
        });


    }

    selectNextWord = () => {
        
        let nextWord = this.props.words[this.state.wordIndex];
        let nextIndex = this.state.wordIndex + 1;
        let finished = false;
        if (nextIndex > this.props.words.length) {
            finished = true
        }
        this.setState({
            currentWord: nextWord,
            wordIndex: nextIndex,
            finished: finished,
            message: ""
        });
    }

    onInputKeyPress = (event) => {
        if (event.key !== 'Enter') {
            return;
        }
        let sentence = event.target.value;

        if (sentence.includes(this.state.currentWord[this.state.charSet])) {
            if (sentence === this.state.currentWord[this.state.charSet]) {
                this.setState({
                    error: true,
                    errorMessage: "That's not a sentence!"
                });
            } else {
                this.setState({
                    error: false,
                    errorMessage: "",
                    message: "Translating..."
                });
                document.getElementById("input").blur();
                this.translateSentence(sentence);
            }
        } else {
            this.setState({
                error: true,
                errorMessage: "Sentence does not contain word!"
            });
        }
    }

    translateSentence = (sentence) => {
        fetch('/api/translate-sentence', {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                sentence: sentence
            }),
            cache: "no-cache",
            headers: new Headers({
                "content-type": "application/json"
            })
        })
        .then(response =>
            response.json().then(data => {
                let trimmed = data.translated.trim()
                let fixed = trimmed[0].toUpperCase() + trimmed.slice(1);
                this.setState({
                    sentence: fixed,
                    chineseSentence: sentence,
                    message: "Translation:"
                })
            })
        .catch(function(error) {
            console.log("Fetch error: " + error);
            this.setState({
                message: "Problem translating, please try again"
            })
        }));
    }

    onNoClicked = () => {
        this.setState({
            sentence: null,
            chineseSentence: null,
            entered: '',
            message: "Try again"
        });
    }

    onYesClicked = () => {
        this.selectNextWord();
        let nextSentences = this.state.sentences.concat(this.state.chineseSentence);
        this.setState({
            sentence: null,
            chineseSentence: null,
            entered: '',
            message: "",
            sentences: nextSentences
        })
    }

    onInputChanged = (event) => {
        this.setState({
            entered: event.target.value,
            error: false,
            errorMessage: ""
        })
    }

    onListenPinyin = () => {
        let recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'zh-CN';

        this.setState({
            error: false,
            errorMessage: ""
        });

        recognition.addEventListener('result', event => {
            let result = event.results[0][0].transcript;
            this.setState({
                entered: result,
                message: ""
            });
            document.getElementById("input").focus();
        });
        this.setState({message: "Listening..."})
        recognition.start();
    }

    onHomeClicked = () => {
        this.props.history.push("/");
    }

    render () {
        let sentence = null;

        let sentenceText = this.state.sentence === null ? null : <h3>"{this.state.sentence}"</h3>;


        if (this.state.currentWord !== null && !this.state.finished) {
            sentence = (
                <div>
                    <h2>Create a sentence using...</h2>
                    <div className={classes.QuestionCard}>
                        <h2>{this.state.currentWord[this.state.charSet]}</h2>
                    </div>
                    <input 
                        autoComplete="off"
                        onKeyPress={this.onInputKeyPress}
                        value={this.state.entered}
                        onChange={this.onInputChanged}
                        id="input"/>
                    <PictureButton 
                        colour="yellow"
                        src={micPic}
                        clicked={() => this.onListenPinyin()}/>
                    <p>{this.state.message}</p>
                    {sentenceText}
                </div>
            );
        }

        let buttons = null;
        let errorMessage = null;
        

        if (this.state.error) {
            errorMessage = <p>{this.state.errorMessage}</p>
        }

        if (this.state.sentence !== null) {
            let buttonStyle = {
                display: "inline-block",
                width: "50px",
                height: "50px",
                margin: "10px 20px"
            }
            buttons = (
                <div>
                    <PictureButton
                        style={buttonStyle} 
                        clicked={this.onYesClicked}
                        src={likePic}>Yes</PictureButton>
                    <PictureButton
                        style={buttonStyle}  
                        clicked={this.onNoClicked}
                        src={dislikePic}>No</PictureButton>
                </div>
            )
        }

        return (
            <Aux>
                <div className={classes.SentenceStage}>
                    {sentence}
                    {errorMessage}
                    {buttons}
                </div>
                <Modal 
                    show={this.state.finished}
                    style={{
                        backgroundColor: 'rgb(82, 129, 122)',
                        top: '20%'
                    }}>
                        <h3>Finished!</h3>
                        <Table headings={['Your sentences:']}>
                            {this.state.sentences.map((sentence, index) => {
                                return (
                                    <TableRow 
                                        key={index}>{[sentence]}</TableRow>
                                );
                            })}
                        </Table>
                        <Button clicked={this.onHomeClicked}>Home</Button>
                </Modal>
            </Aux>   
        );
    }
}

export default withRouter(SentenceStage);