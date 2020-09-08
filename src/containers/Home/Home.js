import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import MainBanner from '../../components/Home/MainBanner/MainBanner';
import ExpBanner from '../../components/Home/ExpBanner/ExpBanner';
import SignUpBanner from '../../components/Home/SignUpBanner/SignUpBanner';
import Footer from '../../components/Home/Footer/Footer';

import addCap from '../../assets/images/addwords_pic.png';
import testCap from '../../assets/images/testwords_pic.png';

class Home extends Component {
    render () {
        return (
            <Aux>
                <MainBanner />
                <ExpBanner priority='left' img={addCap} heading={'Build your word bank'}>
                    Simply search for the Chinese word you want to add and we'll give you the pinyin pronunctiation and the meaning. Don't like our translation? Feel free to add your own!
                </ExpBanner>
                <ExpBanner priority='right' img={testCap} heading={'Start learning!'}>
                    During the test, you will be asked to complete various pairwise combinations between the character(s), pinyin and meaning of each word. When you feel comfortable with a word you can eliminate it from your bank.
                </ExpBanner>
                <SignUpBanner />
                <Footer />
            </Aux>
        );
    }
}

export default Home;

