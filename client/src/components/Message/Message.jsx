import React from 'react';
import style from './Message.module.scss';

const Message = ({username, text}) => {
    return (
        <div className = {style.Message}>
            <span className = {style.Username}> {username}: </span>
            <span className = {style.Text}> {text} </span>
        </div>
    )
}

export default Message;