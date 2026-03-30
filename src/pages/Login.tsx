import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Ambient glows */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse-glow delay-1000" />

      <div className="relative z-10 w-full max-w-md px-6 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <img src="/nexora-ai-logo.png" alt="Nexora AI" className="w-20 h-20 mx-auto mb-6 object-contain" />
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Nexora <span className="text-gradient">AI</span>
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            Next-Gen Intelligence for Every Student
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-strong rounded-2xl p-8 glow-primary">
          <h2 className="text-xl font-semibold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-6">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground/80 mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="argha@eduai.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/80 mb-1.5 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-border bg-secondary accent-primary" />
                Remember me
              </label>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
            </div>

            <Button
              type="submit"
              className="w-full h-11 gradient-primary text-foreground font-semibold hover:opacity-90 transition-opacity glow-primary"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <a href="#" className="text-primary hover:text-primary/80 transition-colors">Contact Admin</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
