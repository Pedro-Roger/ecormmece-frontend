"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.getTotal());

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cep: "",
    numero: "",
    endereco: "",
  });

  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  function formatPrice(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  async function buscarEnderecoPorCep(cep: string) {
    setCepError(null);
    if (cep.length !== 8) {
      setCepError("CEP deve ter 8 dígitos numéricos");
      setFormData((f) => ({ ...f, endereco: "" }));
      return;
    }

    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) {
        setCepError("CEP não encontrado");
        setFormData((f) => ({ ...f, endereco: "" }));
      } else {
        const enderecoFormatado = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        setFormData((f) => ({ ...f, endereco: enderecoFormatado }));
      }
    } catch (error) {
      setCepError("Erro ao buscar CEP");
      setFormData((f) => ({ ...f, endereco: "" }));
    } finally {
      setLoadingCep(false);
    }
  }

  function validate() {
    const newErrors: typeof errors = {};

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      newErrors.email = "Email inválido";

    if (!formData.cep.trim()) newErrors.cep = "CEP é obrigatório";
    else if (!/^\d{8}$/.test(formData.cep)) newErrors.cep = "CEP deve conter 8 dígitos";

    if (!formData.numero.trim()) newErrors.numero = "Número é obrigatório";

    if (!formData.endereco.trim()) newErrors.endereco = "Endereço é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    if (name === "cep") {
      const numeros = value.replace(/\D/g, "");
      setFormData((f) => ({ ...f, cep: numeros }));

      if (numeros.length === 8) {
        buscarEnderecoPorCep(numeros);
      } else {
        setFormData((f) => ({ ...f, endereco: "" }));
        setCepError(null);
      }
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">Pedido Finalizado!</h1>
        <p className="mb-6">Obrigado pela sua compra, {formData.nome}! Seu pedido foi recebido com sucesso.</p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Voltar à loja
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Seu carrinho está vazio</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Voltar à loja
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Resumo do pedido</h2>
        <div className="border rounded p-4 space-y-4 bg-white shadow">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">Quantidade: {quantity}</p>
              </div>
              <p className="font-semibold">{formatPrice(product.price * quantity)}</p>
            </div>
          ))}

          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Dados para entrega</h2>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
          <div>
            <label htmlFor="nome" className="block font-medium mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded ${
                errors.nome ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Seu nome"
              required
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="exemplo@exemplo.com"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="cep" className="block font-medium mb-1">
              CEP
            </label>
            <input
              type="text"
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              maxLength={8}
              className={`w-full border px-3 py-2 rounded ${
                errors.cep || cepError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Apenas números, ex: 12345678"
              required
            />
            {(errors.cep || cepError) && (
              <p className="text-red-500 text-sm mt-1">{errors.cep || cepError}</p>
            )}
            {loadingCep && <p className="text-gray-500 text-sm mt-1">Buscando endereço...</p>}
          </div>

          <div>
            <label htmlFor="numero" className="block font-medium mb-1">
              Número
            </label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded ${
                errors.numero ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Número da residência"
              required
            />
            {errors.numero && <p className="text-red-500 text-sm mt-1">{errors.numero}</p>}
          </div>

          <div>
            <label htmlFor="endereco" className="block font-medium mb-1">
              Endereço de entrega
            </label>
            <textarea
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded ${
                errors.endereco ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Rua, bairro, cidade, estado"
              rows={3}
              required
            />
            {errors.endereco && (
              <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            Finalizar Pedido
          </button>
        </form>
      </section>
    </div>
  );
}
