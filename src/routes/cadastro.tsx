import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Cadastro de Cliente e Animal — Patas e Pelos" },
      { name: "description", content: "Cadastre clientes e seus animais na Clínica Veterinária Patas e Pelos." },
      { property: "og:title", content: "Cadastro — Patas e Pelos" },
      { property: "og:description", content: "Formulário de cadastro de clientes e animais." },
    ],
  }),
  component: CadastroPage,
});

function CadastroPage() {
  // Dados do cliente
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");

  // Dados do animal
  const [nomeAnimal, setNomeAnimal] = useState("");
  const [especie, setEspecie] = useState("");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [mensagem, setMensagem] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !cpf || !telefone || !nomeAnimal || !especie) {
      setMensagem("Por favor, preencha os campos obrigatórios (*).");
      return;
    }
    setMensagem("Cadastro realizado com sucesso! (demonstração)");
  }

  return (
    <div className="min-h-screen bg-[#eaf4f4] p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2c5f5d]">🐾 Patas e Pelos</h1>
            <p className="text-sm text-gray-600">Cadastro de Cliente e Animal</p>
          </div>
          <Link to="/" className="text-sm text-[#2c5f5d] hover:underline">
            ← Voltar ao login
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-300 rounded-lg shadow-md p-6 space-y-6"
        >
          {/* Cliente */}
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="text-[#2c5f5d] font-semibold px-2">Dados do Cliente</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo *
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                />
              </div>
            </div>
          </fieldset>

          {/* Animal */}
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="text-[#2c5f5d] font-semibold px-2">Dados do Animal</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do animal *
                </label>
                <input
                  type="text"
                  value={nomeAnimal}
                  onChange={(e) => setNomeAnimal(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Espécie *</label>
                <select
                  value={especie}
                  onChange={(e) => setEspecie(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d] bg-white"
                >
                  <option value="">Selecione...</option>
                  <option value="cao">Cão</option>
                  <option value="gato">Gato</option>
                  <option value="ave">Ave</option>
                  <option value="roedor">Roedor</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raça</label>
                <input
                  type="text"
                  value={raca}
                  onChange={(e) => setRaca(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idade (anos)
                </label>
                <input
                  type="number"
                  min="0"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      name="sexo"
                      value="macho"
                      checked={sexo === "macho"}
                      onChange={(e) => setSexo(e.target.value)}
                    />
                    Macho
                  </label>
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      name="sexo"
                      value="femea"
                      checked={sexo === "femea"}
                      onChange={(e) => setSexo(e.target.value)}
                    />
                    Fêmea
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={3}
                  placeholder="Alergias, doenças pré-existentes, etc."
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                />
              </div>
            </div>
          </fieldset>

          {mensagem && (
            <p
              className={`text-sm ${
                mensagem.includes("sucesso") ? "text-green-700" : "text-red-600"
              }`}
            >
              {mensagem}
            </p>
          )}

          <div className="flex gap-3 justify-end">
            <Link
              to="/"
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2c5f5d] text-white rounded font-medium hover:bg-[#234a48]"
            >
              Salvar Cadastro
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          * Campos obrigatórios
        </p>
      </div>
    </div>
  );
}