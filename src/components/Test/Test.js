import React, { Component } from 'react';
import { withRouter } from'react-router-dom';
import { connect } from 'react-redux' ;
import { Howl } from 'howler';

import classes from './Test.module.css';

import * as testLogic from './Logic/TestLogic';
import Aux from '../../hoc/Aux';
import Modal from '../UI/Modal/Modal';
import Backdrop from '../UI/Backdrop/Backdrop';
import ProgressBar from './ProgressBar/ProgressBar';
import Input from '../UI/Input/Input';
import TestSummary from './TestSummary/TestSummary';
import PictureButton from '../UI/Buttons/PictureButton/PictureButton';
import Button from '../UI/Buttons/Button/Button';

import micPic from '../../assets/images/microphone.png';
import speakerPic from '../../assets/images/speaker.png';

import successSound from '../../assets/sounds/success1.wav';
import failSound from '../../assets/sounds/failure1.wav';

let pinyinConverter = require("pinyin");

const beep = new Howl({
    src: [successSound],
    volume: 0.5
});

const fail = new Howl({
    src: [failSound],
    volume: 0.7
});

class Test extends Component {
    constructor () {
        super();
        let numWords = localStorage.getItem('numWords') || 5;
        let charSet = localStorage.getItem('charSet') || 'simp';

        this.state = {
            testSet: [],
            permList: [],
            numWords: numWords,
            charSet: charSet,
            perm: null,
            answer: null,
            answerCategory: null,
            question: null,
            questionCategory: null,
            chosenCharacter: null,
            result: '',
            answerInput: '',
            idkDisabled: false,
            progressBar: 0,
            initNumPerms: 0,
            idkList: [],
            scoreList: [],
            testFinished: false,
            showInput: false,
            drawnCharacters: [],
            numSpeakTries: 0,
            useSound: true,
            useHandwriting: true,
            useSpeechRecognition: true,
            showErrorMessage: false,
            redoChar: false
        }    

    }

    componentDidMount () {
        let useSound = localStorage.getItem('useSound') === 'false' || !this.props.synthAvailable ? false : true;
        let useHandwriting = localStorage.getItem('useHandwriting') === 'false' ? false : true;
        let useSpeechRecognition = localStorage.getItem('useSpeechRecognition') === 'false' || !this.props.speechAvailable ? false : true;

        if (this.props.isTest) {
            if (this.props.speechAvailable) {
                useSpeechRecognition = false;
            }

            if (this.props.synthAvailable) {
                useSound = false;
            }

            useHandwriting = true;
        }

        this.setState({
            useSound: useSound,
            useHandwriting: useHandwriting,
            useSpeechRecognition: useSpeechRecognition
        });

        this.onInitialiseTestSet(useHandwriting);
    }

    componentDidUpdate = (prevProps, prevState) => {

        if (prevState.perm !== this.state.perm || this.state.redoChar) {
            
            console.log("UPDATING");
            if (this.state.questionCategory === 'pinyin' && this.state.useSound) {
                this.onSpeakPinyin(this.state.chosenCharacter);
            }
            if (this.state.answerCategory === 'character') {
                /*
                for (let i = 0; i < this.state.answer.length; i ++) {
                    this.onNewCharacter(this.state.answer[i], i);
                }
                */
                if (this.state.answer.length === 1) {
                    this.onNewCharacterOne(this.state.answer);
                } else if (this.state.answer.length === 2) {
                    this.onNewCharacterTwo(this.state.answer);
                } else if (this.state.answer.length === 3) {
                    this.onNewCharacterThree(this.state.answer);
                }
            }
        }
    }

    onInitialiseTestSet = (useHandwriting) => {
        let allWords = this.props.words.slice();
        if (allWords.length === 0) {
            return;
        }
        let actualNumWords = allWords.length >= this.state.numWords ? this.state.numWords : allWords.length;
        let selectedWords = testLogic.chooseTestSet(allWords, actualNumWords);

        if (selectedWords.length === 0 || !selectedWords[0]) {
            this.setState({
                showErrorMessage: true
            })
            return;
        }
        
        let permList = testLogic.setPermList(selectedWords, useHandwriting);
        let initialVals = testLogic.assignQA(selectedWords, permList, this.state.charSet);
        this.setState({
            testSet: selectedWords,
            permList: permList,
            perm: initialVals.perm,
            answer: initialVals.answer,
            answerCategory: initialVals.answerCategory,
            question: initialVals.question,
            questionCategory: initialVals.questionCategory,
            chosenCharacter: initialVals.chosenCharacter,
            initNumPerms: permList.length
        });

    }

