
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // For animations

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('work');
  const [darkMode, setDarkMode] = useState(false);

  // Load todos
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) setTodos(JSON.parse(savedTodos));
  }, []);

  // Save todos
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Calculate completion progress
  const progress = todos.length > 0 
    ? Math.round((todos.filter(todo => todo.completed).length / todos.length) * 100) 
    : 0;

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: input, 
        completed: false, 
        category 
      }]);
      setInput('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Animation variants
  const todoItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Taskify</h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {todos.length} tasks · {progress}% done
            </p>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
            />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              className={`flex-1 px-4 py-3 border-l border-t border-b rounded-l-lg focus:outline-none focus:ring-2 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 focus:ring-blue-500' 
                  : 'bg-white border-gray-300 focus:ring-blue-400'
              }`}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`px-3 border-t border-b ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="work">💼 Work</option>
              <option value="personal">🏠 Personal</option>
              <option value="study">📚 Study</option>
            </select>
            <button
              onClick={addTodo}
              className={`px-4 py-3 rounded-r-lg font-medium transition-all ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          <AnimatePresence>
            {todos.map(todo => (
              <motion.div
                key={todo.id}
                variants={todoItemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                layout
                className={`p-4 rounded-lg shadow-sm transition-all ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-750' 
                    : 'bg-white hover:bg-gray-50'
                } border ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleComplete(todo.id)}
                      className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                        todo.completed 
                          ? 'bg-green-500 border-green-500' 
                          : darkMode 
                            ? 'border-gray-600' 
                            : 'border-gray-300'
                      }`}
                    >
                      {todo.completed && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div>
                      <p className={`${todo.completed ? 'line-through opacity-70' : ''} ${
                        darkMode ? 'text-gray-100' : 'text-gray-800'
                      }`}>
                        {todo.text}
                      </p>
                      <span className={`text-xs mt-1 inline-block px-2 py-1 rounded-full ${
                        todo.category === 'work' 
                          ? 'bg-blue-100 text-blue-800' 
                          : todo.category === 'personal' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                      } ${darkMode ? '!bg-opacity-20' : ''}`}>
                        {todo.category === 'work' ? '💼 Work' : todo.category === 'personal' ? '🏠 Personal' : '📚 Study'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className={`p-1 rounded-full ${
                      darkMode 
                        ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {todos.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 rounded-lg ${
              darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'
            }`}
          >
            <svg className="mx-auto h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium">No tasks yet</h3>
            <p className="mt-1">Add your first task above!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;