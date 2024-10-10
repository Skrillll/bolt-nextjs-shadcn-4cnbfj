'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db, analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [tasksByCategory, setTasksByCategory] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const q = query(collection(db, 'todos'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        let completed = 0;
        let pending = 0;
        const categories: { [key: string]: number } = {};

        querySnapshot.forEach((doc) => {
          const todo = doc.data();
          if (todo.completed) {
            completed++;
          } else {
            pending++;
          }

          if (todo.category) {
            categories[todo.category] = (categories[todo.category] || 0) + 1;
          }
        });

        setCompletedTasks(completed);
        setPendingTasks(pending);
        setTasksByCategory(
          Object.entries(categories).map(([name, count]) => ({ name, count }))
        );

        // Log analytics event
        if (analytics) {
          logEvent(analytics, 'view_dashboard', {
            user_id: user.uid,
            completed_tasks: completed,
            pending_tasks: pending,
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks} / {completedTasks + pendingTasks}</div>
            <div className="text-sm text-muted-foreground">Completed Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <div className="text-sm text-muted-foreground">Tasks Remaining</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tasksByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}