import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button, Card, Input } from "../components/ui";

export default function Register() {
  const { register, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [token, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Name must be at least 2 characters";
    if (!form.email.includes("@")) nextErrors.email = "Enter a valid email";
    if (form.password.length < 8) nextErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = "Passwords must match";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate("/dashboard");
    } catch (err) {
      setErrors({ form: err.response?.data?.message || "Registration failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-black text-slate-950">Create TaskFlow Account</h1>
        <form onSubmit={submit} className="mt-8 space-y-4">
          {errors.form ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{errors.form}</p> : null}
          <Input placeholder="Name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input type="email" placeholder="Email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input type="password" placeholder="Password" value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Input type="password" placeholder="Confirm password" value={form.confirmPassword} error={errors.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          <Button className="w-full" type="submit" disabled={saving}>{saving ? "Creating..." : "Register"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already registered? <Link className="font-bold text-primary" to="/login">Login</Link>
        </p>
      </Card>
    </main>
  );
}
