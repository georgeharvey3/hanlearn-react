import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as wordActions from '../../store/actions/index';


import Test from '../../components/Test/Test';

class TestWords extends Component {

    state = {

    }

    componentDidMount () {
        if (!this.props.isTest) {
            this.props.onInitWords(this.props.token);
        }
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

        test = <Test words={this.props.words}/>
        
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
