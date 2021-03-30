import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Aux from '../../../hoc/Aux';
import Table from '../../UI/Table/Table';
import TableRow from '../../UI/Table/TableRow/TableRow';
import Buttons from '../../UI/Buttons/Buttons';
import Button from '../../UI/Buttons/Button/Button';

class TestSummary extends Component {

    addWordsPressed = () => {
        this.props.history.push('/add-words');
    }

    testAgainPressed = () => {
        window.location.reload();
    }

    render () {
        let scoreRows = this.props.scores.map((row, index) => {
            return (
                <TableRow key={index}>{[row.char, row.score]}</TableRow>
            );
        });

        let buttons = <Buttons clickedHandlers={[this.addWordsPressed, this.testAgainPressed]}>{['Add Words', 'Test Again']}</Buttons>

        if (this.props.isTest) {
            buttons = <Button clicked={this.props.homeClicked}>Home</Button>
        }

        return (
            <Aux>
                <h3>Test Summary</h3>
                <Table headings={['Word', 'Score']}>
                    {scoreRows}
                </Table>
                <Button clicked={this.props.continueClicked}>Continue</Button>
                {buttons}
            </Aux>
        );
    }
}

export default withRouter(TestSummary);