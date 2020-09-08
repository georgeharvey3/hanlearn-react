import React from 'react';

import classes from './MainBanner.module.css';

import Aux from '../../../hoc/Aux';
import Logo from '../../Logo/Logo';
import Button from '../../UI/Button/Button';

const mainBanner = () => (
    <Aux>
        <div className={classes.MainBanner}>
            <section>
                <h2>A vocabulary learning application, made especially for Mandarin</h2>
                <p>With Chinese vocabulary, there is more to learn than in other languages. Make long-lasting connections between the written forms, pronunciations and meanings of Chinese words with HanLearn</p>
            </section>
            <section className={classes.DesktopOnly}>
                <div className={classes.Logo}>
                    <Logo colour='red'/>
                </div>
            </section>
        </div>
        <div className={classes.Buttons}>
            <Button>Sign In</Button>
            <Button>Guest</Button>
        </div>
    </Aux>
);

export default mainBanner;