import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  listarClientes,
  excluirCliente,
  excluirAnimal,
  atualizarCliente,
  atualizarAnimal,
  type Cliente,
  type Animal,
} from "@/lib/cadastros-store";

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
  const [editandoCliente, setEditandoCliente] = useState<Cliente | null>(null);
  const [editandoAnimal, setEditandoAnimal] = useState<
    { clienteId: string; index: number; animal: Animal } | null
  >(null);

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

  function handleExcluirCliente(c: Cliente) {
    const ok = window.confirm(
      `Tem certeza que deseja excluir o cliente "${c.nome}" e seus ${c.animais.length} animal(is) afiliado(s)?\n\nEsta ação não pode ser desfeita.`,
    );
    if (!ok) return;
    excluirCliente(c.id);
    setClientes(listarClientes());
    if (selecionadoId === c.id) setSelecionadoId(null);
  }

  function handleExcluirAnimal(clienteId: string, index: number, nomeAnimal: string) {
    const ok = window.confirm(`Remover o animal "${nomeAnimal}" deste cliente?`);
    if (!ok) return;
    excluirAnimal(clienteId, index);
    setClientes(listarClientes());
  }

  function salvarEdicaoCliente() {
    if (!editandoCliente) return;
    atualizarCliente(editandoCliente.id, {
      nome: editandoCliente.nome,
      cpf: editandoCliente.cpf,
      telefone: editandoCliente.telefone,
      email: editandoCliente.email,
      endereco: editandoCliente.endereco,
    });
    setClientes(listarClientes());
    setEditandoCliente(null);
  }

  function salvarEdicaoAnimal() {
    if (!editandoAnimal) return;
    atualizarAnimal(editandoAnimal.clienteId, editandoAnimal.index, editandoAnimal.animal);
    setClientes(listarClientes());
    setEditandoAnimal(null);
  }

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
                    <div
                      className={`flex items-stretch hover:bg-[#eaf4f4] transition-colors ${
                        ativo ? "bg-[#eaf4f4] border-l-4 border-[#2c5f5d]" : ""
                      }`}
                    >
                      <button
                        onClick={() => setSelecionadoId(c.id)}
                        className="flex-1 text-left px-4 py-3"
                      >
                        <div className="font-medium text-gray-800">{c.nome}</div>
                        <div className="text-xs text-gray-600">
                          CPF: {c.cpf} • {c.telefone}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          🐾 {c.animais.length} animal{c.animais.length !== 1 ? "is" : ""}
                        </div>
                      </button>
                      <button
                        onClick={() => handleExcluirCliente(c)}
                        title="Excluir cliente"
                        className="px-3 text-red-600 hover:bg-red-50 text-sm"
                      >
                        🗑
                      </button>
                    </div>
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
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-semibold text-[#2c5f5d]">{selecionado.nome}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditandoCliente({ ...selecionado })}
                        className="text-xs px-2 py-1 border border-[#2c5f5d] text-[#2c5f5d] rounded hover:bg-[#eaf4f4]"
                      >
                        ✏ Editar
                      </button>
                      <button
                        onClick={() => handleExcluirCliente(selecionado)}
                        className="text-xs px-2 py-1 border border-red-300 text-red-700 rounded hover:bg-red-50"
                      >
                        🗑 Excluir
                      </button>
                    </div>
                  </div>
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
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-[#2c5f5d] text-white px-2 py-0.5 rounded">
                              {especieLabel[a.especie] ?? a.especie}
                            </span>
                            <button
                              onClick={() =>
                                setEditandoAnimal({
                                  clienteId: selecionado.id,
                                  index: i,
                                  animal: { ...a },
                                })
                              }
                              title="Editar animal"
                              className="text-[#2c5f5d] hover:bg-[#eaf4f4] text-xs px-1 rounded"
                            >
                              ✏
                            </button>
                            <button
                              onClick={() => handleExcluirAnimal(selecionado.id, i, a.nome)}
                              title="Remover animal"
                              className="text-red-600 hover:bg-red-50 text-xs px-1 rounded"
                            >
                              🗑
                            </button>
                          </div>
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

      {editandoCliente && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <header className="bg-[#2c5f5d] text-white px-4 py-2 rounded-t-lg font-semibold">
              Editar cliente
            </header>
            <div className="p-4 space-y-3 text-sm">
              {[
                { key: "nome", label: "Nome" },
                { key: "cpf", label: "CPF" },
                { key: "telefone", label: "Telefone" },
                { key: "email", label: "Email" },
                { key: "endereco", label: "Endereço" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-600 mb-1">{f.label}</label>
                  <input
                    type="text"
                    value={(editandoCliente as any)[f.key] ?? ""}
                    onChange={(e) =>
                      setEditandoCliente({ ...editandoCliente, [f.key]: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                  />
                </div>
              ))}
            </div>
            <footer className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => setEditandoCliente(null)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarEdicaoCliente}
                className="px-3 py-1.5 text-sm bg-[#2c5f5d] text-white rounded hover:bg-[#234a48]"
              >
                Salvar
              </button>
            </footer>
          </div>
        </div>
      )}

      {editandoAnimal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <header className="bg-[#2c5f5d] text-white px-4 py-2 rounded-t-lg font-semibold">
              Editar animal
            </header>
            <div className="p-4 space-y-3 text-sm">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Nome</label>
                <input
                  type="text"
                  value={editandoAnimal.animal.nome}
                  onChange={(e) =>
                    setEditandoAnimal({
                      ...editandoAnimal,
                      animal: { ...editandoAnimal.animal, nome: e.target.value },
                    })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Espécie</label>
                <select
                  value={editandoAnimal.animal.especie}
                  onChange={(e) =>
                    setEditandoAnimal({
                      ...editandoAnimal,
                      animal: { ...editandoAnimal.animal, especie: e.target.value },
                    })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                >
                  <option value="cao">Cão</option>
                  <option value="gato">Gato</option>
                  <option value="ave">Ave</option>
                  <option value="roedor">Roedor</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Raça</label>
                  <input
                    type="text"
                    value={editandoAnimal.animal.raca ?? ""}
                    onChange={(e) =>
                      setEditandoAnimal({
                        ...editandoAnimal,
                        animal: { ...editandoAnimal.animal, raca: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Idade</label>
                  <input
                    type="text"
                    value={editandoAnimal.animal.idade ?? ""}
                    onChange={(e) =>
                      setEditandoAnimal({
                        ...editandoAnimal,
                        animal: { ...editandoAnimal.animal, idade: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Sexo</label>
                <select
                  value={editandoAnimal.animal.sexo ?? ""}
                  onChange={(e) =>
                    setEditandoAnimal({
                      ...editandoAnimal,
                      animal: { ...editandoAnimal.animal, sexo: e.target.value },
                    })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                >
                  <option value="">—</option>
                  <option value="macho">Macho</option>
                  <option value="femea">Fêmea</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Observações</label>
                <textarea
                  value={editandoAnimal.animal.observacoes ?? ""}
                  onChange={(e) =>
                    setEditandoAnimal({
                      ...editandoAnimal,
                      animal: { ...editandoAnimal.animal, observacoes: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                />
              </div>
            </div>
            <footer className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => setEditandoAnimal(null)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarEdicaoAnimal}
                className="px-3 py-1.5 text-sm bg-[#2c5f5d] text-white rounded hover:bg-[#234a48]"
              >
                Salvar
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}