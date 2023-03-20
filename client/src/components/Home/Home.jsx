import React, { useState } from 'react';
import style from './Home.module.scss';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [roomName, setRoomName] = useState('');

    const userNameInputChangeHandler = (event) => {
        setUserName(event.target.value);
    }

    const roomNameInputChangeHandler = (event) => {
        setRoomName(event.target.value);
    }

    const joinChatButtonClickHandler = (event) => {
        event.preventDefault();

        if (userName === '' || roomName === '') {
            return;
        }

        localStorage.setItem("userName", userName);
        localStorage.setItem("roomName", roomName);

        setUserName("");
        setRoomName("");

        axios.post(
            process.env.REACT_APP_SERVER_URL + '/create-room', 
            {userName,roomName}
        ).then(response => console.log(response.data));
             
        navigate('/room');
    }

    const keyPressHandler = (event) => {
        if (event.code === 'Enter') {
            joinChatButtonClickHandler(event);
        }
    } 

    return (
        <form className={style.Home}>
            <div className={style.Content}>
                <input
                    type="text"
                    placeholder="Choose your username"
                    value={userName}
                    onChange={userNameInputChangeHandler}
                    onKeyDown={keyPressHandler}
                />
                <input
                    type="text"
                    placeholder="Enter the room name"
                    value={roomName}
                    onChange={roomNameInputChangeHandler}
                    onKeyDown={keyPressHandler}
                />
                <button onClick={joinChatButtonClickHandler}>
                    Join Chat
                </button>
            </div>
        </form>
    );
}

export default Home;