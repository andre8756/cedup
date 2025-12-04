import React, { useState } from "react";
import api from "../../config/apiClient";
import { API_ENDPOINTS } from "../../config/api";
import "./FiltroTransacoes.css";

// Definição dos tipos de filtro conforme README
type FiltroKey = 
    | 'nenhum' 
    | 'contaId'
    | 'contaOrigemId'
    | 'contaDestinoId'
    | 'bancoOrigemId' 
    | 'bancoDestinoId'
    | 'dataInicio'
    | 'intervaloData'
    | 'valor'
    | 'descricao'; 

interface Transacao {
    id: number;
    bancoDestino?: string;
    descricao?: string;
    dataTransacao: string;
    valor: number;
}

interface FiltroTransacoesProps {
    onFilterApplied?: () => void;
    onFilteredData?: (data: Transacao[]) => void;
}

const FilterForm: React.FC<FiltroTransacoesProps> = ({ onFilterApplied, onFilteredData }) => {
    // ESTADO DE VISIBILIDADE para o botão de abrir/fechar
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [filtroPrincipal, setFiltroPrincipal] = useState<FiltroKey>('nenhum');
    
    // Estados para os filtros conforme README
    const [contaId, setContaId] = useState<number | "">("");
    const [contaOrigemId, setContaOrigemId] = useState<number | "">("");
    const [contaDestinoId, setContaDestinoId] = useState<number | "">("");
    const [bancoOrigemId, setBancoOrigemId] = useState<number | "">("");
    const [bancoDestinoId, setBancoDestinoId] = useState<number | "">("");
    const [dataInicio, setDataInicio] = useState<string>("");
    const [dataFim, setDataFim] = useState<string>("");
    const [valor, setValor] = useState<number | "">("");
    const [descricao, setDescricao] = useState<string>("");
    
    // Funções de limpeza e mudança
    const clearAllFilters = () => {
        setContaId("");
        setContaOrigemId("");
        setContaDestinoId("");
        setBancoOrigemId("");
        setBancoDestinoId("");
        setDataInicio("");
        setDataFim("");
        setValor("");
        setDescricao("");
    };

    const handleFiltroPrincipalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const novoFiltro = e.target.value as FiltroKey;
        clearAllFilters(); 
        setFiltroPrincipal(novoFiltro);
    };

    const toggleFilter = () => {
        setIsFilterOpen(prev => !prev);
    };


