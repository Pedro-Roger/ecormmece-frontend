"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Criar Conta</h1>
      <Input name="name" placeholder="Nome" onChange={handleChange} className="mb-2" />
      <Input name="email" placeholder="Email" onChange={handleChange} className="mb-2" />
      <Input name="password" placeholder="Senha" type="password" onChange={handleChange} className="mb-4" />
      <Button onClick={handleSubmit} className="w-full">Cadastrar</Button>
    </div>
  );
}
