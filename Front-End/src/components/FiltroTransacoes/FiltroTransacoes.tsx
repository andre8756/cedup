import React, { useState } from "react";
import axios from "axios";
import "./FiltroTransacoes.css";

// Definição dos tipos de filtro
type FiltroKey = 
    | 'nenhum' 
    | 'bancoOrigemId' 
    | 'bancoDestinoId' 
    | 'intervaloData'; 


const FilterForm: React.FC = () => {
    // ESTADO DE VISIBILIDADE para o botão de abrir/fechar
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [filtroPrincipal, setFiltroPrincipal] = useState<FiltroKey>('nenhum');
    
    // Estados
    const [bancoOrigemId, setBancoOrigemId] = useState<number | "">("");
    const [bancoDestinoId, setBancoDestinoId] = useState<number | "">("");
    const [dataInicio, setDataInicio] = useState<string>("");
    const [dataFim, setDataFim] = useState<string>("");
    
    // Funções de limpeza e mudança
    const clearAllFilters = () => {
        setBancoOrigemId("");
        setBancoDestinoId("");
        setDataInicio("");
        setDataFim("");
    };

    const handleFiltroPrincipalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const novoFiltro = e.target.value as FiltroKey;
        clearAllFilters(); 
        setFiltroPrincipal(novoFiltro);
    };

    const toggleFilter = () => {
        setIsFilterOpen(prev => !prev);
    };


   const baseUrl = "https://cedup-back-deploy.onrender.com";

const handleFilter = async () => {
    let url = "";

    try {
        if (filtroPrincipal === 'nenhum') {
            alert("Selecione um filtro antes de buscar.");
            return;
        }

        switch (filtroPrincipal) {
            case 'bancoOrigemId':
                if (!bancoOrigemId) return alert("Preencha o ID do Banco de Origem.");
                url = `${baseUrl}/conta/banco/origem/${bancoOrigemId}/transacao`;
                break;

            case 'bancoDestinoId':
                if (!bancoDestinoId) return alert("Preencha o ID do Banco de Destino.");
                url = `${baseUrl}/conta/banco/destino/${bancoDestinoId}/transacao`;
                break;

            case 'intervaloData':
                if (!dataInicio || !dataFim) 
                    return alert("Preencha as duas datas para o intervalo.");
                url = `${baseUrl}/conta/banco/transacao/${dataInicio}T00:00:00/${dataFim}T23:59:59`;
                break;
        }

        const response = await axios.get(url);
        console.log("Resultados:", response.data);

        alert(`Foram encontradas ${response.data.length} transações`);
        setIsFilterOpen(false);

    } catch (error) {
        console.error("Erro ao filtrar:", error);
        alert("Erro ao buscar filtros");
    }
};

    // mapeamento dos inputs 
    const renderFiltroInput = () => {
        switch (filtroPrincipal) {
            case 'bancoOrigemId':
                return (
                    <input
                        type="number"
                        placeholder="ID do Banco de Origem"
                        value={bancoOrigemId}
                        onChange={(e) => setBancoOrigemId(Number(e.target.value))}
                    />
                );

            case 'bancoDestinoId':
                return (
                    <input
                        type="number"
                        placeholder="ID do Banco de Destino"
                        value={bancoDestinoId}
                        onChange={(e) => setBancoDestinoId(Number(e.target.value))}
                    />
                );

            case 'intervaloData':
                return (
                    <>
                        <input 
                            type="date" 
                            name="Data Inicio"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                        />
                        <input
                            type="date"
                            placeholder="Data de Fim"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                        />
                    </>
                );
            default:
                return <p>Selecione um tipo de filtro acima.</p>;
        }
    };
    
    return (
        <div className="filtro-wrapper">
            
            <button 
                onClick={toggleFilter} 
            >
                {isFilterOpen ? 'Fechar Filtros' : 'Abrir Filtros'}
            </button>

            <div className={`filtro-container ${isFilterOpen ? 'open' : ''}`}>
                <select
                    value={filtroPrincipal}
                    onChange={handleFiltroPrincipalChange}
                >
                    <option value="nenhum">-- Escolha um Tipo de Filtro --</option>
                    <option value="bancoOrigemId">Banco Origem (ID)</option>
                    <option value="bancoDestinoId">Banco Destino (ID)</option>
                    <option value="intervaloData">Intervalo de Datas</option>
                </select>

                <div className="input">
                    {renderFiltroInput()}
                </div>

                <button onClick={handleFilter}>
                    Filtrar
                </button>
            </div>
        </div>
    );
};

export default FilterForm;
