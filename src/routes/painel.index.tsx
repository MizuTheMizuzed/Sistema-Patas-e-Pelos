import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/painel/")({
  component: PainelHome,
});

function PainelHome() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#2c5f5d] mb-2">Bem-vindo(a)!</h1>
      <p className="text-gray-700">
        Use o menu lateral para acessar o cadastro de clientes/animais e demais funcionalidades.
      </p>
    </div>
  );
}