import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as wordActions from '../../store/actions/index';


import Test from '../../components/Test/Test';

class TestWords extends Component {

    state = {

    }

    componentDidMount () {
        this.props.onInitWords();
    }

    componentDidUpdate(prevProps, prevState) {
        Object.entries(this.props).forEach(([key, val]) =>
          prevProps[key] !== val && console.log(`Prop '${key}' changed`)
        );
        if (this.state) {
          Object.entries(this.state).forEach(([key, val]) =>
            prevState[key] !== val && console.log(`State '${key}' changed`)
          );
        }
      }

    

    render () {
        let test = null;

        if (this.props.words && this.props.words.length > 0) {
            test = <Test words={this.props.words}/>

        }
        return test
    }
}

const mapStateToProps = (state) => {
    return {
        words: state.words
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onInitWords: () => dispatch(wordActions.initWords())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(TestWords);
