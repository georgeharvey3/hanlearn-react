import React, { Component } from 'react';

import classes from './MainBanner.module.css';

import Input from '../UI/Input/Input';
import Button from '../UI/Buttons/Button/Button';

class MainBanner extends Component {
    state = {
        text: "Add words to your bank..."
    }
    onFocusInput = () => {
        this.setState({text: "Enter a Chinese word (e.g. 你好)"})
    }

    onBlurInput = () => {
        this.setState({text: "Add words to your bank..."})
    }

    render () {
        return (
            <div className={classes.MainBanner}>
                <h2>{this.state.text}</h2>
                <form>
                    <Input 
                        value={this.props.newWord} 
                        changed={this.props.inputChanged}
                        focussed={this.onFocusInput}
                        blurred={this.onBlurInput}/>
                    <Button clicked={this.props.submitClicked}>Submit</Button>
                </form>
            </div>
        );
    }
}

export default MainBanner;