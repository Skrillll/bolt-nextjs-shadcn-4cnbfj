import { Suspense } from 'react';
import AuthCheck from '@/components/AuthCheck';
import TodoList from '@/components/TodoList';
import AISuggestions from '@/components/AISuggestions';
import Dashboard from '@/components/Dashboard';
import Loading from '@/components/Loading';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Next.js Firebase Todo App</h1>
      <AuthCheck>
        <Suspense fallback={<Loading />}>
          <Dashboard />
          <TodoList />
          <AISuggestions />
        </Suspense>
      </AuthCheck>
    </main>
  );
}