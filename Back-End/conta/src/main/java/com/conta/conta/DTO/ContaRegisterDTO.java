package com.conta.conta.DTO;

import com.conta.conta.Enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ContaRegisterDTO {

    @NotBlank(message = "O nome do titular é obrigatório.")
    private String titular;

    @NotBlank(message = "O CPF é obrigatório.")
    @Pattern(regexp = "\\d{11}", message = "O CPF deve conter exatamente 11 dígitos numéricos.")
    private String cpf;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "E-mail inválido.")
    private String email;

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 8, message = "A senha deve conter pelo menos 8 caracteres.")
    private String senha;

    @NotBlank(message = "O telefone é obrigatório.")
    @Pattern(regexp = "\\d{10,11}", message = "O telefone deve conter 10 ou 11 dígitos numéricos.")
    private String telefone;

    private UserRole role = UserRole.USER; // padrão

    // ===========================
    // Getters e setters
    // ===========================

    public String getTitular() {
        return titular;
    }

    public void setTitular(String titular) {
        this.titular = titular != null ? titular.trim() : null;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        // Remove qualquer caractere que não seja dígito
        this.cpf = cpf != null ? cpf.replaceAll("\\D", "") : null;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email != null ? email.trim() : null;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        // Remove qualquer caractere que não seja dígito
        this.telefone = telefone != null ? telefone.replaceAll("\\D", "") : null;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}