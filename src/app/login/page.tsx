"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";


export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();
  const { login } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };



const handleLogin = async () => {
  const res = await fetch("http://localhost:3001/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  
  const data = await res.json();

  if (data.access_token && data.user) {
    login(data.access_token, data.user);

    if (data.user.isAdmin) {
      router.push("/"); // 
    } else {
      router.push("/");
    }
  } else {
    alert("Email ou senha inválidos");
  }
};

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <Input name="email" placeholder="Email" onChange={handleChange} className="mb-2" />
      <Input name="password" placeholder="Senha" type="password" onChange={handleChange} className="mb-4" />
      <Button onClick={handleLogin} className="w-full">Entrar</Button>
    </div>
  );
}