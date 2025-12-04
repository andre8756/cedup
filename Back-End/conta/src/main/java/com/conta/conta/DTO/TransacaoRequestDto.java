package com.conta.conta.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class TransacaoRequestDto {

    @NotNull(message = "O valor é obrigatório")
    @PositiveOrZero(message = "O valor não pode ser negativo")
    private Float valor;

    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;

    @NotBlank(message = "A chave PIX do banco de origem é obrigatória")
    private String chavePixBancoOrigem;

    @NotBlank(message = "A chave PIX do banco de destino é obrigatória")
    private String chavePixBancoDestino;

    // =====================
    // GETTERS & SETTERS
    // =====================

    public Float getValor() {
        return valor;
    }

    public void setValor(Float valor) {
        this.valor = valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getChavePixBancoOrigem() {
        return chavePixBancoOrigem;
    }

    public void setChavePixBancoOrigem(String chavePixBancoOrigem) {
        this.chavePixBancoOrigem = chavePixBancoOrigem;
    }

    public String getChavePixBancoDestino() {
        return chavePixBancoDestino;
    }

    public void setChavePixBancoDestino(String chavePixBancoDestino) {
        this.chavePixBancoDestino = chavePixBancoDestino;
    }
}
