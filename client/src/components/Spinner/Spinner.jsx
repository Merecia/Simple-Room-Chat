import React from 'react';
import style from './Spinner.module.scss';

const Spinner = ({top, left}) => {
    return (
        <div className={style.Spinner} style = {{top, left}}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

export default Spinner;