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

const defaultClientes: Omit<Cliente, "id" | "criadoEm">[] = [
  {
    nome: "Maria Silva",
    cpf: "123.456.789-00",
    telefone: "(11) 99999-0001",
    email: "maria.silva@email.com",
    endereco: "Rua das Flores, 123",
    animais: [
      {
        nome: "Rex",
        especie: "cao",
        raca: "Vira-lata",
        idade: "4",
        sexo: "macho",
        observacoes: "Muito ativo e adora passeios.",
      },
    ],
  },
  {
    nome: "João Souza",
    cpf: "987.654.321-00",
    telefone: "(11) 98888-0002",
    email: "joao.souza@email.com",
    endereco: "Avenida Central, 456",
    animais: [
      {
        nome: "Mia",
        especie: "gato",
        raca: "Siamês",
        idade: "2",
        sexo: "femea",
        observacoes: "Gosta de carinho na cabeça.",
      },
    ],
  },
  {
    nome: "Ana Costa",
    cpf: "111.222.333-44",
    telefone: "(11) 97777-0003",
    email: "ana.costa@email.com",
    endereco: "Praça da Paz, 789",
    animais: [
      {
        nome: "Toby",
        especie: "cao",
        raca: "Labrador",
        idade: "3",
        sexo: "macho",
        observacoes: "Calmo e amigável.",
      },
    ],
  },
];

function getId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function createDefaultClientes(): Cliente[] {
  const timestamp = new Date().toISOString();
  return defaultClientes.map((cliente) => ({
    ...cliente,
    id: getId(),
    criadoEm: timestamp,
  }));
}

export function listarClientes(): Cliente[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw || !raw.trim()) {
      const defaults = createDefaultClientes();
      window.localStorage.setItem(KEY, JSON.stringify(defaults));
      return defaults;
    }

    const parsed = JSON.parse(raw) as Cliente[] | null;
    if (!parsed || parsed.length === 0) {
      const defaults = createDefaultClientes();
      window.localStorage.setItem(KEY, JSON.stringify(defaults));
      return defaults;
    }

    return parsed;
  } catch {
    const defaults = createDefaultClientes();
    window.localStorage.setItem(KEY, JSON.stringify(defaults));
    return defaults;
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
      id: getId(),
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

export function excluirCliente(id: string) {
  const atuais = listarClientes().filter((c) => c.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(atuais));
}

export function excluirAnimal(clienteId: string, index: number) {
  const atuais = listarClientes();
  const cliente = atuais.find((c) => c.id === clienteId);
  if (!cliente) return;
  cliente.animais.splice(index, 1);
  window.localStorage.setItem(KEY, JSON.stringify(atuais));
}

export function atualizarCliente(
  id: string,
  dados: Partial<Omit<Cliente, "id" | "criadoEm" | "animais">>,
) {
  const atuais = listarClientes();
  const cliente = atuais.find((c) => c.id === id);
  if (!cliente) return;
  Object.assign(cliente, dados);
  window.localStorage.setItem(KEY, JSON.stringify(atuais));
}

export function atualizarAnimal(clienteId: string, index: number, dados: Animal) {
  const atuais = listarClientes();
  const cliente = atuais.find((c) => c.id === clienteId);
  if (!cliente || !cliente.animais[index]) return;
  cliente.animais[index] = dados;
  window.localStorage.setItem(KEY, JSON.stringify(atuais));
}