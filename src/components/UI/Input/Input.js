import React from 'react';

import classes from './Input.module.css'

let testDict = {
    '你好': {
        pinyin: 'ni3 hao3',
        meaning: 'hello'
    },
    '再见': {
        pinyin: 'zai4 jian4',
        meaning: 'goodbye'
    },
    '非常': {
        pinyin: 'fei1 chang2',
        meaning: 'very'
    },
    '特别': {
        pinyin: 'te4 bie2',
        meaning: 'special'
    },
    '雨伞': {
        pinyin: 'yu3 san3',
        meaning: 'umbrella'
    }
}


const input = props => (
    <input
        className={classes.Input} 
        type="text" 
        placeholder={props.placeholder} 
        onChange={props.changed}
        value={props.value}
        onFocus={props.focussed}
        onBlur={props.blurred}/>
);

export default input;