    onidkCharOne = (writer, char, numBeforeHint) => {
        if (!this.state.useHandwriting || !(this.state.answerCategory === 'character') ) {
            return;
        }
        writer.animateCharacter({
            onComplete: () => {
                console.log("COMPLETED ANIMATION");
                console.log(this.state.redoChar);
                let charGrid = document.getElementById('character-target-div');
                if (charGrid !== null) {
                    charGrid.innerHTML = "";
                }
                this.setState({idkDisabled: true});
                this.setState(prevState => {
                    let idkChar = prevState.testSet[prevState.perm.index][this.state.charSet];
                    return {
                        idkList: prevState.idkList.concat(idkChar)
                    }
                });

                let newQuestion = testLogic.assignQA(this.state.testSet, this.state.permList, this.state.charSet);

                let redoChar = false;

                if (newQuestion.perm === this.state.perm) {
                    redoChar = true;
                }
                
                this.setState({
                    perm: newQuestion.perm,
                    answer: newQuestion.answer,
                    answerCategory: newQuestion.answerCategory,
                    question: newQuestion.question,
                    questionCategory: newQuestion.questionCategory,
                    chosenCharacter: newQuestion.chosenCharacter,
                    idkDisabled: false,
                    result: '',
                    answerInput: '',
                    redoChar: redoChar
                        });
                }
        });
    }

    onidkCharTwo = (writer, char, numBeforeHint) => {
        if (!this.state.useHandwriting || !(this.state.answerCategory === 'character') ) {
            return;
        }
        writer.animateCharacter({
            onComplete: () => {
                document.getElementById('character-target-div').innerHTML = "";
                let writer = window.HanziWriter.create('character-target-div', char[1], {
                    width: 150,
                    height: 150,
                    padding: 20,
                    delayBetweenStrokes: 10,
                    strokeAnimationSpeed: 1,
                    showOutline: false,
                    showCharacter: false,
                    showHintAfterMisses: numBeforeHint
                });
                writer.animateCharacter({
                    onComplete: () => {
                        console.log("COMPLETED ANIMATION");
                        console.log(this.state.redoChar);
                        let charGrid = document.getElementById('character-target-div');
                        if (charGrid !== null) {
                            charGrid.innerHTML = "";
                        }
                        this.setState({idkDisabled: true});
                        this.setState(prevState => {
                            let idkChar = prevState.testSet[prevState.perm.index][this.state.charSet];
                            return {
                                idkList: prevState.idkList.concat(idkChar)
                            }
                        });

                        let newQuestion = testLogic.assignQA(this.state.testSet, this.state.permList, this.state.charSet);

                        let redoChar = false;

                        if (newQuestion.perm === this.state.perm) {
                            redoChar = true;
                        }
                        
                        this.setState({
                            perm: newQuestion.perm,
                            answer: newQuestion.answer,
                            answerCategory: newQuestion.answerCategory,
                            question: newQuestion.question,
                            questionCategory: newQuestion.questionCategory,
                            chosenCharacter: newQuestion.chosenCharacter,
                            idkDisabled: false,
                            result: '',
                            answerInput: '',
                            redoChar: redoChar
                        });
                    }
                });
            }
        });
    }

