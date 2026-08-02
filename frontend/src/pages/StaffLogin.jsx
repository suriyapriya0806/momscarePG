import { Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { getDashboardPathForRole, ROLES } from "../routes/roleRoutes";

const StaffLogin = ({ portal }) => {
  const isAdmin = portal === "admin";
  const expectedRole = isAdmin ? ROLES.ADMIN : ROLES.WARDEN;
  const [form, setForm] = useState({ loginId: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const user = await login(form.loginId, form.password, portal);
      if (user.role !== (isAdmin ? "Admin" : "Warden")) {
        throw new Error("This account is not permitted to use the selected portal.");
      }
      navigate(getDashboardPathForRole(expectedRole), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to sign in.");
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-65px)] place-items-center bg-paper/70 px-4 py-10">
      <Card className="w-full max-w-md hover:translate-y-0">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand/10 text-brandDark"><ShieldCheck className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">Mom's Care PG House</p>
            <h1 className="mt-1 text-2xl font-bold text-ink">{isAdmin ? "Admin" : "Warden"} Sign In</h1>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {isAdmin ? "Use an administrator account to manage all branches." : "Use your assigned warden account to manage your branch."}
        </p>
        {error && <p className="mt-4 rounded-xl bg-paper p-3 text-sm font-semibold text-brandDark">{error}</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input
            label={isAdmin ? "Admin email" : "Warden ID or email"}
            type={isAdmin ? "email" : "text"}
            required
            placeholder={isAdmin ? "admin@example.com" : "WD001"}
            value={form.loginId}
            onChange={(event) => setForm({ ...form, loginId: event.target.value })}
          />
          <Input label="Password" type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <Button className="w-full" type="submit"><Mail className="h-4 w-4" /> Sign in to {isAdmin ? "Admin" : "Warden"} Dashboard</Button>
        </form>
        <Link to="/login" className="mt-5 block text-center text-sm font-bold text-brand hover:text-brandDark">Back to guest sign in</Link>
      </Card>
    </main>
  );
};

export default StaffLogin;
