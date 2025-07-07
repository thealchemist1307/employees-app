import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Info, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [infoOpen, setInfoOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.email.trim() && formData.password.trim()) {
      try {
        await login({
          email: formData.email.trim(),
          password: formData.password
        });
        navigate("/dashboard", { state: { forceGrid: true } });
      } catch (error) {
        setError(error instanceof Error ? error.message : "Login failed");
      }
    }
  };

  const handleCopyCredentials = () => {
    setFormData(prev => ({
      ...prev,
      email: "admin@test.com",
      password: "admin123"
    }));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-primary relative text-foreground dark:text-black">
      <button
        className="absolute top-4 right-4 bg-background rounded-full shadow-lg p-3 hover:bg-accent transition-all z-20 border border-border animate-bounce"
        onClick={() => setInfoOpen(true)}
        aria-label="Show tester credentials"
      >
        <Info className="w-7 h-7 text-primary drop-shadow" />
      </button>
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="max-w-xs w-full rounded-2xl shadow-2xl border-2 border-blue-300 animate-fade-in bg-gradient-to-br from-blue-100 to-white">
          <DialogHeader className="flex flex-col items-center gap-2">
            <span className="inline-block animate-spin-slow">
              <Info className="w-10 h-10 text-blue-600 drop-shadow-lg" />
            </span>
            <DialogTitle className="text-2xl font-extrabold text-blue-800 tracking-wide mt-2 mb-1">Test Login</DialogTitle>
            <p className="text-blue-700 text-center text-base font-medium mb-2">Use these credentials to log in as a tester:</p>
            <button
              type="button"
              className={`bg-white/80 rounded-lg p-4 shadow-inner border border-blue-200 flex flex-col gap-2 transition-all duration-200 hover:bg-blue-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 relative group ${copied ? 'ring-2 ring-green-400' : ''}`}
              onClick={handleCopyCredentials}
              tabIndex={0}
              aria-label="Copy credentials to login form"
            >
              <div className="flex items-center gap-2 mt-5">
                <span className="font-semibold text-blue-900">Email:</span>
                <span className="font-mono text-blue-700">admin@test.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-900">Password:</span>
                <span className="font-mono text-blue-700">admin123</span>
              </div>
              <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-green-600 text-xs font-bold transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`} style={{ marginTop: 10 }}>Copied!</span>
              <span className="absolute right-2 top-2 flex items-center gap-1 text-xs text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity" style={{ top: 12 }}>
                <Copy className="w-4 h-4 mr-1" /> Click to copy
              </span>
            </button>
            <span className="text-xs text-blue-400 mt-2 italic">Happy testing! 🚀</span>
          </DialogHeader>
          <DialogClose asChild>
            <Button variant="outline" className="w-full mt-4 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 font-semibold shadow">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <div className="w-96 space-y-6 rounded-lg bg-slate-800 p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-300 text-sm">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
              required
            />
          </div>
          
                  <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 hover:shadow-md transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
        
        {error && (
          <div className="text-center">
            <p className="text-xs text-red-400">
              {error}
            </p>
          </div>
        )}
        </form>
        
        <div className="text-center">
          <p className="text-xs text-slate-400">
            Use your registered email and password to sign in
          </p>
        </div>
      </div>
    </div>
  );
} 