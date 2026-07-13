import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/painel/agendamentos")({
  head: () => ({
    meta: [{ title: "Agendamentos — Patas e Pelos" }],
  }),
  component: AgendamentosPage,
});

type Urgencia = "Nenhuma" | "Baixa" | "Média" | "Alta" | "Crítica";

type Agendamento = {
  id: number;
  cliente: string;
  animal: string;
  servico: string;
  data: string;
  hora: string;
  urgencia: Urgencia;
  status: "Agendado" | "Concluído" | "Cancelado";
};

const NIVEIS_URGENCIA: Urgencia[] = ["Nenhuma", "Baixa", "Média", "Alta", "Crítica"];

function normalizarTexto(valor: string) {
  return valor.trim().toLowerCase();
}

const PRECOS_POR_SERVICO: Record<string, number> = {
  Consulta: 180,
  Vacinação: 90,
  "Banho e Tosa": 70,
  Exame: 240,
  Cirurgia: 850,
};

const ACRESCIMO_NOTURNO = 200;

function isHorarioNoturno(hora: string) {
  const [horas, minutos] = hora.split(":").map(Number);
  const totalMinutos = horas * 60 + minutos;
  return totalMinutos <= 5 * 60 + 59;
}

function calcularValorServico(servico: string, hora: string) {
  const servicoNormalizado = normalizarTexto(servico);
  const precoBase = Object.entries(PRECOS_POR_SERVICO).find(
    ([nome]) => normalizarTexto(nome) === servicoNormalizado,
  )?.[1] ?? 0;

  if (
    (servicoNormalizado === "consulta" || servicoNormalizado === "exame" || servicoNormalizado === "cirurgia") &&
    isHorarioNoturno(hora)
  ) {
    return precoBase + ACRESCIMO_NOTURNO;
  }

  return precoBase;
}

function isServicoBloqueadoNaMadrugada(servico: string, hora: string) {
  const servicoNormalizado = normalizarTexto(servico);
  return isHorarioNoturno(hora) && (servicoNormalizado === "vacinação" || servicoNormalizado === "banho e tosa");
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function encontrarConflito(
  lista: Agendamento[],
  candidato: Pick<Agendamento, "data" | "hora">,
): Agendamento | null {
  return (
    lista.find((agendamento) => {
      if (agendamento.status !== "Agendado") return false;
      return agendamento.data === candidato.data && agendamento.hora === candidato.hora;
    }) ?? null
  );
}

const exemplos: Agendamento[] = [
  { id: 1, cliente: "Maria Silva", animal: "Rex", servico: "Consulta", data: "2026-06-26", hora: "09:00", urgencia: "Baixa", status: "Agendado" },
  { id: 2, cliente: "João Souza", animal: "Mia", servico: "Vacinação", data: "2026-06-26", hora: "10:30", urgencia: "Nenhuma", status: "Agendado" },
  { id: 3, cliente: "Ana Costa", animal: "Toby", servico: "Banho e Tosa", data: "2026-06-27", hora: "14:00", urgencia: "Nenhuma", status: "Concluído" },
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
  const [urgencia, setUrgencia] = useState<Urgencia>("Nenhuma");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cliente || !animal || !servico || !data || !hora) {
      setMensagem("Preencha todos os campos obrigatórios (*).");
      return;
    }

    if (isServicoBloqueadoNaMadrugada(servico, hora)) {
      setMensagem("Não é possível agendar Banho e Tosa ou Vacinação entre 00h e 05:59 da manhã.");
      return;
    }

    const conflito = encontrarConflito(lista, { data, hora });
    if (conflito) {
      const dataFormatada = conflito.data.split("-").reverse().join("/");
      setMensagem(
        `Conflito de agendamento: já existe um horário ativo para ${conflito.animal} do tutor ${conflito.cliente} em ${dataFormatada} às ${conflito.hora}.`,
      );
      return;
    }

    const novo: Agendamento = {
      id: Date.now(),
      cliente, animal, servico, data, hora, urgencia,
      status: "Agendado",
    };
    setLista((atual) => [novo, ...atual]);
    setCliente(""); setAnimal(""); setServico(""); setData(""); setHora(""); setUrgencia("Nenhuma");
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

  function corUrgencia(u: Urgencia) {
    switch (u) {
      case "Crítica": return "bg-red-100 text-red-700";
      case "Alta": return "bg-orange-100 text-orange-700";
      case "Média": return "bg-yellow-100 text-yellow-800";
      case "Baixa": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold text-[#2c5f5d] mb-1">Agendamentos</h1>
          </div>

          <div className="flex max-w-3xl items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M12 2 1 21h22L12 2Zm0 4.5 7.2 12.5H4.8L12 6.5Zm-1 3.5v5h2v-5h-2Zm0 7v2h2v-2h-2Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">Atenção</p>
              <p className="text-sm leading-6 text-amber-700">
                Consultas, exames e cirurgias entre 00h e 05:59 têm acréscimo de R$ 200,00. Banho e Tosa e Vacinação não podem ser agendados nesse período.
              </p>
            </div>
          </div>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgência</label>
              <select value={urgencia} onChange={(e) => setUrgencia(e.target.value as Urgencia)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:border-[#2c5f5d]">
                {NIVEIS_URGENCIA.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {mensagem && (
            <p className={`text-sm font-semibold ${mensagem.includes("sucesso") ? "text-green-700" : "text-red-700"}`}>
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
              <th className="text-right px-4 py-2">Valor do Serviço</th>
              <th className="text-left px-4 py-2">Urgência</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-right px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-6">
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
                <td className="px-4 py-2 text-right font-medium text-[#2c5f5d]">
                  {formatarMoeda(calcularValorServico(a.servico, a.hora))}
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${corUrgencia(a.urgencia)}`}>
                    {a.urgencia}
                  </span>
                </td>
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