package com.conta.conta.DTO;

import com.conta.conta.Entity.Banco;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class BancoUpdateResponse {

    private Long id;
    private String titular;
    private String nomeBanco;
    private float saldo;
    private String chavePix;
    private boolean status;
    private LocalDateTime dataCadastro;

    public BancoUpdateResponse() {}

    public BancoUpdateResponse(Long id, String titular, String nomeBanco, float saldo,
                               String chavePix, boolean status, LocalDateTime dataCadastro) {
        this.id = id;
        this.titular = titular;
        this.nomeBanco = nomeBanco;
        this.saldo = saldo;
        this.chavePix = chavePix;
        this.status = status;
        this.dataCadastro = dataCadastro;
    }

    public static BancoUpdateResponse fromEntity(Banco banco) {
        return new BancoUpdateResponse(
                banco.getId(),
                banco.getTitular(),
                banco.getNomeBanco(),
                banco.getSaldo(),
                banco.getChavePix(),
                banco.isStatus(),
                banco.getDataCadastro()
        );
    }

    public Long getId() {
        return id;
    }

    public String getTitular() {
        return titular;
    }

    public String getNomeBanco() {
        return nomeBanco;
    }

    public float getSaldo() {
        return saldo;
    }

    public String getChavePix() {
        return chavePix;
    }

    public boolean isStatus() {
        return status;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }
}