    onidkCharThree = (writer, char, numBeforeHint) => {
        if (!this.state.useHandwriting || !(this.state.answerCategory === 'character') ) {
            return;
        }
        writer.animateCharacter({
            onComplete: () => {
                document.getElementById('character-target-div').innerHTML = "";
                let writer = window.HanziWriter.create('character-target-div', char[1], {
                    width: 150,
                    height: 150,
                    padding: 20,
                    delayBetweenStrokes: 10,
                    strokeAnimationSpeed: 1,
                    showOutline: false,
                    showCharacter: false,
                    showHintAfterMisses: numBeforeHint
                });
                writer.animateCharacter({
                    onComplete: () => {
                        document.getElementById('character-target-div').innerHTML = "";
                        let writer = window.HanziWriter.create('character-target-div', char[2], {
                            width: 150,
                            height: 150,
                            padding: 20,
                            delayBetweenStrokes: 10,
                            strokeAnimationSpeed: 1,
                            showOutline: false,
                            showCharacter: false,
                            showHintAfterMisses: numBeforeHint
                        });
                        writer.animateCharacter({
                            onComplete: () => {
                                console.log("COMPLETED ANIMATION");
                                console.log(this.state.redoChar);
                                let charGrid = document.getElementById('character-target-div');
                                if (charGrid !== null) {
                                    charGrid.innerHTML = "";
                                }
                                this.setState({idkDisabled: true});
                                this.setState(prevState => {
                                    let idkChar = prevState.testSet[prevState.perm.index][this.state.charSet];
                                    return {
                                        idkList: prevState.idkList.concat(idkChar)
                                    }
                                });

                                let newQuestion = testLogic.assignQA(this.state.testSet, this.state.permList, this.state.charSet);

                                let redoChar = false;

                                if (newQuestion.perm === this.state.perm) {
                                    redoChar = true;
                                }
                                
                                this.setState({
                                    perm: newQuestion.perm,
                                    answer: newQuestion.answer,
                                    answerCategory: newQuestion.answerCategory,
                                    question: newQuestion.question,
                                    questionCategory: newQuestion.questionCategory,
                                    chosenCharacter: newQuestion.chosenCharacter,
                                    idkDisabled: false,
                                    result: '',
                                    answerInput: '',
                                    redoChar: redoChar
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    onNewCharacterOne = (char) => {
        document.getElementById('character-target-div').innerHTML = "";
        let flashChar = !this.state.drawnCharacters.includes(char);

        let numBeforeHint = 100;
        if (this.props.isTest) {
            numBeforeHint = 1;
        }

        let writer = window.HanziWriter.create('character-target-div', char, {
            width: 150,
            height: 150,
            padding: 20,
            delayBetweenStrokes: 300,
            showOutline: false,
            showCharacter: flashChar,
            showHintAfterMisses: 100
        });

        let idkButton = document.getElementById('idk');
        let idkCharNoParams = () => {
            this.onidkCharOne(writer, char, numBeforeHint);
        }
        idkButton.addEventListener('click', function executeIdk() {
            idkCharNoParams();
            idkButton.removeEventListener('click', executeIdk, false);
        });

        writer.quiz({
            onComplete: () => {
                this.setState(prevState => {
                    return {
                        drawnCharacters: prevState.drawnCharacters.concat(char)
                    }
                });
                document.getElementById('character-target-div').innerHTML = "";
                this.onCorrectAnswer();
            }
        });
    }

    onNewCharacterTwo = (char) => {
        let charGrid = document.getElementById('character-target-div');
        if (charGrid !== null) {
            charGrid.innerHTML = "";
        }        let flashChar = !this.state.drawnCharacters.includes(char);

        let numBeforeHint = 100;
        if (this.props.isTest) {
            numBeforeHint = 1;
        }

        let writer = window.HanziWriter.create('character-target-div', char[0], {
            width: 150,
            height: 150,
            padding: 20,
            delayBetweenStrokes: 10,
            strokeAnimationSpeed: 1,
            showOutline: false,
            showCharacter: flashChar,
            showHintAfterMisses: numBeforeHint
        });
        
        let idkButton = document.getElementById('idk');
        let idkCharNoParams = () => {
            this.onidkCharTwo(writer, char, numBeforeHint);
        }
        idkButton.addEventListener('click', function executeIdk() {
            idkCharNoParams();
            idkButton.removeEventListener('click', executeIdk, false);
        });
        
        writer.quiz({
            onComplete: () => {
                document.getElementById('character-target-div').innerHTML = "";
                let writer = window.HanziWriter.create('character-target-div', char[1], {
                    width: 150,
                    height: 150,
                    padding: 20,
                    delayBetweenStrokes: 300,
                    showOutline: false,
                    showCharacter: flashChar,
                    showHintAfterMisses: numBeforeHint
                });
                writer.quiz({
                    onComplete: () => {
                        this.setState(prevState => {
                            return {
                                drawnCharacters: prevState.drawnCharacters.concat(char)
                            }
                        });
                        document.getElementById('character-target-div').innerHTML = "";
                        this.onCorrectAnswer();
                    }
                });
            }
        });
    }

    onNewCharacterThree = (char) => {
        document.getElementById('character-target-div').innerHTML = "";
        let flashChar = !this.state.drawnCharacters.includes(char);

        let numBeforeHint = 100;
        if (this.props.isTest) {
            numBeforeHint = 1;
        }

        let writer = window.HanziWriter.create('character-target-div', char[0], {
            width: 150,
            height: 150,
            padding: 20,
            delayBetweenStrokes: 300,
            showOutline: false,
            showCharacter: flashChar,
            showHintAfterMisses: 100
        });

        let idkButton = document.getElementById('idk');
        let idkCharNoParams = () => {
            this.onidkCharThree(writer, char, numBeforeHint);
        }
        idkButton.addEventListener('click', function executeIdk() {
            idkCharNoParams();
            idkButton.removeEventListener('click', executeIdk, false);
        });

        writer.quiz({
            onComplete: () => {
                document.getElementById('character-target-div').innerHTML = "";
                let writer = window.HanziWriter.create('character-target-div', char[1], {
                    width: 150,
                    height: 150,
                    padding: 20,
                    delayBetweenStrokes: 300,
                    showOutline: false,
                    showCharacter: flashChar,
                    showHintAfterMisses: 100
                });
                writer.quiz({
                    onComplete: () => {
                        document.getElementById('character-target-div').innerHTML = "";
                        let writer = window.HanziWriter.create('character-target-div', char[2], {
                            width: 150,
                            height: 150,
                            padding: 20,
                            delayBetweenStrokes: 300,
                            showOutline: false,
                            showCharacter: flashChar,
                            showHintAfterMisses: 100
                        });
                        writer.quiz({
                            onComplete: () => {
                                this.setState(prevState => {
                                    return {
                                        drawnCharacters: prevState.drawnCharacters.concat(char)
                                    }
                                });
                                document.getElementById('character-target-div').innerHTML = "";
                                this.onCorrectAnswer();
                            }
                        });
                    }
                });
            }
        });
    }

    onKeyPress = (e) => {
        if (e.key !== 'Enter') {
            return;
        }
        this.onSubmitAnswer();
        this.setState({answerInput: ''});
    }

    onInputChanged = (e) => {
        this.setState({answerInput: e.target.value});
    }

    onCorrectAnswer = () => {
        this.setState({result: 'Correct!'});
        if (this.state.useSound) {
            beep.play();
        }
        let permIndex = this.state.permList.indexOf(this.state.perm);
        let newPermList = this.state.permList.slice()

        if (permIndex !== -1) {
            newPermList.splice(permIndex, 1);
            this.setState({permList: newPermList});
        }
        //this.move();
        if (newPermList.length !== 0) {
            let newQuestion = testLogic.assignQA(this.state.testSet, newPermList, this.state.charSet);
            setTimeout(
                function() {
                    this.setState({
                        perm: newQuestion.perm,
                        answer: newQuestion.answer,
                        answerCategory: newQuestion.answerCategory,
                        question: newQuestion.question,
                        questionCategory: newQuestion.questionCategory,
                        chosenCharacter: newQuestion.chosenCharacter,
                        result: '',
                        answerInput: '',
                        showInput: false,
                        numSpeakTries: 0
                    });
                }
                .bind(this),
                1000
            );
        } else {
            //finishTest();
            this.onFinishTest();
            this.setState({result: 'Finished!'})
        }
    }

    onSubmitAnswer = () => {
        /* eslint-disable */
        if (this.state.answerCategory === 'pinyin' && this.state.answerInput.trim().replace(' ', '').toLowerCase() == this.state.answer.replace(' ', '') || 
                this.state.answerCategory === 'meaning' && this.state.answer.includes(this.state.answerInput.trim().toLowerCase())) {
            this.onCorrectAnswer();
        /* eslint-enable */
        } else if (this.state.answerCategory === 'pinyin') {
            let resultString = testLogic.toneChecker(this.state.answerInput.toLowerCase(), this.state.answer);
            this.setState({result: resultString});
        } else {
            if (this.state.useSound) {
                fail.play();
            }
            this.setState({result: 'Try Again'});
        }
    }

    submitSpeech = (speech) => {
        let asPinyin = pinyinConverter(speech, {
            style: pinyinConverter.STYLE_TONE2
        });

        if (speech === this.state.chosenCharacter) {
            this.onCorrectAnswer();
        } else if (asPinyin.join(' ') === this.state.answer.slice(1, this.state.answer.length-1)) {
            this.onCorrectAnswer();
        } else {
            fail.play();
            if (this.state.numSpeakTries > 1) {
                this.setState({
                    result: `We heard: '${asPinyin.join(' ')}', which is wrong. Try again...`,
                    showInput: true
                });
            } else {
                this.setState(prevState => {
                    return {
                        result: `We heard: '${asPinyin.join(' ')}', which is wrong. Try again...`,
                        numSpeakTries: prevState.numSpeakTries + 1
                    }
                });
            }
        }
    }

    onSpeakPinyin = (word) => {
        let synth = window.speechSynthesis;
        let utterThis = new SpeechSynthesisUtterance(word);
        utterThis.lang = 'zh-CN';
        synth.cancel();
        synth.speak(utterThis);
    }

    onListenPinyin = () => {
        let recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'zh-CN';

        recognition.addEventListener('result', event => {
            let result = event.results[0][0].transcript;
            this.submitSpeech(result);
        });
        this.setState({result: "Listening..."})
        recognition.start();

    }

    onIDontKnow = () => {
        
        let charDivExists = this.state.answerCategory === 'character' && this.state.useHandwriting;
        
        if (charDivExists) {
            return;
        }
        
        console.log("idk executing");

        this.setState({idkDisabled: true});
        this.setState(prevState => {
            let idkChar = prevState.testSet[prevState.perm.index][this.state.charSet];
            return {
                idkList: prevState.idkList.concat(idkChar)
            }
        });

        this.setState({answerInput: ''});

        let displayAnswer = this.state.answer;
        if (this.state.answerCategory === 'meaning') {
            displayAnswer = displayAnswer.join('/');
        }
        this.setState({result: `Answer was '${displayAnswer}'`});


        let newQuestion = testLogic.assignQA(this.state.testSet, this.state.permList, this.state.charSet);
        
        setTimeout(
            function() {
                this.setState({
                    perm: newQuestion.perm,
                    answer: newQuestion.answer,
                    answerCategory: newQuestion.answerCategory,
                    question: newQuestion.question,
                    questionCategory: newQuestion.questionCategory,
                    chosenCharacter: newQuestion.chosenCharacter,
                    idkDisabled: false,
                    result: '',
                    answerInput: ''
                });
            }
            .bind(this),
            2000
        );
    }
    

    onFinishTest = () => {
        let idkCounts = testLogic.Counter(this.state.idkList);
        let wordScores = [];
        let sendScores = [];
        this.state.testSet.forEach(word => {
            let count = idkCounts[word[this.state.charSet]] || 0;
            if (count > 4) {
                count = 4;
            }

            let scoreDict = {
                0: "Very Strong",
                1: "Strong",
                2: "Average",
                3: "Weak",
                4: "Very Weak"
            }

            wordScores.push({
                char: word[this.state.charSet],
                score: scoreDict[count]
            }); 

            sendScores.push({
                word_id: word.id,
                score: 4-count
            }); 
        });

        if (!this.props.isTest) {
            this.onSendScores(sendScores);
        }

        this.setState({
            testFinished: true,
            scoreList: wordScores
        });
    }

    onSendScores = (testResults) => {
        fetch('/api/finish-test', {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                user_id: 1,
                scores: testResults
            }),
            cache: "no-cache",
            headers: new Headers({
                "content-type": "application/json",
                "x-access-token": this.props.token
            })
        })
        .then(
            function(response) {
                if (!response.ok) {
                    console.log(`Problem. Status Code: ${response.status}`);
                    return;
                }
            }
        )
        .catch(function(error) {
            console.log("Fetch error: " + error);
        })
    }

    onClickAddWords = () => {
        this.props.history.push("/add-words");
    }

    onFocusEntry =  (e) => {
        e.preventDefault(); e.stopPropagation();
        let topVal = document.getElementById('q-phrase-box').offsetTop;
        window.scrollTo(0, topVal - 5);
    }

    onHomeClicked = () => {
        this.props.history.push("/");
    }

    render () {
        let progressNum = Math.floor(this.state.permList.length / this.state.initNumPerms * 100);
        progressNum = progressNum ? progressNum : 0;

        let inputElem = <Input 
                            keyPressed={this.onKeyPress} 
                            value={this.state.answerInput}
                            changed={this.onInputChanged}
                            focussed={this.onFocusEntry}
                            autoFocus={true}/>

        let characterTest = <div 
            id="character-target-div" 
            style={{
                backgroundColor: 'lightgray',
                width: '150px',
                margin: '0 auto',
                borderRadius: '3px'
            }}></div>

        let answerFormat;

        if (this.state.answerCategory === 'pinyin' && this.state.useSpeechRecognition) {
            answerFormat = (
                <div>
                    <PictureButton 
                        colour="yellow"
                        src={micPic}
                        clicked={() => this.onListenPinyin()}/>
                    {this.state.showInput ? (
                        <Input 
                        keyPressed={this.onKeyPress} 
                        value={this.state.answerInput}
                        changed={this.onInputChanged}
                        placeholder="Type pinyin..."/>
                    ) : null}
                </div>
            );
        } else if (this.state.answerCategory === 'character') {
            answerFormat = characterTest;
        } else {
            answerFormat = inputElem;
        }

        let displayQ = this.state.question;
        if (this.state.questionCategory === 'meaning') {
            displayQ = displayQ.join('/')
        }
        let onQuestionCard = <h2>{displayQ}</h2>;

        if (this.state.questionCategory === 'pinyin' && this.state.useSound) {
            onQuestionCard = (
                <PictureButton
                    colour="grey" 
                    src={speakerPic}
                    clicked={() => this.onSpeakPinyin(this.state.chosenCharacter)}
                    />
            );
        }

        if (this.state.testSet.length !== 0 || this.props.isTest) {
            let verb = this.state.answerCategory === 'character' ? 'Draw the ' : 'Enter the ';
            return (
                <Aux>
                    <Backdrop show={this.state.testFinished} />
                    <Modal 
                        show={this.state.testFinished}
                        style={{
                            backgroundColor: 'rgb(82, 129, 122)',
                            top: '20%'
                        }}>
                        <TestSummary 
                            isTest={this.props.isTest} 
                            homeClicked={this.onHomeClicked} 
                            scores={this.state.scoreList}/>
                    </Modal>
                    <div className={classes.Test}>
                        <ProgressBar progress={progressNum}/>
                        <h3 id="q-phrase-box">{verb}<span>{this.state.answerCategory}</span> for...</h3>
                        <div className={classes.QuestionCard}>
                            {onQuestionCard}
                        </div>
                        <p className={classes.Result}>{this.state.result}</p>
                        <div className={classes.InputDiv}>
                            {answerFormat}
                        </div>
                        <div style={{paddingTop: '30px', display: 'flex', justifyContent: 'center'}}>
                            <Button clicked={this.onIDontKnow} id="idk">I Don't Know</Button>
                            <Button clicked={this,this.onSubmitAnswer}>Submit</Button>
                        </div>
                    </div>
                </Aux>
            );
        }
        else {
            return (
                <Modal 
                    show={this.state.showErrorMessage}>
                        <p>You are up to date!</p>
                        <Button clicked={this.onClickAddWords}>Add Words</Button>
                </Modal> 
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        speechAvailable: state.settings.speechAvailable,
        synthAvailable: state.settings.synthAvailable
    }
}

export default withRouter(connect(mapStateToProps)(Test));

