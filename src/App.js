import Todo from './components/Todo';
import Form from './components/Form';
import FilterButton from './components/FilterButton';
import usePrevious from './utils/usePrevious';
import React, { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';

const FILTER_MAP = new Map([
  ['All', () => true],
  ['Incomplete', (task) => !task.completed],
  ['Completed', (task) => task.completed],
]);

const [...FILTER_NAMES] = FILTER_MAP.keys();
// console.log(FILTER_MAP, FILTER_NAMES);

// function usePrevious(value) {
//   const ref = useRef();
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// }

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  // console.log(tasks);
  const [filter, setFilter] = useState('All');

  function addTask(name) {
    if (!name) return;
    const newTask = { id: `todo-${nanoid()}`, name: name, completed: false };
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editTaskList);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  const taskList = tasks
    ?.filter(FILTER_MAP.get(filter))
    .map((task) => (
      <Todo
        key={task.id}
        id={task.id}
        name={task.name}
        completed={task.completed}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const taskNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${taskNoun} remaining`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
