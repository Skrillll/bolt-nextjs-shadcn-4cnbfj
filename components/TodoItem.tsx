'use client';

import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Todo } from '@/types/todo';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const { toast } = useToast();

  const toggleComplete = async () => {
    try {
      await updateDoc(doc(db, 'todos', todo.id), {
        completed: !todo.completed,
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      toast({
        title: 'Error',
        description: 'Failed to update todo',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      try {
        await updateDoc(doc(db, 'todos', todo.id), {
          title: editedTitle,
        });
        setIsEditing(false);
        toast({
          title: 'Success',
          description: 'Todo updated successfully',
        });
      } catch (error) {
        console.error('Error updating todo:', error);
        toast({
          title: 'Error',
          description: 'Failed to update todo',
          variant: 'destructive',
        });
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'todos', todo.id));
      toast({
        title: 'Success',
        description: 'Todo deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete todo',
        variant: 'destructive',
      });
    }
  };

  return (
    <li className="flex items-center space-x-2">
      <Checkbox checked={todo.completed} onCheckedChange={toggleComplete} />
      {isEditing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="flex-grow p-1 border rounded"
        />
      ) : (
        <span className={`flex-grow ${todo.completed ? 'line-through' : ''}`}>
          {todo.title}
        </span>
      )}
      <Button onClick={handleEdit}>{isEditing ? 'Save' : 'Edit'}</Button>
      <Button onClick={handleDelete} variant="destructive">
        Delete
      </Button>
    </li>
  );
}