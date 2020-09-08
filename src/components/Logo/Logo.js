import React from 'react';

import classes from './Logo.module.css';

import hanLearnLogo from '../../assets/images/hlclear.png';

const logo = () => (
    <div className={classes.Logo}>
        <img src={hanLearnLogo} alt="HanLearn"/>
    </div>
);

export default logo;