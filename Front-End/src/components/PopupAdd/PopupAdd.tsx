import React, { useState } from "react";

interface PopupFormProps {
  onClose: () => void;
}

const PopupForm: React.FC<PopupFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    titular: "",
    nomeBanco: "",
    saldo: "",
    numero:""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

const handleSubmit = async () => {
  const novaConta = {
    titular: formData.titular,
    nomeBanco: formData.nomeBanco,
    saldo: parseFloat(formData.saldo), // string -> number
    numero: formData.numero
  };

  try {
    const response = await fetch("http://localhost:8080/conta/1/banco", {
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

        <label htmlFor="nomeBanco">Nome da Instituição Bancária:</label>
        <input
          id="nomeBanco"
          value={formData.nomeBanco}
          onChange={handleChange}
          placeholder="Ex: Inter"
        />

        <label htmlFor="saldo">Informe o Saldo Bancário:</label>
        <input
          id="saldo"
          type="number"
          step="0.01"
          value={formData.saldo}
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
