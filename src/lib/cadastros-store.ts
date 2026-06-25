export type Animal = {
  nome: string;
  especie: string;
  raca?: string;
  idade?: string;
  sexo?: string;
  observacoes?: string;
};

export type Cliente = {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
  endereco?: string;
  animais: Animal[];
  criadoEm: string;
};

const KEY = "patas-e-pelos:cadastros";

export function listarClientes(): Cliente[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Cliente[]) : [];
  } catch {
    return [];
  }
}

export function salvarCliente(novo: Omit<Cliente, "id" | "criadoEm" | "animais"> & { animal: Animal }) {
  const atuais = listarClientes();
  const existente = atuais.find(
    (c) => c.cpf.trim() && c.cpf.trim() === novo.cpf.trim(),
  );
  if (existente) {
    existente.animais.push(novo.animal);
  } else {
    atuais.push({
      id: crypto.randomUUID(),
      nome: novo.nome,
      cpf: novo.cpf,
      telefone: novo.telefone,
      email: novo.email,
      endereco: novo.endereco,
      animais: [novo.animal],
      criadoEm: new Date().toISOString(),
    });
  }
  window.localStorage.setItem(KEY, JSON.stringify(atuais));
}