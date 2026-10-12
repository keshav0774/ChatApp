
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import api from "../api.js";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/user/login", form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-dvh items-center justify-center px-5 py-10"
      style={{
        background:
          "linear-gradient(145deg, #fffafb 0%, #f8f2ff 50%, #e8dfff 100%)",
      }}
    >
      <div className="w-full max-w-[410px]">
        <Link to="/" className="mb-12 flex items-center justify-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#29252e] text-white">
            <Sparkles size={20} />
          </span>
          <span className="text-lg font-semibold text-[#29252e]">
            ChatApp
          </span>
        </Link>

        <div className="mb-9 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#29252e]">
            Welcome back
          </h1>
          <p className="mt-3 text-sm text-[#8b8393]">
            Sign in to continue your conversations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-medium text-[#514958]">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full rounded-2xl border border-[#e5ddeb] bg-white/80 px-5 py-4 text-sm outline-none transition focus:border-[#9b89b5]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-[#514958]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-2xl border border-[#e5ddeb] bg-white/80 px-5 py-4 pr-12 text-sm outline-none transition focus:border-[#9b89b5]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#92889c]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-center text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#29252e] py-4 text-sm font-medium text-white transition hover:bg-[#49414f] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight size={17} />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#8b8393]">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-[#29252e] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
