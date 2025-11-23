package com.conta.conta.DTO;

public class BancoUpdateRequest {

    private String titular;
    private String nomeBanco;
    private Float saldo;
    private String chavePix;
    private Boolean status;
    private Boolean permitirTransacao; // << ADICIONADO
    private String bancoUrl;           // << ADICIONADO

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

    public Float getSaldo() {
        return saldo;
    }

    public void setSaldo(Float saldo) {
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
}
