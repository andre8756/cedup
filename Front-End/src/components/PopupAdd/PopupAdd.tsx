import React, { useState } from "react";

interface PopupFormProps {
  onClose: () => void;
  onSubmit: (novaConta: { titular: string; instituicao: string; saldo: number }) => void;   
}

const PopupForm: React.FC<PopupFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    titular: "",
    instituicao: "",
    saldoTotal: "",
    numero:""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

const handleSubmit = async () => {
  const novaConta = {
    titular: formData.titular,
    instituicao: formData.instituicao,
    saldoTotal: parseFloat(formData.saldoTotal), // string -> number
    numero: formData.numero
  };

  try {
    const response = await fetch("http://localhost:8080/conta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaConta),
    });

    if (response.ok) {
      alert("Conta adicionada com sucesso!");
      onClose();
    } else {
      alert("Erro ao adicionar conta.");
    }
  } catch (error) {
    console.error(error);
    alert("Erro de conexão com o servidor.");
  }
};


  return (
    <div className="popup">
      <div className="popup-content">
        <h1>Adicionar Conta</h1>
        
        <label htmlFor="titular">Titular da Conta:</label>
        <input
          id="titular"
          value={formData.titular}
          onChange={handleChange}
          placeholder="Ex: Lucas Andrade"
        />

        <label htmlFor="instituicao">Nome da Instituição Bancária:</label>
        <input
          id="instituicao"
          value={formData.instituicao}
          onChange={handleChange}
          placeholder="Ex: Inter"
        />

        <label htmlFor="saldo">Informe o Saldo Bancário:</label>
        <input
          id="saldoTotal"
          type="number"
          step="0.01"
          value={formData.saldoTotal}
          onChange={handleChange}
          placeholder="Ex: R$6312,48"
        />

        <div className="popup-buttons">
          <button onClick={handleSubmit}>Adicionar Conta</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default PopupForm;
