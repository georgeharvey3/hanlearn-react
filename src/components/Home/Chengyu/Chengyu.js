import React, { Component } from 'react';

import classes from './Chengyu.module.css';

class Chengyu extends Component {

    state = {
        finished: false,
        incorrect: [],
        chengyu: "",
        options: [],
        correct: ""
    }

    componentDidMount = () => {
        fetch('/api/get-chengyu')
        .then(response =>
            response.json().then(data => {
                this.setState({
                    chengyu: data.chengyu,
                    options: data.options,
                    correct: data.correct
                });
            })
        .catch(error => {
            console.log(error);
        }))
    }

    optionClicked = (event, index) => {
        if (this.state.options[index] !== this.state.correct) {
            this.setState(prevState => {
                return {
                    incorrect: prevState.incorrect.concat(index)
                }
            });
        } else {
            this.setState({
                finished: true
            })
        }
    }

    render () {
        return (
            <div className={classes.Chengyu}>
                <h3>Chengyu Of The Day</h3>
                <h2>{this.state.chengyu}</h2>
                <p>Choose the correct translation:</p>
                <ul>
                    {this.state.options.map((op, index) => {
                        let classNames = [classes.show];

                        if (this.state.finished) {
                            if (op !== this.state.correct) {
                                classNames = [];
                            } else {
                                classNames = [classes.show, classes.Correct];
                            }
                        }

                        if (this.state.incorrect.includes(index)) {
                            classNames.push(classes.Incorrect);
                        }

                        return (
                            <li 
                                className={classNames.join(" ")}
                                key={index} 
                                onClick={(event) => this.optionClicked(event, index)}>{op}
                            </li>
                        );
                    })}
                </ul>
            </div>
        )
    }
}

export default Chengyu;