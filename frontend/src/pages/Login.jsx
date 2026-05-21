import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button, Card, Input } from "../components/ui";

export default function Login() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [token, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.email.includes("@")) nextErrors.email = "Enter a valid email";
    if (!form.password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setErrors({ form: err.response?.data?.message || "Login failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-black text-slate-950">TaskFlow</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to manage team projects.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          {errors.form ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{errors.form}</p> : null}
          <Input type="email" placeholder="Email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input type="password" placeholder="Password" value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button className="w-full" type="submit" disabled={saving}>{saving ? "Signing in..." : "Login"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          No account? <Link className="font-bold text-primary" to="/register">Register</Link>
        </p>
      </Card>
    </main>
  );
}
