import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Login — Clínica Veterinária Patas e Pelos" },
      { name: "description", content: "Acesse o sistema da Clínica Veterinária Patas e Pelos." },
      { property: "og:title", content: "Login — Patas e Pelos" },
      { property: "og:description", content: "Sistema de gestão da clínica veterinária." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !senha) {
      setErro("Preencha email e senha.");
      return;
    }
    setErro("");
    navigate({ to: "/painel" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaf4f4] p-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🐾</div>
          <h1 className="text-2xl font-bold text-[#2c5f5d]">Patas e Pelos</h1>
          <p className="text-sm text-gray-600">Clínica Veterinária — Sistema de Gestão</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@clinica.com"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
            />
          </div>

          {erro && <p className="text-sm text-red-600">{erro}</p>}

          <button
            type="submit"
            className="w-full bg-[#2c5f5d] text-white py-2 rounded font-medium hover:bg-[#234a48] transition-colors"
          >
            Entrar
          </button>

          <div className="text-center text-sm text-gray-600 pt-2">
            <a href="#" className="text-[#2c5f5d] hover:underline">Esqueci minha senha</a>
          </div>
        </form>
      </div>
    </div>
  );
}
