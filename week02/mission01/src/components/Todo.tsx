import React, { useState } from 'react';
import type { TTodo } from '../types/todo';

const Todo = () => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
    const [input, setInput] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const text = input.trim();

        if (text) {
            const newTodo: TTodo = { id: Date.now(), text };
            setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]);
            setInput('');
        }
    };

    const completeTodo = (todo: TTodo) => {
        setTodos(prevTodos => prevTodos.filter((t) => t.id !== todo.id));
        setDoneTodos((prevDoneTodos): TTodo[] => [...prevDoneTodos, todo]);
    }

    const deleteTodo = (todo: TTodo): void => {
        setDoneTodos((prevDoneTodo): TTodo[] =>
        prevDoneTodo.filter((t) => t.id !== todo.id))
    }
    
    return (
        <div className='todo-container'>
            <h1 className='todo-container__header'>ARI'S TODO</h1>
            <form className='todo-container__form' onSubmit={handleSubmit}>
                <input value={input} onChange={(e): void => setInput(e.target.value)} 
                type='text' className='todo-container__input'
                placeholder='할 일 입력' required />
                <button type='submit' className='todo-container__button'>
                    할 일 추가
                </button>
            </form>
            <div className='render-container'>
                <div className='render-container__section'>
                    <h2 className='render-container__title'>할 일</h2>
                    <ul id='todo-list' className='render-container__list'>
                        {todos.map((todo) => (
                        <li key={todo.id} className='render-container__item'>
                            <span className='render-container__item-text'>{todo.text}</span>
                            <button onClickCapture={(): void => completeTodo(todo)}
                                style={{ backgroundColor: '#28a745' }}
                                className='render-container__item-button'
                                onClick={() => {
                                    setDoneTodos([...doneTodos, todo]);
                                    setTodos(todos.filter((t) => t.id !== todo.id));
                                }}>완료</button>
                        </li>
                        ))}
                    </ul>
                </div>
                <div className='render-container__section'>
                    <h2 className='render-container__title'>완료</h2>
                    <ul id='done-list' className='render-container__list'>
                        {doneTodos.map((todo) => (
                        <li key={todo.id} className='render-container__item'>
                            <span className='render-container__item-text'>{todo.text}</span>
                            <button 
                                style={{ backgroundColor: '#dc3545' }}
                                className='render-container__item-button'
                                onClick={(): void => deleteTodo(todo)}>삭제</button>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Todo;