const handleFilter = async () => {
    try {
        // Constrói os parâmetros de query conforme README
        const params: Record<string, string> = {};

        // Adiciona os filtros conforme o tipo selecionado
        switch (filtroPrincipal) {
            case 'contaId':
                if (!contaId) {
                    alert("Preencha o ID da Conta.");
                    return;
                }
                params.contaId = contaId.toString();
                break;

            case 'contaOrigemId':
                if (!contaOrigemId) {
                    alert("Preencha o ID da Conta de Origem.");
                    return;
                }
                params.contaOrigemId = contaOrigemId.toString();
                break;

            case 'contaDestinoId':
                if (!contaDestinoId) {
                    alert("Preencha o ID da Conta de Destino.");
                    return;
                }
                params.contaDestinoId = contaDestinoId.toString();
                break;

            case 'bancoOrigemId':
                if (!bancoOrigemId) {
                    alert("Preencha o ID do Banco de Origem.");
                    return;
                }
                params.bancoOrigemId = bancoOrigemId.toString();
                break;

            case 'bancoDestinoId':
                if (!bancoDestinoId) {
                    alert("Preencha o ID do Banco de Destino.");
                    return;
                }
                params.bancoDestinoId = bancoDestinoId.toString();
                break;

            case 'intervaloData':
                if (!dataInicio || !dataFim) {
                    alert("Preencha as duas datas para o intervalo.");
                    return;
                }
                // Formato: 2024-01-01T00:00:00 conforme README
                params.dataInicio = `${dataInicio}T00:00:00`;
                params.dataFim = `${dataFim}T23:59:59`;
                break;

            case 'dataInicio':
                if (!dataInicio) {
                    alert("Preencha a data de início.");
                    return;
                }
                params.dataInicio = `${dataInicio}T00:00:00`;
                if (dataFim) {
                    params.dataFim = `${dataFim}T23:59:59`;
                }
                break;

            case 'valor':
                if (typeof valor !== "number" || Number.isNaN(valor)) {
                    alert("Preencha o valor da transação.");
                    return;
                }
                params.valor = valor.toString();
                break;

            case 'descricao':
                if (!descricao || descricao.trim() === "") {
                    alert("Preencha a descrição.");
                    return;
                }
                params.descricao = descricao.trim();
                break;

            case 'nenhum':
                // Sem filtro específico, lista todas as transações
                break;

            default:
                alert("Selecione um tipo de filtro antes de buscar.");
                return;
        }

        // Constrói a URL com query parameters
        const queryString = new URLSearchParams(params).toString();
        const url = queryString 
            ? `${API_ENDPOINTS.BANCO.LISTAR_COM_FILTROS}?${queryString}`
            : API_ENDPOINTS.BANCO.LISTAR_COM_FILTROS;

        const response = await api.get(url);
        console.log("Resultados:", response.data);

        // Passa os dados filtrados para a página pai
        if (onFilteredData && response.data) {
            onFilteredData(response.data);
        }

        // Se houver callback de atualização, também chama
        if (onFilterApplied) {
            onFilterApplied();
        }

        const transacoesCount = Array.isArray(response.data) ? response.data.length : 0;
        alert(`Foram encontradas ${transacoesCount} transação(ões)`);
        setIsFilterOpen(false);

    } catch (error: any) {
        console.error("Erro ao filtrar:", error);
        
        // Tratamento de erros
        if (error.response) {
            const status = error.response.status;
            if (status === 401 || status === 403) {
                alert("Erro de autenticação. Faça login novamente.");
            } else if (status === 400) {
                alert("Erro nos filtros. Verifique os dados informados.");
            } else if (status >= 500) {
                alert("Erro interno do servidor. Tente novamente mais tarde.");
            } else {
                alert(`Erro ao buscar transações (Status ${status}).`);
            }
        } else {
            alert("Erro de conexão com o servidor. Verifique sua conexão com a internet.");
        }
    }
};

    // mapeamento dos inputs conforme README
    const renderFiltroInput = () => {
        switch (filtroPrincipal) {
            case 'contaId':
                return (
                    <input
                        type="number"
                        placeholder="ID da Conta"
                        value={contaId}
                        onChange={(e) => setContaId(e.target.value ? Number(e.target.value) : "")}
                        min="1"
                    />
                );

            case 'contaOrigemId':
                return (
                    <input
                        type="number"
                        placeholder="ID da Conta de Origem"
                        value={contaOrigemId}
                        onChange={(e) => setContaOrigemId(e.target.value ? Number(e.target.value) : "")}
                        min="1"
                    />
                );

            case 'contaDestinoId':
                return (
                    <input
                        type="number"
                        placeholder="ID da Conta de Destino"
                        value={contaDestinoId}
                        onChange={(e) => setContaDestinoId(e.target.value ? Number(e.target.value) : "")}
                        min="1"
                    />
                );

            case 'bancoOrigemId':
                return (
                    <input
                        type="number"
                        placeholder="ID do Banco de Origem"
                        value={bancoOrigemId}
                        onChange={(e) => setBancoOrigemId(e.target.value ? Number(e.target.value) : "")}
                        min="1"
                    />
                );

            case 'bancoDestinoId':
                return (
                    <input
                        type="number"
                        placeholder="ID do Banco de Destino"
                        value={bancoDestinoId}
                        onChange={(e) => setBancoDestinoId(e.target.value ? Number(e.target.value) : "")}
                        min="1"
                    />
                );

            case 'intervaloData':
                return (
                    <>
                        <label>Data Início:</label>
                        <input 
                            type="date" 
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                        />
                        <label>Data Fim:</label>
                        <input
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                        />
                    </>
                );

            case 'dataInicio':
                return (
                    <>
                        <label>Data Início:</label>
                        <input 
                            type="date" 
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                        />
                        <label>Data Fim (opcional):</label>
                        <input
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                        />
                    </>
                );

            case 'valor':
                return (
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Valor da Transação"
                        value={valor}
                        onChange={(e) => setValor(e.target.value ? parseFloat(e.target.value) : "")}
                        min="0"
                    />
                );

            case 'descricao':
                return (
                    <input
                        type="text"
                        placeholder="Descrição da Transação"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                );

            case 'nenhum':
                return <p>Listar todas as transações (sem filtro específico).</p>;

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
                    <option value="contaId">ID da Conta</option>
                    <option value="contaOrigemId">ID da Conta de Origem</option>
                    <option value="contaDestinoId">ID da Conta de Destino</option>
                    <option value="bancoOrigemId">ID do Banco de Origem</option>
                    <option value="bancoDestinoId">ID do Banco de Destino</option>
                    <option value="intervaloData">Intervalo de Datas</option>
                    <option value="dataInicio">Data de Início</option>
                    <option value="valor">Valor da Transação</option>
                    <option value="descricao">Descrição</option>
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