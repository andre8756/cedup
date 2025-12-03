import React, { useState } from "react";
import Select from "react-select";
import axios from "axios"; // 🔑 CORREÇÃO 1: Importar Axios para usar a função isAxiosError no catch
import api from "../../config/apiClient"; // Importa a instância Axios configurada (apiClient)
import { API_ENDPOINTS } from "../../config/api";
// Cookies handled by apiClient interceptor; no direct cookie access needed here

interface PopupFormProps {
  onClose: () => void;
}

interface Option {
  value: string;
  label: string;
  img?: string;
}

// Opções de bancos para o Select
const options: Option[] = [    
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
];

const PopupForm: React.FC<PopupFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    titular: "",
    nomeBanco: "",
    saldo: "",
    chavePix: "", // Campo obrigatório pelo backend
    bancoUrl: ""
  });

  // Atualiza o estado para inputs normais
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

const handleSubmit = async () => {
  // Cria o payload no formato que o backend espera
  const novaConta = {
    titular: formData.titular,
    nomeBanco: formData.nomeBanco,
  saldo: parseFloat(formData.saldo) || 0,
    chavePix: formData.chavePix, 
    // Adiciona campos opcionais com valor padrão
    status: true,
    permitirTransacao: true,
    bancoUrl: formData.bancoUrl
  };

  try {
    // Usa a instância 'api' (Axios com Token JWT) e endpoint centralizado
    await api.post(API_ENDPOINTS.BANCO.CRIAR, novaConta);

    // Fechar o popup após sucesso
    try { onClose(); } catch {}

  } catch (error) {
    console.error("Erro na criação do banco:", error);
    
    // 🔑 CORREÇÃO 3: Type Guard para tratar o erro Axios (TS18046)
    if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        
        if (status === 401 || status === 403) {
            alert("Erro de autenticação (Token Inválido). Faça login novamente.");
        } else if (status === 400) {
            alert(`Dados Inválidos. Status 400. Verifique se a Chave Pix e outros campos foram preenchidos.`);
        } else {
            alert(`Erro no servidor (${status}). Tente novamente.`);
        }
    } else {
        // Trata erros de rede ou outros erros
        alert("Erro de conexão com o servidor. Verifique sua rede.");
    }
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
          formatOptionLabel={(option: any) => (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img src={option.img} width="20" height="20" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <span>{option.label}</span>
                </div>
            )}
          onChange={(selected: any) => {
                setFormData({
                    ...formData,
                    nomeBanco: selected?.value || "",
                    bancoUrl: selected?.img || ""
                });
            }}
        ></Select>

        <label htmlFor="chavePix">Chave Pix:</label>
        <input
          id="chavePix" 
          value={formData.chavePix}
          onChange={handleChange}
          placeholder="Ex: email@exemplo.com"
        />

        <label htmlFor="saldo">Informe o Saldo Bancário:</label>
        <input
          id="saldo"
          type="number"
          step="0.01"
          value={formData.saldo}
          onChange={handleChange}
          placeholder="Ex: 6312.48"
        />

        <div className="popup-buttons">
          <button type="button" className= "enviar" onClick={handleSubmit}>Adicionar Conta</button>
          <button type="button" className= "cancelar" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default PopupForm;