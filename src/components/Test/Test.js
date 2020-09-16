import React, { Component } from 'react';
import { Howl } from 'howler';

import classes from './Test.module.css';

import * as testLogic from './Logic/TestLogic';
import Aux from '../../hoc/Aux';
import Modal from '../UI/Modal/Modal';
import Backdrop from '../UI/Backdrop/Backdrop';
import ProgressBar from './ProgressBar/ProgressBar';
import Input from '../UI/Input/Input';
import Buttons from '../UI/Buttons/Buttons';
import TestSummary from './TestSummary/TestSummary';
import PictureButton from '../UI/Buttons/PictureButton/PictureButton';

import micPic from '../../assets/images/microphone.png';
import speakerPic from '../../assets/images/speaker.png';

import successSound from '../../assets/sounds/success1.wav';
import failSound from '../../assets/sounds/failure1.wav';

let NUM_WORDS = 1;
let CHAR_SET = 'simp';

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
    state = {
        testSet: [],
        permList: [],
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
        numSpeakTries: 0
    }

    componentDidMount () {
        this.onInitialiseTestSet();
    }

    componentDidUpdate = (prevProps, prevState) => {

        if (prevState.perm !== this.state.perm) {
            if (this.state.questionCategory === 'pinyin') {
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

    onInitialiseTestSet = () => {
        let allWords = this.props.words.slice();
        if (allWords.length === 0) {
            return;
        }
        let selectedWords = testLogic.chooseTestSet(allWords, NUM_WORDS)
        let permList = testLogic.setPermList(selectedWords);
        let initialVals = testLogic.assignQA(selectedWords, permList, CHAR_SET);
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

    onNewCharacterOne = (char) => {
        document.getElementById('character-target-div').innerHTML = "";
        let flashChar = !this.state.drawnCharacters.includes(char);

        let writer = window.HanziWriter.create('character-target-div', char, {
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
                this.onCorrectAnswer();
            }
        });
    }

    onNewCharacterTwo = (char) => {
        document.getElementById('character-target-div').innerHTML = "";
        let flashChar = !this.state.drawnCharacters.includes(char);

        let writer = window.HanziWriter.create('character-target-div', char[0], {
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

        let writer = window.HanziWriter.create('character-target-div', char[0], {
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
        beep.play();
        let permIndex = this.state.permList.indexOf(this.state.perm);
        let newPermList = this.state.permList.slice()

        if (permIndex !== -1) {
            newPermList.splice(permIndex, 1);
            this.setState({permList: newPermList});
        }
        //this.move();
        if (newPermList.length !== 0) {
            let newQuestion = testLogic.assignQA(this.state.testSet, newPermList, CHAR_SET);
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
        if (this.state.answerCategory === 'pinyin' && this.state.answerInput.replace(' ', '').toLowerCase() == this.state.answer.replace(' ', '') || 
                this.state.answerCategory === 'meaning' && this.state.answer.includes(this.state.answerInput.toLowerCase())) {
            this.onCorrectAnswer();
        /* eslint-enable */
        } else if (this.state.answerCategory === 'pinyin') {
            let resultString = testLogic.toneChecker(this.state.answerInput.toLowerCase(), this.state.answer);
            this.setState({result: resultString});
        } else {
            fail.play();
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
        this.setState({answerInput: ''});

        let displayAnswer = this.state.answer;
        if (this.state.answerCategory === 'meaning') {
            displayAnswer = displayAnswer.join('/');
        }
        this.setState({result: `Answer was '${displayAnswer}'`});
        this.setState({idkDisabled: true});
        this.setState(prevState => {
            let idkChar = prevState.testSet[prevState.perm.index][CHAR_SET];
            return {
                idkList: prevState.idkList.concat(idkChar)
            }
        });

        let newQuestion = testLogic.assignQA(this.state.testSet, this.state.permList, CHAR_SET);
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
            let count = idkCounts[word[CHAR_SET]] || 0;
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
                char: word[CHAR_SET],
                score: scoreDict[count]
            }); 

            sendScores.push({
                word_id: word.id,
                score: 4-count
            }); 
            
            this.onSendScores(sendScores);

            this.setState({testFinished: true});

            this.setState({scoreList: wordScores});
        });
    }

    onSendScores = (testResults) => {
        fetch('/finish-test', {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                user_id: 1,
                scores: testResults
            }),
            cache: "no-cache",
            headers: new Headers({
                "content-type": "application/json",
            })
        })
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log(`Problem. Status Code: ${response.status}`);
                    return;
                }
            }
        )
        .catch(function(error) {
            console.log("Fetch error: " + error);
        })
    }

    render () {


        let progressNum = Math.floor(this.state.permList.length / this.state.initNumPerms * 100);
        progressNum = progressNum ? progressNum : 0;

        let inputElem = <Input 
                            keyPressed={this.onKeyPress} 
                            value={this.state.answerInput}
                            changed={this.onInputChanged}/>

        let characterTest = <div 
            id="character-target-div" 
            style={{
                backgroundColor: 'lightgray',
                width: '150px',
                margin: '0 auto',
                borderRadius: '3px'
            }}></div>

        let answerFormat = this.state.answerCategory === 'character' ? characterTest : inputElem;

        if (this.state.answerCategory === 'pinyin') {
            answerFormat = (
                <div>
                    <PictureButton 
                        colour="yellow"
                        src={micPic}
                        clicked={this.onListenPinyin}/>
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

        if (this.state.questionCategory === 'pinyin') {
            onQuestionCard = (
                <PictureButton
                    colour="grey" 
                    src={speakerPic}
                    clicked={() => this.onSpeakPinyin(this.state.chosenCharacter)}
                    />
            );
        }

        return (
            <Aux>
                <Backdrop show={this.state.testFinished} />
                <Modal 
                    show={this.state.testFinished}
                    style={{backgroundColor: 'rgb(82, 129, 122)'}}>
                    <TestSummary scores={this.state.scoreList}/>
                </Modal>
                <div className={classes.Test}>
                    <ProgressBar progress={progressNum}/>
                    <h3>Enter the <span>{this.state.answerCategory}</span> for...</h3>
                    <div className={classes.QuestionCard}>
                        {onQuestionCard}
                    </div>
                    <p className={classes.Result}>{this.state.result}</p>
                    <div style={{
                        height: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end'
                    }}>
                        {answerFormat}
                    </div>
                    <Buttons clickedHandlers={[this.onIDontKnow, this.onSubmitAnswer]}>{["I Don't Know", "Submit"]}</Buttons>
                </div>
            </Aux>
        );
    }
}



export default Test;

