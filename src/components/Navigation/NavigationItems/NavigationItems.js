import React from 'react';

import classes from './NavigationItems.module.css';

import NavigationItem from './NavigationItem/NavigationItem';
import Dropdown from './Dropdown/Dropdown';

import Aux from '../../../hoc/Aux';

const navigationItems = (props) => {
    let navigationItems = (
        <ul className={classes.NavigationItems}>
            <NavigationItem link="/">Home</NavigationItem>
            <NavigationItem link="/auth">Login</NavigationItem>
            <NavigationItem link="/register">Register</NavigationItem>

        </ul>
    );

    if (props.authenticated) {
        navigationItems = (
            <ul className={classes.NavigationItems}>
                <NavigationItem link="/">Home</NavigationItem>
                <Dropdown />
                <NavigationItem link="/add-words">Add</NavigationItem>
                <NavigationItem link="/test-words">Test</NavigationItem>
                <NavigationItem link="/logout">Logout</NavigationItem>
            </ul>
        )
    }
    return (
        <Aux>
            {navigationItems}
        </Aux>
    );
}

export default navigationItems;