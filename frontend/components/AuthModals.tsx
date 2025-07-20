"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { Eye, EyeOff } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaTwitter } from "react-icons/fa"
import { SiKaggle } from "react-icons/si"
import { signIn } from "next-auth/react" // If using NextAuth.js, otherwise comment out

export function LoginModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [resetOpen, setResetOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signUpOpen, setSignUpOpen] = useState(false)
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      await login(email, password);
      setLoading(false);
      setSuccess("Login successful!");
      setTimeout(() => setSuccess(""), 2000);
      setTimeout(() => onOpenChange(false), 1200);
    } catch (err: any) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>Sign in to your account</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => { onOpenChange(false); setResetOpen(true); }}
              >
                Forgot password?
              </button>
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full">{loading ? "Logging in..." : "Login"}</Button>
            </DialogFooter>
          </form>
          {success && <div className="text-green-600 text-sm text-center mt-2">{success}</div>}
          <div className="mt-4 text-center text-sm">
            New here?{' '}
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => { onOpenChange(false); setSignUpOpen(true); }}
            >
              Create an account
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <ResetPasswordModal open={resetOpen} onOpenChange={setResetOpen} />
      <SignUpModal open={signUpOpen} onOpenChange={setSignUpOpen} />
    </>
  )
}

export function SignUpModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const { signup, signInWithProvider } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      await signup(email, password, name, remember, avatarUrl);
      localStorage.setItem("auth:user", JSON.stringify({ name, email, avatarUrl }));
      setLoading(false);
      setSuccess("Sign up successful!");
      setTimeout(() => setSuccess(""), 2000);
      setTimeout(() => onOpenChange(false), 1200);
    } catch (err: any) {
      setError(err.message || "Sign up failed");
      setLoading(false);
    }
  }

  const handleOAuth = (provider: string) => {
    signInWithProvider(provider);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
          <DialogDescription>Create a new account</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSignUp} className="space-y-4">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              Upload Avatar
            </Button>
            {avatarUrl && <img src={avatarUrl} alt="avatar preview" className="w-8 h-8 rounded-full" />}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="remember-me"
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border border-input"
            />
            <label htmlFor="remember-me" className="text-sm select-none cursor-pointer">Remember me</label>
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Signing up..." : "Sign Up"}</Button>
          </DialogFooter>
        </form>
        {success && <div className="text-green-600 text-sm text-center mt-2">{success}</div>}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="mx-2 text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="w-full">
          <span className="block text-xs font-semibold text-muted-foreground mb-2 text-left">Sign up with</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-0 w-full justify-items-center">
          <div className="flex flex-col items-center">
            <button type="button" onClick={() => handleOAuth("Google")}
              className="hover:scale-110 transition-transform">
              <FcGoogle className="w-6 h-6" />
            </button>
            <span className="text-xs mt-1 text-muted-foreground">Google</span>
          </div>
          <div className="flex flex-col items-center">
            <button type="button" onClick={() => handleOAuth("GitHub")}
              className="hover:scale-110 transition-transform">
              <FaGithub className="w-6 h-6" />
            </button>
            <span className="text-xs mt-1 text-muted-foreground">GitHub</span>
          </div>
          <div className="flex flex-col items-center">
            <button type="button" onClick={() => handleOAuth("Twitter")}
              className="hover:scale-110 transition-transform">
              <FaTwitter className="w-6 h-6 text-sky-500" />
            </button>
            <span className="text-xs mt-1 text-muted-foreground">Twitter</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ResetPasswordModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    // TODO: Replace with real API call
    await new Promise(res => setTimeout(res, 1000))
    setSent(true)
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>Enter your email to receive a password reset link.</DialogDescription>
        </DialogHeader>
        {sent ? (
          <div className="text-green-600 py-6 text-center">If an account exists for {email}, a reset link has been sent.</div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            {error && <div className="text-destructive text-sm">{error}</div>}
            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full">{loading ? "Sending..." : "Send reset link"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 