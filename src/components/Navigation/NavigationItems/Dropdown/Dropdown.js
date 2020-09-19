import React from 'react';

import classes from './Dropdown.module.css';

const dropdown = (props) => {
    return (
        <div className={classes.Dropdown}>
            <button className={classes.Dropbtn}>Dropdown</button>
            <div className={classes.DropdownContent}>
                <div className={classes.SettingsGrid}>
                    <p className={classes.SettingsLabel}>Character set: </p>
                    <div className={classes.Settings}>
                        <input type="radio" id="simp" name="char-set" onchange={props.radioChange} value="simp" checked={props.checked} />
                        <label for="simp">Simplified</label>
                        <input type="radio" id="trad" name="char-set" onchange={props.radioChange} value="trad" />
                        <label for="trad">Traditional</label>
                    </div>
                    <p className={classes.SettingsLabel}>Number of words per test: </p>
                    <div className={classes.SliderBox}>
                        <div>
                            <p id="range-output"></p>
                        </div>
                        <input type="range" min="1" max="20" value="10" class="slider" id="slider" />
                    </div>
                </div>
            </div>
       </div>
    );
}

export default dropdown;