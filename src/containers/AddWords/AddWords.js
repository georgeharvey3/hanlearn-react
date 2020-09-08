import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import MainBanner from '../../components/AddWords/MainBanner';

class AddWords extends Component {
    render() {
        return (
            <Aux>
                <MainBanner />
            </Aux>
        );
    }
}

export default AddWords;