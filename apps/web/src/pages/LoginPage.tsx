import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.username.trim() && formData.password.trim()) {
      login(formData.username.trim());
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="w-96 space-y-6 rounded-lg bg-slate-800 p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-300 text-sm">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-white">
              Username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
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
          className="w-full bg-blue-600 hover:bg-blue-700 hover:shadow-md transition-all duration-200"
        >
          Sign In
        </Button>
        </form>
        
        <div className="text-center">
          <p className="text-xs text-slate-400">
            Demo: Enter any username and password to continue
          </p>
        </div>
      </div>
    </div>
  );
} 