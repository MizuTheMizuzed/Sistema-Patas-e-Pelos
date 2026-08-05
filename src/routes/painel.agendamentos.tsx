import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

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
  sintomas: string;
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
  { id: 1, cliente: "Maria Silva", animal: "Rex", servico: "Consulta", data: "2026-06-26", hora: "09:00", urgencia: "Baixa", sintomas: "Muito apático e com febre", status: "Agendado" },
  { id: 2, cliente: "João Souza", animal: "Mia", servico: "Vacinação", data: "2026-06-26", hora: "10:30", urgencia: "Nenhuma", sintomas: "Sem sintomas aparentes", status: "Agendado" },
  { id: 3, cliente: "Ana Costa", animal: "Toby", servico: "Banho e Tosa", data: "2026-06-27", hora: "14:00", urgencia: "Nenhuma", sintomas: "", status: "Concluído" },
  { id: 4, cliente: "Carlos Lima", animal: "Luna", servico: "Cirurgia", data: "2026-06-28", hora: "13:30", urgencia: "Crítica", sintomas: "Sangramento intenso e dor abdominal", status: "Agendado" },
];

function AgendamentosPage() {
  const [lista, setLista] = useState<Agendamento[]>(exemplos);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [cliente, setCliente] = useState("");
  const [animal, setAnimal] = useState("");
  const [servico, setServico] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [urgencia, setUrgencia] = useState<Urgencia>("Nenhuma");
  const [sintomas, setSintomas] = useState("");
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"Todos" | Agendamento["status"]>("Todos");
  const [filtroUrgencia, setFiltroUrgencia] = useState<"Todas" | Urgencia>("Todas");
  const [filtroData, setFiltroData] = useState("");

  const agendamentosFiltrados = useMemo(() => {
    const termo = normalizarTexto(termoBusca);

    return lista.filter((agendamento) => {
      if (filtroStatus !== "Todos" && agendamento.status !== filtroStatus) {
        return false;
      }

      if (filtroUrgencia !== "Todas" && agendamento.urgencia !== filtroUrgencia) {
        return false;
      }

      if (filtroData && agendamento.data !== filtroData) {
        return false;
      }

      if (!termo) {
        return true;
      }

      const camposParaBusca = [
        agendamento.cliente,
        agendamento.animal,
        agendamento.servico,
        agendamento.data,
        agendamento.hora,
        agendamento.urgencia,
        agendamento.sintomas,
        agendamento.status,
        String(agendamento.id),
      ];

      return camposParaBusca.some((campo) => normalizarTexto(String(campo)).includes(termo));
    });
  }, [filtroData, filtroStatus, filtroUrgencia, lista, termoBusca]);

  const resumo = useMemo(() => {
    const agendados = lista.filter((agendamento) => agendamento.status === "Agendado").length;
    const concluidos = lista.filter((agendamento) => agendamento.status === "Concluído").length;
    const cancelados = lista.filter((agendamento) => agendamento.status === "Cancelado").length;
    const valorTotal = lista
      .filter((agendamento) => agendamento.status !== "Cancelado")
      .reduce((soma, agendamento) => soma + calcularValorServico(agendamento.servico, agendamento.hora), 0);

    return {
      total: lista.length,
      agendados,
      concluidos,
      cancelados,
      valorTotal,
    };
  }, [lista]);

  function limparFormulario() {
    setCliente("");
    setAnimal("");
    setServico("");
    setData("");
    setHora("");
    setUrgencia("Nenhuma");
    setSintomas("");
    setEditandoId(null);
  }

  function abrirFormularioParaEdicao(agendamento: Agendamento) {
    setCliente(agendamento.cliente);
    setAnimal(agendamento.animal);
    setServico(agendamento.servico);
    setData(agendamento.data);
    setHora(agendamento.hora);
    setUrgencia(agendamento.urgencia);
    setSintomas(agendamento.sintomas);
    setEditandoId(agendamento.id);
    setMostrarForm(true);
    setMensagem("");
  }

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
    if (conflito && conflito.id !== editandoId) {
      const dataFormatada = conflito.data.split("-").reverse().join("/");
      setMensagem(
        `Conflito de agendamento: já existe um horário ativo para ${conflito.animal} do tutor ${conflito.cliente} em ${dataFormatada} às ${conflito.hora}.`,
      );
      return;
    }

    const confirmado = window.confirm(
      editandoId
        ? "Confirme a alteração deste agendamento.\n\nRevise cliente, animal, serviço, data e horário antes de salvar."
        : "Confirme a criação deste agendamento.\n\nRevise cliente, animal, serviço, data e horário antes de salvar.",
    );
    if (!confirmado) {
      setMensagem(editandoId ? "Edição do agendamento cancelada." : "Criação do agendamento cancelada.");
      return;
    }

    if (editandoId) {
      setLista((atual) =>
        atual.map((agendamento) =>
          agendamento.id === editandoId
            ? {
                ...agendamento,
                cliente,
                animal,
                servico,
                data,
                hora,
                urgencia,
                sintomas: sintomas.trim(),
              }
            : agendamento,
        ),
      );
      setMensagem("Agendamento atualizado com sucesso!");
    } else {
      const novo: Agendamento = {
        id: Date.now(),
        cliente, animal, servico, data, hora, urgencia, sintomas: sintomas.trim(),
        status: "Agendado",
      };
      setLista((atual) => [novo, ...atual]);
      setMensagem("Agendamento criado com sucesso! (demonstração)");
    }

    limparFormulario();
    setMostrarForm(false);
  }

  function cancelar(id: number) {
    const agendamento = lista.find((item) => item.id === id);
    if (!agendamento) return;

    const confirmado = window.confirm(
      `Cancelar este agendamento de ${agendamento.cliente} para ${agendamento.animal}?\n\nEssa ação altera o status para cancelado.`,
    );
    if (!confirmado) return;

    setLista((l) => l.map((a) => (a.id === id ? { ...a, status: "Cancelado" } : a)));
    setMensagem(`Agendamento de ${agendamento.animal} cancelado.`);
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
          onClick={() => {
            if (mostrarForm) {
              limparFormulario();
              setMostrarForm(false);
              setMensagem("");
            } else {
              setMostrarForm(true);
              setEditandoId(null);
              setMensagem("");
              limparFormulario();
            }
          }}
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
          <h2 className="text-[#2c5f5d] font-semibold">{editandoId ? "Editar Agendamento" : "Novo Agendamento"}</h2>
          <p className="text-xs text-gray-600">
            Campos marcados com <span className="text-red-600">*</span> são obrigatórios.
          </p>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
            Antes de salvar, revise os dados do cliente, animal, serviço, data e horário. O sistema solicitará confirmação antes de criar o agendamento.
          </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Sintomas do animal</label>
              <textarea
                value={sintomas}
                onChange={(e) => setSintomas(e.target.value)}
                rows={3}
                placeholder="Descreva os sintomas observados pelo dono do animal, se houver."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
              />
              <p className="mt-1 text-xs text-gray-500">Esse texto ajuda a equipe a entender o que o animal está sentindo no momento do atendimento.</p>
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

      <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="mt-1 text-2xl font-semibold text-[#2c5f5d]">{resumo.total}</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <p className="text-sm text-blue-700">Agendados</p>
          <p className="mt-1 text-2xl font-semibold text-blue-700">{resumo.agendados}</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 shadow-sm">
          <p className="text-sm text-green-700">Concluídos</p>
          <p className="mt-1 text-2xl font-semibold text-green-700">{resumo.concluidos}</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
          <p className="text-sm text-red-700">Cancelados</p>
          <p className="mt-1 text-2xl font-semibold text-red-700">{resumo.cancelados}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm text-amber-700">Valor previsto</p>
          <p className="mt-1 text-xl font-semibold text-amber-700">{formatarMoeda(resumo.valorTotal)}</p>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">Buscar</label>
            <input
              type="search"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Nome, contato, código, data ou serviço"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value as "Todos" | Agendamento["status"])}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:border-[#2c5f5d]"
              >
                <option value="Todos">Todos</option>
                <option value="Agendado">Agendado</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Urgência</label>
              <select
                value={filtroUrgencia}
                onChange={(e) => setFiltroUrgencia(e.target.value as "Todas" | Urgencia)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:border-[#2c5f5d]"
              >
                <option value="Todas">Todas</option>
                {NIVEIS_URGENCIA.map((nivel) => (
                  <option key={nivel} value={nivel}>{nivel}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Data</label>
              <input
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Exibindo {agendamentosFiltrados.length} de {lista.length} agendamentos.
          </p>
          <button
            type="button"
            onClick={() => {
              setTermoBusca("");
              setFiltroStatus("Todos");
              setFiltroUrgencia("Todas");
              setFiltroData("");
            }}
            className="text-sm font-medium text-[#2c5f5d] hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#eaf4f4] text-[#2c5f5d]">
            <tr>
              <th className="text-left px-4 py-2">Data</th>
              <th className="text-left px-4 py-2">Hora</th>
              <th className="text-left px-4 py-2">Cliente</th>
              <th className="text-left px-4 py-2">Animal</th>
              <th className="text-left px-4 py-2">Serviço</th>
              <th className="text-left px-4 py-2">Sintomas</th>
              <th className="text-right px-4 py-2">Valor do Serviço</th>
              <th className="text-left px-4 py-2">Urgência</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-right px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentosFiltrados.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center text-gray-500 py-6">
                  Nenhum agendamento atende aos filtros aplicados.
                </td>
              </tr>
            )}
            {agendamentosFiltrados.map((a) => (
              <tr key={a.id} className="border-t border-gray-200">
                <td className="px-4 py-2">{a.data.split("-").reverse().join("/")}</td>
                <td className="px-4 py-2">{a.hora}</td>
                <td className="px-4 py-2">{a.cliente}</td>
                <td className="px-4 py-2">{a.animal}</td>
                <td className="px-4 py-2">{a.servico}</td>
                <td className="px-4 py-2 max-w-[220px] whitespace-pre-wrap break-words text-gray-700">
                  {a.sintomas || "—"}
                </td>
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
                  <div className="flex justify-end gap-2">
                    {a.status === "Agendado" && (
                      <button
                        onClick={() => abrirFormularioParaEdicao(a)}
                        className="text-[#2c5f5d] hover:underline text-xs"
                      >
                        Editar
                      </button>
                    )}
                    {a.status === "Agendado" && (
                      <button
                        onClick={() => cancelar(a.id)}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}