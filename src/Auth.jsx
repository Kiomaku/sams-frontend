import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Input, Tabs, Tab, Link } from "@heroui/react";
import { Eye, EyeOff } from "./icons";
import { api } from "./api";
import { APP_NAME } from "./config";

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailBad = email && !/^\S+@\S+\.\S+$/.test(email);
  const passBad = mode === "register" && password && password.length < 8;

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (emailBad || passBad || !email || !password) return setError("Check your email and password (8+ characters).");
    setLoading(true);
    try {
      const d = await (mode === "login" ? api.login : api.register)({ email, password });
      if (mode === "register") await api.login({ email, password });
      onAuth(d.user);
    } catch (err) {
      setError(err.status === 409 ? "That email is already registered." : err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md" shadow="lg">
        <CardHeader className="flex flex-col gap-1 pt-8">
          <div className="flex items-center gap-2 text-3xl font-bold"><img src="/logo.webp" alt="" className="h-12 w-12" />{APP_NAME}</div>
          <p className="text-default-500 text-sm">Your AI chat companion</p>
        </CardHeader>
        <CardBody className="pb-8">
          <Tabs fullWidth selectedKey={mode} onSelectionChange={(k) => { setMode(k); setError(""); }} className="mb-4">
            <Tab key="login" title="Log in" /><Tab key="register" title="Sign up" />
          </Tabs>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Input label="Email" type="email" value={email} onValueChange={setEmail} isInvalid={!!emailBad} errorMessage="Enter a valid email" autoComplete="email" />
            <Input label="Password" type={show ? "text" : "password"} value={password} onValueChange={setPassword}
              isInvalid={!!passBad} errorMessage="At least 8 characters" autoComplete={mode === "login" ? "current-password" : "new-password"}
              endContent={<button type="button" onClick={() => setShow(!show)} className="text-default-400">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>} />
            {error && <p className="text-danger text-sm" role="alert">{error}</p>}
            <Button type="submit" className="bg-foreground text-background" isLoading={loading} size="lg">{mode === "login" ? "Log in" : "Create account"}</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
