package com.conta.conta.DTO;

import com.conta.conta.Entity.Banco;
import jakarta.validation.constraints.*;

public class BancoRequest {

    @NotBlank(message = "O titular é obrigatório")
    private String titular;

    @NotBlank(message = "O nome do banco é obrigatório")
    private String nomeBanco;

    @NotNull(message = "O saldo é obrigatório")
    @PositiveOrZero(message = "O saldo não pode ser negativo")
    private Double saldo;

    @NotBlank(message = "A chave PIX é obrigatória")
    @Pattern(
            regexp = "^[\\w@.\\-+]+$",
            message = "Formato de chave PIX inválido"
    )
    private String chavePix;

    private Boolean status; // opcional, permite banco ativo/inativo
    private Boolean permitirTransacao; // para habilitar PIX, TED, etc.
    private String bancoUrl; // ícone/logo do banco

    // ===== GETTERS & SETTERS =====

    public String getTitular() {
        return titular;
    }

    public void setTitular(String titular) {
        this.titular = titular;
    }

    public String getNomeBanco() {
        return nomeBanco;
    }

    public void setNomeBanco(String nomeBanco) {
        this.nomeBanco = nomeBanco;
    }

    public Double getSaldo() {
        return saldo;
    }

    public void setSaldo(Double saldo) {
        this.saldo = saldo;
    }

    public String getChavePix() {
        return chavePix;
    }

    public void setChavePix(String chavePix) {
        this.chavePix = chavePix;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Boolean getPermitirTransacao() {
        return permitirTransacao;
    }

    public void setPermitirTransacao(Boolean permitirTransacao) {
        this.permitirTransacao = permitirTransacao;
    }

    public String getBancoUrl() {
        return bancoUrl;
    }

    public void setBancoUrl(String bancoUrl) {
        this.bancoUrl = bancoUrl;
    }

    // ===== CONVERSÃO PARA ENTIDADE =====
    public Banco toEntity() {
        Banco banco = new Banco();
        banco.setTitular(this.titular);
        banco.setNomeBanco(this.nomeBanco);
        banco.setSaldo(this.saldo.floatValue());
        banco.setChavePix(this.chavePix);

        if (this.status != null) {
            banco.setStatus(this.status);
        }
        if (this.permitirTransacao != null) {
            banco.setPermitirTransacao(this.permitirTransacao);
        }
        if (this.bancoUrl != null) {
            banco.setBancoUrl(this.bancoUrl);
        }

        return banco;
    }
}
