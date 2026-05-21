import { Link } from "react-router-dom";
import { Button, Card } from "../components/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md p-8 text-center">
        <p className="text-sm font-black text-primary">404</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Page not found</h1>
        <p className="mt-3 text-sm text-slate-500">The page you opened does not exist in TaskFlow.</p>
        <Link to="/dashboard"><Button className="mt-6">Back to dashboard</Button></Link>
      </Card>
    </main>
  );
}
