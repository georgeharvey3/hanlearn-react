import React from 'react';

import classes from './SignUpBanner.module.css';

import Button from '../../UI/Button/Button';

const signUpBanner = () => (
    <div className={classes.SignUpBanner}>
        <h3>Join HanLearn!</h3>
        <p>Create a free account to edit translations, add your own words and practise with spaced repitition.</p>
        <Button colour='red'>Sign Up</Button>
    </div>
);

export default signUpBanner;