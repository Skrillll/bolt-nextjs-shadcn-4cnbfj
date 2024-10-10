'use client';

import { useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

interface CollaborationModalProps {
  todoId: string;
  collaborators: string[];
}

export default function CollaborationModal({ todoId, collaborators }: CollaborationModalProps) {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const addCollaborator = async () => {
    try {
      await updateDoc(doc(db, 'todos', todoId), {
        collaborators: arrayUnion(email),
      });
      setEmail('');
      toast({
        title: 'Success',
        description: 'Collaborator added successfully',
      });
    } catch (error) {
      console.error('Error adding collaborator:', error);
      toast({
        title: 'Error',
        description: 'Failed to add collaborator',
        variant: 'destructive',
      });
    }
  };

  const removeCollaborator = async (collaboratorEmail: string) => {
    try {
      await updateDoc(doc(db, 'todos', todoId), {
        collaborators: arrayRemove(collaboratorEmail),
      });
      toast({
        title: 'Success',
        description: 'Collaborator removed successfully',
      });
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove collaborator',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Collaborators</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Collaborators</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Collaborator's email"
            />
            <Button onClick={addCollaborator}>Add</Button>
          </div>
          <ul className="space-y-2">
            {collaborators.map((collaborator) => (
              <li key={collaborator} className="flex justify-between items-center">
                <span>{collaborator}</span>
                <Button onClick={() => removeCollaborator(collaborator)} variant="destructive" size="sm">
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}