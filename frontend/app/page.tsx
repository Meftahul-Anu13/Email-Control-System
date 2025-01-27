import EmailDashboard from './components/EmailDashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Email Control System</h1>
        <EmailDashboard />
      </div>
    </main>
  );
}