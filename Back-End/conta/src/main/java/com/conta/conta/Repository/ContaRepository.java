package com.conta.conta.Repository;

import com.conta.conta.Entity.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContaRepository extends JpaRepository<Conta, Long> {
    Optional<Conta> findByEmail(String email);
    Optional<Conta> findByCpf(String cpf);
    Optional<Conta> findByTelefone(String telefone);
}
