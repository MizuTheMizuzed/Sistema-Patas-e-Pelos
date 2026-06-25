import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listarClientes, type Cliente } from "@/lib/cadastros-store";

export const Route = createFileRoute("/painel/cadastros")({
  head: () => ({ meta: [{ title: "Cadastros — Patas e Pelos" }] }),
  component: CadastrosPage,
});

const especieLabel: Record<string, string> = {
  cao: "Cão", gato: "Gato", ave: "Ave", roedor: "Roedor", outro: "Outro",
};

function CadastrosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);

  useEffect(() => {
    setClientes(listarClientes());
  }, []);

  const filtrados = clientes.filter((c) => {
    const q = busca.trim().toLowerCase();
    if (!q) return true;
    return (
      c.nome.toLowerCase().includes(q) ||
      c.cpf.toLowerCase().includes(q) ||
      c.telefone.toLowerCase().includes(q)
    );
  });

  const selecionado = filtrados.find((c) => c.id === selecionadoId) ?? filtrados[0] ?? null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#2c5f5d] mb-1">Cadastros</h1>
      <p className="text-sm text-gray-600 mb-4">
        Clientes cadastrados no sistema e seus respectivos animais.
      </p>

      {clientes.length === 0 ? (
        <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-700 mb-3">Nenhum cliente cadastrado ainda.</p>
          <Link
            to="/painel/cadastro"
            className="inline-block px-4 py-2 bg-[#2c5f5d] text-white rounded font-medium hover:bg-[#234a48]"
          >
            + Novo Cadastro
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lista de clientes */}
          <section className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
            <header className="bg-[#2c5f5d] text-white px-4 py-2 flex justify-between items-center">
              <span className="font-semibold">Clientes ({filtrados.length})</span>
              <Link to="/painel/cadastro" className="text-xs bg-white text-[#2c5f5d] px-2 py-1 rounded hover:bg-gray-100">
                + Novo
              </Link>
            </header>
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, CPF ou telefone..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2c5f5d]"
              />
            </div>
            <ul className="divide-y divide-gray-200 max-h-[60vh] overflow-auto">
              {filtrados.map((c) => {
                const ativo = selecionado?.id === c.id;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setSelecionadoId(c.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-[#eaf4f4] transition-colors ${
                        ativo ? "bg-[#eaf4f4] border-l-4 border-[#2c5f5d]" : ""
                      }`}
                    >
                      <div className="font-medium text-gray-800">{c.nome}</div>
                      <div className="text-xs text-gray-600">
                        CPF: {c.cpf} • {c.telefone}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        🐾 {c.animais.length} animal{c.animais.length !== 1 ? "is" : ""}
                      </div>
                    </button>
                  </li>
                );
              })}
              {filtrados.length === 0 && (
                <li className="p-4 text-sm text-gray-500 text-center">Nenhum cliente encontrado.</li>
              )}
            </ul>
          </section>

          {/* Detalhes + animais */}
          <section className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
            <header className="bg-[#2c5f5d] text-white px-4 py-2 font-semibold">
              Animais afiliados
            </header>
            {selecionado ? (
              <div className="p-4 space-y-4">
                <div className="bg-[#eaf4f4] rounded p-3 text-sm">
                  <div className="font-semibold text-[#2c5f5d]">{selecionado.nome}</div>
                  <div className="text-gray-700 text-xs mt-1 space-y-0.5">
                    <div>CPF: {selecionado.cpf}</div>
                    <div>Telefone: {selecionado.telefone}</div>
                    {selecionado.email && <div>Email: {selecionado.email}</div>}
                    {selecionado.endereco && <div>Endereço: {selecionado.endereco}</div>}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Animais ({selecionado.animais.length})
                  </h3>
                  <ul className="space-y-2">
                    {selecionado.animais.map((a, i) => (
                      <li
                        key={i}
                        className="border border-gray-200 rounded p-3 hover:border-[#2c5f5d] transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-gray-800">🐾 {a.nome}</div>
                          <span className="text-xs bg-[#2c5f5d] text-white px-2 py-0.5 rounded">
                            {especieLabel[a.especie] ?? a.especie}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1 grid grid-cols-2 gap-x-2">
                          {a.raca && <div>Raça: {a.raca}</div>}
                          {a.idade && <div>Idade: {a.idade} ano(s)</div>}
                          {a.sexo && (
                            <div>Sexo: {a.sexo === "macho" ? "Macho" : "Fêmea"}</div>
                          )}
                        </div>
                        {a.observacoes && (
                          <div className="text-xs text-gray-600 mt-2 italic">
                            Obs: {a.observacoes}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-6 text-sm text-gray-500 text-center">
                Selecione um cliente para ver seus animais.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}