package com.conta.conta.DTO;

import com.conta.conta.Entity.Banco;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class BancoResponse {

    private Long id;
    private String titular;
    private String nomeBanco;
    private Double saldo;
    private String chavePix;
    private boolean status;
    private boolean permitirTransacao;
    private String bancoUrl;

    @JsonFormat(pattern = "dd/MM/yyyy - HH:mm")
    private LocalDateTime dataCadastro;

    // Construtor privado (imutável)
    private BancoResponse(Long id, String titular, String nomeBanco, Double saldo,
                          String chavePix, boolean status, boolean permitirTransacao,
                          String bancoUrl, LocalDateTime dataCadastro) {
        this.id = id;
        this.titular = titular;
        this.nomeBanco = nomeBanco;
        this.saldo = saldo;
        this.chavePix = chavePix;
        this.status = status;
        this.permitirTransacao = permitirTransacao;
        this.bancoUrl = bancoUrl;
        this.dataCadastro = dataCadastro;
    }

    // ============================
    // Convert Entity to DTO
    // ============================
    public static BancoResponse fromEntity(Banco banco) {
        return new BancoResponse(
                banco.getId(),
                banco.getTitular(),
                banco.getNomeBanco(),
                (double) banco.getSaldo(),
                banco.getChavePix(),
                banco.isStatus(),
                banco.isPermitirTransacao(),
                banco.getBancoUrl(),
                banco.getDataCadastro()
        );
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getTitular() {
        return titular;
    }

    public String getNomeBanco() {
        return nomeBanco;
    }

    public Double getSaldo() {
        return saldo;
    }

    public String getChavePix() {
        return chavePix;
    }

    public boolean isStatus() {
        return status;
    }

    public boolean isPermitirTransacao() {
        return permitirTransacao;
    }

    public String getBancoUrl() {
        return bancoUrl;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }
}
