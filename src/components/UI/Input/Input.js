import React from 'react';

import classes from './Input.module.css'

const input = props => (
    <input
        className={classes.Input} 
        type="text"
        id={props.id} 
        placeholder={props.placeholder} 
        onChange={props.changed}
        onKeyPress={props.keyPressed}
        value={props.value}
        onFocus={props.focussed}
        onBlur={props.blurred}
        autoFocus={props.autoFocus}/>
);

export default input;