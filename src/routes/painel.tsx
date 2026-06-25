import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/painel")({
  component: PainelLayout,
});

const menu = [
  { label: "Início", path: "/painel", icon: "🏠" },
  { label: "Cadastro de Cliente/Animal", path: "/painel/cadastro", icon: "🐾" },
  { label: "Agendamentos", path: "/painel/agendamentos", icon: "📅" },
  { label: "Cadastros", path: "/painel/cadastros", icon: "👥" },
];

function PainelLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <div className="min-h-screen flex bg-[#eaf4f4]">
      <aside className="w-60 bg-[#2c5f5d] text-white flex flex-col">
        <div className="p-4 border-b border-white/20">
          <div className="text-xl font-bold">🐾 Patas e Pelos</div>
          <div className="text-xs text-white/70">Painel do Atendente</div>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {menu.map((item) => {
            const active = path === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded text-sm transition-colors ${
                  active
                    ? "bg-white text-[#2c5f5d] font-medium"
                    : "hover:bg-white/10 text-white"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/20">
          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full text-left text-sm text-white/80 hover:text-white"
          >
            ↩ Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}