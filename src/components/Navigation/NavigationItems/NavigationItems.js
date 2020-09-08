import React from 'react';

import classes from './NavigationItems.module.css';

import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/">First</NavigationItem>
        <NavigationItem link="/add-words">Second</NavigationItem>
        <NavigationItem link="/test-words">Third</NavigationItem>
    </ul>
)

export default navigationItems;