import React, { useState } from "react";
import Select from "react-select";


interface PopupFormProps {
  onClose: () => void;
}

const options = [    
    {
        value: "Banco do Brasil", 
        label: "Banco do Brasil",
        img: "https://logodownload.org/wp-content/uploads/2014/05/banco-do-brasil-logo-1.png"
    },

    {
        value: "Nubank", 
        label: "Nubank",
        img: "https://1000marcas.net/wp-content/uploads/2020/05/Logo-Nubank.png"
    },

    {
        value: "Bradesco",
        label: "Bradesco",
        img: "https://logodownload.org/wp-content/uploads/2014/05/bradesco-logo-1.png"
    },

    {
        value: "Itaú",
        label: "Itaú",
        img: "https://logodownload.org/wp-content/uploads/2014/05/itau-logo-1.png"
    },

    {
        value: "Santander",
        label: "Santander",
        img: "https://logodownload.org/wp-content/uploads/2014/05/santander-logo-1.png"
    },

    {
        value: "Outro Banco", 
        label: "Outro Banco", 
        img: ""
    }
]

const PopupForm: React.FC<PopupFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    titular: "",
    nomeBanco: "",
    saldo: "",
    numero:"",
    bancoUrl: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

const handleSubmit = async () => {
  const novaConta = {
    titular: formData.titular,
    nomeBanco: formData.nomeBanco,
    saldo: parseFloat(formData.saldo), // string -> number
    numero: formData.numero,
    bancoUrl: formData.bancoUrl
  };

  try {
    const response = await fetch("http://cedup-back-deploy.onrender.com/conta/banco", {
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
    <>
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
       <Select
            options={options}
            formatOptionLabel={(option) => (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img src={option.img} width="20" height="20" />
                <span>{option.label}</span>
                </div>
            )}
            onChange={(selected) => {
                setFormData({
                    ...formData,
                    nomeBanco: selected?.value || "",
                    bancoUrl: selected?.img || ""
                });
            }}
        ></Select>

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
          <button className= "enviar"onClick={handleSubmit}>Adicionar Conta</button>
          <button className= "cancelar"onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default PopupForm;