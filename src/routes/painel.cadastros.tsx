import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  listarCadastros,
  excluirCadastroCliente,
  excluirAnimalDoCliente,
  atualizarCadastroCliente,
  atualizarAnimalDoCliente,
  type Cliente,
  type Animal,
} from "@/lib/cadastros-store";

export const Route = createFileRoute("/painel/cadastros")({
  head: () => ({ meta: [{ title: "Cadastros — Patas e Pelos" }] }),
  component: CadastrosPage,
});

const rotuloEspecie: Record<string, string> = {
  cao: "Cão",
  gato: "Gato",
  ave: "Ave",
  roedor: "Roedor",
  outro: "Outro",
};

const camposClienteEdicao = [
  { key: "nome", label: "Nome" },
  { key: "cpf", label: "CPF" },
  { key: "telefone", label: "Telefone" },
  { key: "email", label: "Email" },
  { key: "endereco", label: "Endereço" },
] as const;

function CadastrosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [textoBusca, setTextoBusca] = useState("");
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<string | null>(null);
  const [clienteEmEdicao, setClienteEmEdicao] = useState<Cliente | null>(null);
  const [animalEmEdicao, setAnimalEmEdicao] = useState<
    { clienteId: string; index: number; animal: Animal } | null
  >(null);

  useEffect(() => {
    setClientes(listarCadastros());
  }, []);

  const clientesFiltrados = clientes.filter((cliente) => {
    const termoBusca = textoBusca.trim().toLowerCase();
    if (!termoBusca) return true;
    return (
      cliente.nome.toLowerCase().includes(termoBusca) ||
      cliente.cpf.toLowerCase().includes(termoBusca) ||
      cliente.telefone.toLowerCase().includes(termoBusca)
    );
  });

  const clienteSelecionado =
    clientesFiltrados.find((cliente) => cliente.id === clienteSelecionadoId) ?? clientesFiltrados[0] ?? null;

  function handleExcluirCliente(cliente: Cliente) {
    const confirmado = window.confirm(
      `Tem certeza que deseja excluir o cliente "${cliente.nome}" e seus ${cliente.animais.length} animal(is) afiliado(s)?\n\nEsta ação não pode ser desfeita.`,
    );
    if (!confirmado) return;

    excluirCadastroCliente(cliente.id);
    setClientes(listarCadastros());
    if (clienteSelecionadoId === cliente.id) setClienteSelecionadoId(null);
  }

  function handleExcluirAnimal(clienteId: string, index: number, nomeAnimal: string) {
    const confirmado = window.confirm(
      `Remover o animal "${nomeAnimal}" deste cliente?\n\nEssa ação exclui o registro do animal da ficha.`,
    );
    if (!confirmado) return;

    excluirAnimalDoCliente(clienteId, index);
    setClientes(listarCadastros());
  }

  function salvarClienteEditado() {
    if (!clienteEmEdicao) return;

    const confirmado = window.confirm(
      `Deseja salvar as alterações feitas no cadastro de "${clienteEmEdicao.nome}"?`,
    );
    if (!confirmado) return;

    atualizarCadastroCliente(clienteEmEdicao.id, {
      nome: clienteEmEdicao.nome,
      cpf: clienteEmEdicao.cpf,
      telefone: clienteEmEdicao.telefone,
      email: clienteEmEdicao.email,
      endereco: clienteEmEdicao.endereco,
    });

    setClientes(listarCadastros());
    setClienteEmEdicao(null);
  }

  function salvarAnimalEditado() {
    if (!animalEmEdicao) return;

    const confirmado = window.confirm(
      `Deseja salvar as alterações feitas no animal "${animalEmEdicao.animal.nome}"?`,
    );
    if (!confirmado) return;

    atualizarAnimalDoCliente(animalEmEdicao.clienteId, animalEmEdicao.index, animalEmEdicao.animal);
    setClientes(listarCadastros());
    setAnimalEmEdicao(null);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#2c5f5d] mb-1">Cadastros</h1>
      <p className="text-sm text-gray-600 mb-4">
        Clientes cadastrados no sistema e seus respectivos animais.
      </p>
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
        Antes de salvar, editar ou excluir, revise as informações com atenção. O sistema solicitará confirmação para evitar alterações acidentais.
      </div>

      {clientes.length === 0 ? (
        <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-700 mb-3">Nenhum cliente cadastrado ainda.</p>
          <Link
            to="/painel/cadastro"
            className="inline-block px-4 py-2 bg-[#2c5f5d] text-white rounded font-medium hover:bg-[#234a48]"
          >
            + Novo cadastro
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
            <header className="bg-[#2c5f5d] text-white px-4 py-2 flex justify-between items-center">
              <span className="font-semibold">Clientes ({clientesFiltrados.length})</span>
              <Link
                to="/painel/cadastro"
                className="text-xs bg-white text-[#2c5f5d] px-2 py-1 rounded hover:bg-gray-100"
              >
                + Novo
              </Link>
            </header>
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                value={textoBusca}
                onChange={(e) => setTextoBusca(e.target.value)}
                placeholder="Buscar por nome, CPF ou telefone..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2c5f5d]"
              />
            </div>
            <ul className="divide-y divide-gray-200 max-h-[60vh] overflow-auto">
              {clientesFiltrados.map((cliente) => {
                const ativo = clienteSelecionado?.id === cliente.id;
                return (
                  <li key={cliente.id}>
                    <div
                      className={`flex items-stretch hover:bg-[#eaf4f4] transition-colors ${
                        ativo ? "bg-[#eaf4f4] border-l-4 border-[#2c5f5d]" : ""
                      }`}
                    >
                      <button
                        onClick={() => setClienteSelecionadoId(cliente.id)}
                        className="flex-1 text-left px-4 py-3"
                      >
                        <div className="font-medium text-gray-800">{cliente.nome}</div>
                        <div className="text-xs text-gray-600">
                          CPF: {cliente.cpf} • {cliente.telefone}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          🐾 {cliente.animais.length} animal{cliente.animais.length !== 1 ? "is" : ""}
                        </div>
                      </button>
                      <button
                        onClick={() => handleExcluirCliente(cliente)}
                        title="Excluir cliente"
                        className="px-3 text-red-600 hover:bg-red-50 text-sm"
                      >
                        🗑
                      </button>
                    </div>
                  </li>
                );
              })}
              {clientesFiltrados.length === 0 && (
                <li className="p-4 text-sm text-gray-500 text-center">Nenhum cliente encontrado.</li>
              )}
            </ul>
          </section>

          <section className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
            <header className="bg-[#2c5f5d] text-white px-4 py-2 font-semibold">
              Animais afiliados
            </header>
            {clienteSelecionado ? (
              <div className="p-4 space-y-4">
                <div className="bg-[#eaf4f4] rounded p-3 text-sm">
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-semibold text-[#2c5f5d]">{clienteSelecionado.nome}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setClienteEmEdicao({ ...clienteSelecionado })}
                        className="text-xs px-2 py-1 border border-[#2c5f5d] text-[#2c5f5d] rounded hover:bg-[#eaf4f4]"
                      >
                        ✏ Editar
                      </button>
                      <button
                        onClick={() => handleExcluirCliente(clienteSelecionado)}
                        className="text-xs px-2 py-1 border border-red-300 text-red-700 rounded hover:bg-red-50"
                      >
                        🗑 Excluir
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-700 text-xs mt-1 space-y-0.5">
                    <div>CPF: {clienteSelecionado.cpf}</div>
                    <div>Telefone: {clienteSelecionado.telefone}</div>
                    {clienteSelecionado.email && <div>Email: {clienteSelecionado.email}</div>}
                    {clienteSelecionado.endereco && <div>Endereço: {clienteSelecionado.endereco}</div>}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Animais ({clienteSelecionado.animais.length})
                  </h3>
                  <ul className="space-y-2">
                    {clienteSelecionado.animais.map((animal, index) => (
                      <li
                        key={`${clienteSelecionado.id}-${index}`}
                        className="border border-gray-200 rounded p-3 hover:border-[#2c5f5d] transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-gray-800">🐾 {animal.nome}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-[#2c5f5d] text-white px-2 py-0.5 rounded">
                              {rotuloEspecie[animal.especie] ?? animal.especie}
                            </span>
                            <button
                              onClick={() =>
                                setAnimalEmEdicao({
                                  clienteId: clienteSelecionado.id,
                                  index,
                                  animal: { ...animal },
                                })
                              }
                              title="Editar animal"
                              className="text-[#2c5f5d] hover:bg-[#eaf4f4] text-xs px-1 rounded"
                            >
                              ✏
                            </button>
                            <button
                              onClick={() => handleExcluirAnimal(clienteSelecionado.id, index, animal.nome)}
                              title="Remover animal"
                              className="text-red-600 hover:bg-red-50 text-xs px-1 rounded"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1 grid grid-cols-2 gap-x-2">
                          {animal.raca && <div>Raça: {animal.raca}</div>}
                          {animal.idade && <div>Idade: {animal.idade} ano(s)</div>}
                          {animal.sexo && (
                            <div>Sexo: {animal.sexo === "macho" ? "Macho" : "Fêmea"}</div>
                          )}
                        </div>
                        {animal.observacoes && (
                          <div className="text-xs text-gray-600 mt-2 italic">
                            Obs: {animal.observacoes}
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

      {clienteEmEdicao && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <header className="bg-[#2c5f5d] text-white px-4 py-2 rounded-t-lg font-semibold">
              Editar cliente
            </header>
            <div className="p-4 space-y-3 text-sm">
              {camposClienteEdicao.map((campo) => (
                <div key={campo.key}>
                  <label className="block text-xs text-gray-600 mb-1">{campo.label}</label>
                  <input
                    type="text"
                    value={(clienteEmEdicao as Record<string, string | undefined>)[campo.key] ?? ""}
                    onChange={(e) =>
                      setClienteEmEdicao({ ...clienteEmEdicao, [campo.key]: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                  />
                </div>
              ))}
            </div>
            <footer className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => setClienteEmEdicao(null)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarClienteEditado}
                className="px-3 py-1.5 text-sm bg-[#2c5f5d] text-white rounded hover:bg-[#234a48]"
              >
                Salvar
              </button>
            </footer>
          </div>
        </div>
      )}

      {animalEmEdicao && (
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
                  value={animalEmEdicao.animal.nome}
                  onChange={(e) =>
                    setAnimalEmEdicao({
                      ...animalEmEdicao,
                      animal: { ...animalEmEdicao.animal, nome: e.target.value },
                    })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Espécie</label>
                <select
                  value={animalEmEdicao.animal.especie}
                  onChange={(e) =>
                    setAnimalEmEdicao({
                      ...animalEmEdicao,
                      animal: { ...animalEmEdicao.animal, especie: e.target.value },
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
                    value={animalEmEdicao.animal.raca ?? ""}
                    onChange={(e) =>
                      setAnimalEmEdicao({
                        ...animalEmEdicao,
                        animal: { ...animalEmEdicao.animal, raca: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Idade</label>
                  <input
                    type="text"
                    value={animalEmEdicao.animal.idade ?? ""}
                    onChange={(e) =>
                      setAnimalEmEdicao({
                        ...animalEmEdicao,
                        animal: { ...animalEmEdicao.animal, idade: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Sexo</label>
                <select
                  value={animalEmEdicao.animal.sexo ?? ""}
                  onChange={(e) =>
                    setAnimalEmEdicao({
                      ...animalEmEdicao,
                      animal: { ...animalEmEdicao.animal, sexo: e.target.value },
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
                  value={animalEmEdicao.animal.observacoes ?? ""}
                  onChange={(e) =>
                    setAnimalEmEdicao({
                      ...animalEmEdicao,
                      animal: { ...animalEmEdicao.animal, observacoes: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#2c5f5d]"
                />
              </div>
            </div>
            <footer className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => setAnimalEmEdicao(null)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarAnimalEditado}
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