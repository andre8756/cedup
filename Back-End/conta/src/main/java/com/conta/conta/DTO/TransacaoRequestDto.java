package com.conta.conta.DTO;

import java.time.LocalDateTime;

public class TransacaoRequestDto {

    private Long id;
    private Long contaId;
    private Long bancoOrigemId;
    private Long bancoDestinoId;
    private float valor;
    private String descricao;
    private LocalDateTime dataTransacao;

    public TransacaoRequestDto(Long id, Long contaId, Long bancoOrigemId, Long bancoDestinoId, float valor, String descricao, LocalDateTime dataTransacao) {
        this.id = id;
        this.contaId = contaId;
        this.bancoOrigemId = bancoOrigemId;
        this.bancoDestinoId = bancoDestinoId;
        this.valor = valor;
        this.descricao = descricao;
        this.dataTransacao = dataTransacao;
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getBancoOrigemId() { return bancoOrigemId; }
    public void setBancoOrigemId(Long bancoOrigemId) { this.bancoOrigemId = bancoOrigemId; }
    public Long getBancoDestinoId() { return bancoDestinoId; }
    public void setBancoDestinoId(Long bancoDestinoId) { this.bancoDestinoId = bancoDestinoId; }
    public float getValor() { return valor; }
    public void setValor(float valor) { this.valor = valor; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public Long getContaId() {
        return contaId;
    }
    public void setContaId(Long contaId) {
        this.contaId = contaId;
    }
    public LocalDateTime getDataTransacao() {
        return dataTransacao;
    }
    public void setDataTransacao(LocalDateTime dataTransacao) {
        this.dataTransacao = dataTransacao;
    }
}
