import React from 'react';

import classes from './Button.module.css';

const button = (props) => {
    let attachedClasses = [classes.Button, classes.Yellow];

    if (props.colour === 'red') {
        attachedClasses = [classes.Button, classes.Red];
    }
    return (
        <button 
            className={attachedClasses.join(' ')}
            onClick={props.clicked}>
                {props.children}
        </button>
    );
}

export default button;