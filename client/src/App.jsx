import React from "react";
import Room from "./components/Room/Room";
import style from './App.module.scss';
import Home from "./components/Home/Home";
import {Route, Routes} from 'react-router-dom';

const App = () => {
  return (
    <div className={style.App}>
        <Routes>
          <Route path='/' element = {<Home/>}/>
          <Route path='/room' element = {<Room/>}/>
        </Routes>
    </div>
  );
};

export default App;