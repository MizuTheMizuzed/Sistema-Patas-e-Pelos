import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { listarClientes, type Cliente } from "@/lib/cadastros-store";

export const Route = createFileRoute("/painel/")({
  component: PainelHome,
});

function PainelHome() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    setClientes(listarClientes());
  }, []);

  const totalAnimais = useMemo(
    () => clientes.reduce((total, cliente) => total + cliente.animais.length, 0),
    [clientes],
  );

  return (
    <div className="p-6 md:p-8 space-y-6">
      <section className="rounded-2xl border border-[#cde2e1] bg-gradient-to-br from-[#2c5f5d] via-[#356b68] to-[#4b8783] p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              Painel da clínica
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">Bem-vindo(a) ao Patas e Pelos!</h1>
            <p className="mt-2 text-sm text-white/90 sm:text-base">
              Acompanhe cadastros, pacientes e próximos passos em um só lugar.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/painel/cadastro"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#2c5f5d] transition hover:bg-[#f3f8f8]"
            >
              + Cadastrar novo cliente
            </Link>
            <Link
              to="/painel/cadastros"
              className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Ver cadastros
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Clientes cadastrados</p>
          <p className="mt-2 text-3xl font-bold text-[#2c5f5d]">{clientes.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Animais no sistema</p>
          <p className="mt-2 text-3xl font-bold text-[#2c5f5d]">{totalAnimais}</p>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#2c5f5d]">Cadastros recentes</h2>
          <Link to="/painel/cadastros" className="text-sm text-[#2c5f5d] hover:underline">
            Ver todos
          </Link>
        </div>

        {clientes.length === 0 ? (
          <p className="text-sm text-gray-500">Ainda não há clientes cadastrados.</p>
        ) : (
          <div className="space-y-3">
            {clientes.slice(0, 3).map((cliente) => (
              <div key={cliente.id} className="flex items-start justify-between rounded-lg border border-gray-200 p-3">
                <div>
                  <p className="font-medium text-gray-800">{cliente.nome}</p>
                  <p className="text-sm text-gray-500">
                    {cliente.animais.length} animal{cliente.animais.length !== 1 ? "is" : ""}
                  </p>
                </div>
                <span className="rounded-full bg-[#eaf4f4] px-2.5 py-1 text-xs font-medium text-[#2c5f5d]">
                  {cliente.telefone}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-dashed border-[#b9d9d6] bg-[#f7fbfb] p-4 text-sm text-gray-700 shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="font-medium text-[#2c5f5d]">FAQ</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">O sistema informou que já existe um pré-agendamento igual. O que significa?</p>
            <p className="mt-1 text-gray-700">
              Já existe um registro para o mesmo tutor, pet e horário. Verifique os agendamentos existentes antes de criar outro.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Por que aparece uma confirmação antes de salvar ou cancelar?</p>
            <p className="mt-1 text-gray-700">
              Essa confirmação evita alterações acidentais e garante que a operação será realizada apenas após a confirmação do usuário.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">O que fazer quando nenhum registro é encontrado?</p>
            <p className="mt-1 text-gray-700">
              Confira os dados digitados na pesquisa ou remova os filtros aplicados.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}