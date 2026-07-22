import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { salvarCadastro } from "@/lib/cadastros-store";

const estadoInicialCliente = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  endereco: "",
};

const estadoInicialAnimal = {
  nome: "",
  especie: "",
  raca: "",
  idade: "",
  sexo: "",
  observacoes: "",
};

export const Route = createFileRoute("/painel/cadastro")({
  head: () => ({
    meta: [{ title: "Cadastro de cliente e animal — Patas e Pelos" }],
  }),
  component: CadastroPage,
});

function CadastroPage() {
  const [dadosCliente, setDadosCliente] = useState(estadoInicialCliente);
  const [dadosAnimal, setDadosAnimal] = useState(estadoInicialAnimal);
  const [mensagemStatus, setMensagemStatus] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!dadosCliente.nome || !dadosCliente.cpf || !dadosCliente.telefone || !dadosAnimal.nome || !dadosAnimal.especie) {
      setMensagemStatus("Por favor, preencha os campos obrigatórios (*).");
      return;
    }

    const confirmado = window.confirm(
      "Confirme a criação deste cadastro.\n\nRevise os dados do cliente e do animal antes de salvar.",
    );
    if (!confirmado) {
      setMensagemStatus("Cadastro cancelado.");
      return;
    }

    salvarCadastro({
      nome: dadosCliente.nome,
      cpf: dadosCliente.cpf,
      telefone: dadosCliente.telefone,
      email: dadosCliente.email,
      endereco: dadosCliente.endereco,
      animal: {
        nome: dadosAnimal.nome,
        especie: dadosAnimal.especie,
        raca: dadosAnimal.raca,
        idade: dadosAnimal.idade,
        sexo: dadosAnimal.sexo,
        observacoes: dadosAnimal.observacoes,
      },
    });

    handleLimpar();
    setMensagemStatus("Cadastro realizado com sucesso!");
  }

  function handleLimpar() {
    setDadosCliente(estadoInicialCliente);
    setDadosAnimal(estadoInicialAnimal);
    setMensagemStatus("");
  }

  function atualizarCliente(chave: keyof typeof estadoInicialCliente, valor: string) {
    setDadosCliente((prev) => ({ ...prev, [chave]: valor }));
  }

  function atualizarAnimal(chave: keyof typeof estadoInicialAnimal, valor: string) {
    setDadosAnimal((prev) => ({ ...prev, [chave]: valor }));
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-[#2c5f5d] mb-1">Cadastrar novo cliente</h1>
      <p className="text-sm text-gray-600 mb-2">
        Preencha os dados do tutor e do animal para registrá-los no sistema.
      </p>
      <p className="text-xs text-gray-600 mb-4">
        Campos marcados com <span className="text-red-600 font-semibold">*</span> são <strong>obrigatórios</strong>. Os demais são <em>opcionais</em>.
      </p>
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
        Antes de salvar, confira todos os dados do tutor e do animal. A confirmação será solicitada antes de criar o cadastro.
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 rounded-lg shadow-sm p-6 space-y-6"
      >
        <fieldset className="border border-gray-300 rounded p-4">
          <legend className="text-[#2c5f5d] font-semibold px-2">Dados do cliente</legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={dadosCliente.nome}
                onChange={(e) => atualizarCliente("nome", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={dadosCliente.cpf}
                onChange={(e) => atualizarCliente("cpf", e.target.value)}
                placeholder="000.000.000-00"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={dadosCliente.telefone}
                onChange={(e) => atualizarCliente("telefone", e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input
                type="email"
                value={dadosCliente.email}
                onChange={(e) => atualizarCliente("email", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input
                type="text"
                value={dadosCliente.endereco}
                onChange={(e) => atualizarCliente("endereco", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 rounded p-4">
          <legend className="text-[#2c5f5d] font-semibold px-2">Dados do animal</legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do animal <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={dadosAnimal.nome}
                onChange={(e) => atualizarAnimal("nome", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Espécie <span className="text-red-600">*</span>
              </label>
              <select
                value={dadosAnimal.especie}
                onChange={(e) => atualizarAnimal("especie", e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raça <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input
                type="text"
                value={dadosAnimal.raca}
                onChange={(e) => atualizarAnimal("raca", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idade (anos) <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input
                type="number"
                min="0"
                value={dadosAnimal.idade}
                onChange={(e) => atualizarAnimal("idade", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="radio"
                    name="sexo"
                    value="macho"
                    checked={dadosAnimal.sexo === "macho"}
                    onChange={(e) => atualizarAnimal("sexo", e.target.value)}
                  />
                  Macho
                </label>
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="radio"
                    name="sexo"
                    value="femea"
                    checked={dadosAnimal.sexo === "femea"}
                    onChange={(e) => atualizarAnimal("sexo", e.target.value)}
                  />
                  Fêmea
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <textarea
                value={dadosAnimal.observacoes}
                onChange={(e) => atualizarAnimal("observacoes", e.target.value)}
                rows={3}
                placeholder="Alergias, doenças pré-existentes, etc."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
              />
            </div>
          </div>
        </fieldset>

        {mensagemStatus && (
          <p className={`text-sm ${mensagemStatus.includes("sucesso") ? "text-green-700" : "text-red-600"}`}>
            {mensagemStatus}
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleLimpar}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Limpar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#2c5f5d] text-white rounded font-medium hover:bg-[#234a48]"
          >
            Salvar cadastro
          </button>
        </div>
      </form>

      <p className="text-xs text-gray-500 mt-3">
        <span className="text-red-600">*</span> Campos obrigatórios
      </p>
    </div>
  );
}