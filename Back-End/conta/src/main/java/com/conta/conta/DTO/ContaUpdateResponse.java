package com.conta.conta.DTO;

import com.conta.conta.Enums.UserRole;
import java.time.LocalDateTime;

public class ContaUpdateResponse {

    private String titular;
    private String email;
    private String telefone;
    private Boolean status;

    public ContaUpdateResponse(String titular, String email, String telefone, Boolean status) {
        this.titular = titular;
        this.email = email;
        this.telefone = telefone;
        this.status = status;
    }


    public ContaUpdateResponse() {
    }

    // Getters e Setters
    public String getTitular() {
        return titular;
    }

    public void setTitular(String titular) {
        this.titular = titular;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

}
