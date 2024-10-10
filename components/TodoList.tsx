'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';
import SearchAndFilter from './SearchAndFilter';
import { Todo } from '@/types/todo';

export default function TodoList() {
  const [user] = useAuthState(auth);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'todos'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todoList: Todo[] = [];
      querySnapshot.forEach((doc) => {
        todoList.push({ id: doc.id, ...doc.data() } as Todo);
      });
      setTodos(todoList);
      setFilteredTodos(todoList);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSearch = (filters: FilterOptions) => {
    let filtered = todos;

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchLower) ||
          todo.description?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.priority) {
      filtered = filtered.filter((todo) => todo.priority === filters.priority);
    }

    if (filters.category) {
      filtered = filtered.filter((todo) => todo.category === filters.category);
    }

    if (filters.completed) {
      filtered = filtered.filter(
        (todo) => todo.completed === (filters.completed === 'completed')
      );
    }

    if (filters.dueDate) {
      const dueDate = new Date(filters.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((todo) => {
        if (!todo.dueDate) return false;
        const todoDueDate = new Date(todo.dueDate);
        todoDueDate.setHours(0, 0, 0, 0);
        return todoDueDate.getTime() === dueDate.getTime();
      });
    }

    setFilteredTodos(filtered);
  };

  return (
    <div>
      <AddTodo />
      <SearchAndFilter onSearch={handleSearch} />
      <ul className="space-y-2 mt-4">
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}