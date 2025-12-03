package com.conta.conta.DTO;

import com.conta.conta.Entity.Banco;

import java.time.LocalDateTime;
import java.util.List;

public class ContaResponse {

    private String titular;
    private String cpf;
    private String email;
    private String telefone;
    private float saldoTotal;
    private Boolean status;
    private LocalDateTime dataCadastro;
    private String avatarUrl;
    private List<Banco> bancos;

    // Construtor completo
    public ContaResponse(String titular, String cpf, String email, String telefone,
                         float saldoTotal, Boolean status, LocalDateTime dataCadastro,
                         String avatarUrl, List<Banco> bancos) {
        this.titular = titular;
        this.cpf = cpf;
        this.email = email;
        this.telefone = telefone;
        this.saldoTotal = saldoTotal;
        this.status = status;
        this.dataCadastro = dataCadastro;
        this.avatarUrl = avatarUrl;
        this.bancos = bancos;
    }

    // Getters
    public String getTitular() { return titular; }
    public String getCpf() { return cpf; }
    public String getEmail() { return email; }
    public String getTelefone() { return telefone; }
    public float getSaldoTotal() { return saldoTotal; }
    public Boolean getStatus() { return status; }
    public LocalDateTime getDataCadastro() { return dataCadastro; }
    public String getAvatarUrl() { return avatarUrl; }
    public List<Banco> getBancos() { return bancos; }

    // Converte a entidade para dto
    public static ContaResponse fromEntity(com.conta.conta.Entity.Conta conta) {
        return new ContaResponse(
                conta.getTitular(),
                conta.getCpf(),
                conta.getEmail(),
                conta.getTelefone(),
                conta.getSaldoTotal(),
                conta.getStatus(),
                conta.getDataCadastro(),
                conta.getAvatarUrl(),
                conta.getBancos()
        );
    }
}
