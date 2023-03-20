import React, { useEffect, useState } from 'react';
import Message from '../Message/Message';
import style from './Room.module.scss';
import io from "socket.io-client";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

const Room = () => {
    const [messages, setMessages] = useState([]);
    const [enteredMessage, setEnteredMessage] = useState('');
    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);

    const navigate = useNavigate();

    const leaveRoom = () => {
        if (socket) {
            socket.emit('leave-room', roomName, userName);
        }

        localStorage.removeItem('userName');
        localStorage.removeItem('roomName');
    }

    useEffect(() => {
        const roomName = localStorage.getItem('roomName');
        const userName = localStorage.getItem('userName');

        const socket = io.connect(process.env.REACT_APP_SERVER_URL, {
            query: { roomName, userName }
        });

        loadMessages();

        setRoomName(roomName);
        setUserName(userName);
        setSocket(socket);

        return (() => {
            leaveRoom();
        });
    }, [])

    useEffect(() => {
        if (socket) {
            socket.on("chat", (message) => {
                if (messages?.length > 0) {
                    setMessages([...messages, message]);
                } else {
                    setMessages([message]);
                }
            })
        }
    }, [messages?.length])

    const loadMessages = async () => {
        const roomName = localStorage.getItem('roomName');

        setLoading(true);
        await axios.get(`${process.env.REACT_APP_SERVER_URL}/messages/${roomName}`)
            .then(response => {
                setMessages(response.data.messages);
                setLoading(false);
            });
    }

    const renderMessages = (messages) => {
        return messages.map((message, index) => renderMessage(message, index));
    }

    const renderMessage = (message, index) => {
        return <Message
            key={index}
            username={message.name}
            text={message.text}
        />
    }

    const messageInputChangeHandler = (event) => {
        setEnteredMessage(event.target.value);
    }

    const sendButtonClickHandler = () => {
        if (enteredMessage !== '') {
            socket.emit("chat", roomName, userName, enteredMessage);
            setEnteredMessage('');
        }
    }

    const keyPressHandler = (event) => {
        if (enteredMessage !== '' && event.code === 'Enter') {
            socket.emit("chat", roomName, userName, enteredMessage);
            setEnteredMessage('');
        }
    }

    const leaveButtonClickHandler = () => {
        leaveRoom();
        navigate('/');
    }

    const renderRoom = () => {
        return (
            <div className={style.Room}>
                <header className={style.Topic}>
                    <h1> {roomName} </h1>
                </header>
                <div className={style.Messages}>
                    {messages ? renderMessages(messages) : null}
                </div>
                <footer className={style.Footer}>
                    <button
                        className={style.LeaveButton}
                        onClick={leaveButtonClickHandler}
                    >
                        Leave
                    </button>
                    <input
                        type="text"
                        onChange={messageInputChangeHandler}
                        value={enteredMessage}
                        placeholder='Enter a message'
                        onKeyDown={keyPressHandler}
                    />
                    <button
                        className={style.SendButton}
                        onClick={sendButtonClickHandler}
                    >
                        Send
                    </button>
                </footer>
            </div>
        );
    }

    return (
        <>
            {loading ? <Spinner top = '40vh'/> : renderRoom()}
        </>
    );
}

export default Room;