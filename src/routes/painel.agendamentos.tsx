import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/painel/agendamentos")({
  head: () => ({
    meta: [{ title: "Agendamentos — Patas e Pelos" }],
  }),
  component: AgendamentosPage,
});

type Agendamento = {
  id: number;
  cliente: string;
  animal: string;
  servico: string;
  data: string;
  hora: string;
  status: "Agendado" | "Concluído" | "Cancelado";
};

const exemplos: Agendamento[] = [
  { id: 1, cliente: "Maria Silva", animal: "Rex", servico: "Consulta", data: "2026-06-26", hora: "09:00", status: "Agendado" },
  { id: 2, cliente: "João Souza", animal: "Mia", servico: "Vacinação", data: "2026-06-26", hora: "10:30", status: "Agendado" },
  { id: 3, cliente: "Ana Costa", animal: "Toby", servico: "Banho e Tosa", data: "2026-06-27", hora: "14:00", status: "Concluído" },
];

function AgendamentosPage() {
  const [lista, setLista] = useState<Agendamento[]>(exemplos);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [cliente, setCliente] = useState("");
  const [animal, setAnimal] = useState("");
  const [servico, setServico] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cliente || !animal || !servico || !data || !hora) {
      setMensagem("Preencha todos os campos obrigatórios (*).");
      return;
    }
    const novo: Agendamento = {
      id: Date.now(),
      cliente, animal, servico, data, hora,
      status: "Agendado",
    };
    setLista([novo, ...lista]);
    setCliente(""); setAnimal(""); setServico(""); setData(""); setHora("");
    setMensagem("Agendamento criado com sucesso! (demonstração)");
    setMostrarForm(false);
  }

  function cancelar(id: number) {
    setLista((l) => l.map((a) => (a.id === id ? { ...a, status: "Cancelado" } : a)));
  }

  function corStatus(s: Agendamento["status"]) {
    if (s === "Agendado") return "bg-blue-100 text-blue-800";
    if (s === "Concluído") return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-700";
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2c5f5d] mb-1">Agendamentos</h1>
          <p className="text-sm text-gray-600">
            Gerencie as consultas e serviços agendados na clínica.
          </p>
        </div>
        <button
          onClick={() => { setMostrarForm((v) => !v); setMensagem(""); }}
          className="px-4 py-2 bg-[#2c5f5d] text-white rounded font-medium hover:bg-[#234a48]"
        >
          {mostrarForm ? "Fechar" : "+ Novo Agendamento"}
        </button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-300 rounded-lg shadow-sm p-6 mb-6 space-y-4"
        >
          <h2 className="text-[#2c5f5d] font-semibold">Novo Agendamento</h2>
          <p className="text-xs text-gray-600">
            Campos marcados com <span className="text-red-600">*</span> são obrigatórios.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente <span className="text-red-600">*</span></label>
              <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Animal <span className="text-red-600">*</span></label>
              <input type="text" value={animal} onChange={(e) => setAnimal(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Serviço <span className="text-red-600">*</span></label>
              <select value={servico} onChange={(e) => setServico(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:border-[#2c5f5d]">
                <option value="">Selecione...</option>
                <option value="Consulta">Consulta</option>
                <option value="Vacinação">Vacinação</option>
                <option value="Banho e Tosa">Banho e Tosa</option>
                <option value="Exame">Exame</option>
                <option value="Cirurgia">Cirurgia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data <span className="text-red-600">*</span></label>
              <input type="date" value={data} onChange={(e) => setData(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora <span className="text-red-600">*</span></label>
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]" />
            </div>
          </div>

          {mensagem && (
            <p className={`text-sm ${mensagem.includes("sucesso") ? "text-green-700" : "text-red-600"}`}>
              {mensagem}
            </p>
          )}

          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-[#2c5f5d] text-white rounded font-medium hover:bg-[#234a48]">
              Salvar Agendamento
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#eaf4f4] text-[#2c5f5d]">
            <tr>
              <th className="text-left px-4 py-2">Data</th>
              <th className="text-left px-4 py-2">Hora</th>
              <th className="text-left px-4 py-2">Cliente</th>
              <th className="text-left px-4 py-2">Animal</th>
              <th className="text-left px-4 py-2">Serviço</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-right px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-6">
                  Nenhum agendamento cadastrado.
                </td>
              </tr>
            )}
            {lista.map((a) => (
              <tr key={a.id} className="border-t border-gray-200">
                <td className="px-4 py-2">{a.data.split("-").reverse().join("/")}</td>
                <td className="px-4 py-2">{a.hora}</td>
                <td className="px-4 py-2">{a.cliente}</td>
                <td className="px-4 py-2">{a.animal}</td>
                <td className="px-4 py-2">{a.servico}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${corStatus(a.status)}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  {a.status === "Agendado" && (
                    <button
                      onClick={() => cancelar(a.id)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}