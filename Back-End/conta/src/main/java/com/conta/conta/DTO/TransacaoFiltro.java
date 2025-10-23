package com.conta.conta.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class TransacaoFiltro {
    private Long contaId;
    private Long contaOrigemId;
    private Long contaDestinoId;
    private Long bancoOrigemId;
    private Long bancoDestinoId;
    private List<Long> bancosIds;
    private List<Long> contasIds;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private Float valor;
    private String descricao;

    // Getters e Setters
    public Long getContaId() { return contaId; }
    public void setContaId(Long contaId) { this.contaId = contaId; }

    public Long getContaOrigemId() { return contaOrigemId; }
    public void setContaOrigemId(Long contaOrigemId) { this.contaOrigemId = contaOrigemId; }

    public Long getContaDestinoId() { return contaDestinoId; }
    public void setContaDestinoId(Long contaDestinoId) { this.contaDestinoId = contaDestinoId; }

    public Long getBancoOrigemId() { return bancoOrigemId; }
    public void setBancoOrigemId(Long bancoOrigemId) { this.bancoOrigemId = bancoOrigemId; }

    public Long getBancoDestinoId() { return bancoDestinoId; }
    public void setBancoDestinoId(Long bancoDestinoId) { this.bancoDestinoId = bancoDestinoId; }

    public List<Long> getBancosIds() { return bancosIds; }
    public void setBancosIds(List<Long> bancosIds) { this.bancosIds = bancosIds; }

    public List<Long> getContasIds() { return contasIds; }
    public void setContasIds(List<Long> contasIds) { this.contasIds = contasIds; }

    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }

    public LocalDateTime getDataFim() { return dataFim; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }

    public Float getValor() { return valor; }
    public void setValor(Float valor) { this.valor = valor; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}