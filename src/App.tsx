import React from 'react';
//正常版本
import {TodoList} from './component/todo';
//bug版本
// import { TodoList } from './components/todo';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="App">
      <h1>Todo List</h1>
      <TodoList></TodoList>
    </div>
    </div>
  );
}

export default App;
