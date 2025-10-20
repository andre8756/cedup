package com.conta.conta.DTO;

import java.time.LocalDateTime;

public class TransacaoRequestDto {

    private Long id;
    private Long contaOrigemId;
    private Long bancoOrigemId;
    private Long contaDestinoId;
    private Long bancoDestinoId;
    private float valor;
    private String descricao;
    private LocalDateTime dataTransacao;

    public TransacaoRequestDto(Long id, Long contaOrigemId, Long bancoOrigemId, Long contaDestinoId, Long bancoDestinoId, float valor, String descricao, LocalDateTime dataTransacao) {
        this.id = id;
        this.contaOrigemId = contaOrigemId;
        this.bancoOrigemId = bancoOrigemId;
        this.contaDestinoId = contaDestinoId;
        this.bancoDestinoId = bancoDestinoId;
        this.valor = valor;
        this.descricao = descricao;
        this.dataTransacao = dataTransacao;
    }

    public TransacaoRequestDto(Long id, Long contaOrigemId, Long bancoOrigemId, float valor, String descricao, LocalDateTime dataTransacao) {
        this.id = id;
        this.contaOrigemId = contaOrigemId;
        this.bancoOrigemId = bancoOrigemId;
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
    public Long getContaOrigemId() {
        return contaOrigemId;
    }
    public void setContaOrigemId(Long contaId) {
        this.contaOrigemId = contaId;
    }
    public Long getContaDestinoId() {
        return contaDestinoId;
    }
    public void setContaDestinoId(Long contaId) {
        this.contaDestinoId = contaId;
    }
    public LocalDateTime getDataTransacao() {
        return dataTransacao;
    }
    public void setDataTransacao(LocalDateTime dataTransacao) {
        this.dataTransacao = dataTransacao;
    }
}
