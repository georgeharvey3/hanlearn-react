import React, { Component } from 'react';

import classes from './Settings.module.css';

class Settings extends Component {
    constructor() {
        super();
        let localCharSet = localStorage.getItem("charSet");
        let localNumWords = localStorage.getItem("numWords");
        let useSpeechRecognition = localStorage.getItem("useSpeechRecognition");
        let useHandwriting = localStorage.getItem("useHandwriting");
        let useSound = localStorage.getItem("useSound");
        this.state = {
            charSet: localCharSet || 'simp',
            numWords: localNumWords || 5,
            useSpeechRecognition: useSpeechRecognition === 'false' ? false : true,
            useHandwriting: useHandwriting === 'false' ? false : true,
            useSound: useSound === 'false' ? false : true,
        }
        this.onRadioChange = this.onRadioChange.bind(this);
    }
    

    onRadioChange = (e) => {
        this.setState({
            charSet: e.target.value
        });
        localStorage.setItem("charSet", e.target.value);
    }

    onSliderChange = (e) => {
        this.setState({
            numWords: e.target.value
        });
        localStorage.setItem("numWords", e.target.value);
    }

    onCheckChange = (e) => {
        this.setState({
            [e.target.value]: !this.state[e.target.value]
        });
        localStorage.setItem(e.target.value, e.target.checked);

    }

    render () {
        return (
            <div className={classes.Settings}>
                <h3>Character Set</h3>
                <label>Simplified
                    <input 
                        type="radio" 
                        checked={this.state.charSet === "simp"}
                        value="simp"
                        onChange={this.onRadioChange}/>
                </label>
                <label>Traditional
                    <input 
                        type="radio" 
                        checked={this.state.charSet === "trad"}
                        value="trad"
                        onChange={this.onRadioChange}/>
                </label>
                <hr />
                <h3>Characters per test:</h3>
                <div className={classes.SliderBox}>
                    <p>{this.state.numWords}</p>
                    <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={this.state.numWords}
                        className={classes.Slider} 
                        id="slider" 
                        onChange={this.onSliderChange}/>
                </div>
                <hr />
                <div className={classes.CheckGrid}> 
                    <input 
                        type="checkbox" 
                        value="useSound"
                        checked={this.state.useSound}
                        onChange={this.onCheckChange}/><label>Enable sound</label>                     
                    <input 
                        type="checkbox" 
                        value="useSpeechRecognition" 
                        checked={this.state.useSpeechRecognition}
                        onChange={this.onCheckChange}/><label>Enable speech recognition</label>                        
                    <input 
                        type="checkbox" 
                        value="useHandwriting"
                        checked={this.state.useHandwriting}
                        onChange={this.onCheckChange}/><label>Enable handwriting input</label>                           
                    
                </div>
            </div>
        );
    }
}

export default Settings;