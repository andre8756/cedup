import React, { useEffect, useState } from "react";

interface Conta {
  id: number;
  titular: string;
  instituicao: string;
  saldo: number;
}

const ContasList: React.FC = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContas = async () => {
      try {
        const response = await fetch("http://localhost:8080/conta");
        if (!response.ok) {
          throw new Error("Erro ao buscar contas");
        }
        const data = await response.json();
        setContas(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchContas();
  }, []);

  if (loading) return <p>Carregando contas...</p>;

  return (
    <div>
      <h2>Suas Contas</h2>
      <ul>
        {contas.map((conta) => (
          <li key={conta.id}>
            <strong>{conta.titular}</strong> — {conta.instituicao} —{" "}
            <span>R$ {conta.saldo.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContasList;
