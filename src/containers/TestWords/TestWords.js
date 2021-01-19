import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as wordActions from '../../store/actions/index';

import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Buttons/Button/Button';
import Test from '../../components/Test/Test';

class TestWords extends Component {
    componentDidMount () {
        if (!this.props.isTest) {
            this.props.onInitWords(this.props.token);
        }
    }    

    onClickAddWords = () => {
        this.props.history.push("/add-words");
    }

    render () {
        let test = null;

        if (this.props.isTest) {
            test = <Test isTest words={[{
                simp: '你好',
                trad: '你好',
                pinyin: 'ni3 hao3',
                meaning: 'hello/hi',
                due_date: new Date()
            }]} />
            return test;
        }

        if (this.props.words.length > 0) {
            test = <Test words={this.props.words}/>
        } else {
            test = <Modal 
                    show>
                    <p>You have no words to test!</p>
                    <Button clicked={this.onClickAddWords}>Add Words</Button>
                </Modal>; 
        }

        return test
    }
}

const mapStateToProps = (state) => {
    return {
        words: state.addWords.words,
        token: state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onInitWords: (token) => dispatch(wordActions.initWords(token))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(TestWords);
