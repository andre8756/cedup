package com.conta.conta.Repository;

import com.conta.conta.Entity.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    // Listar transações por conta ID
    List<Transacao> findByContaId(Long contaId);

    // Listar transações por banco de origem
    List<Transacao> findByBancoOrigemId(Long bancoOrigemId);

    // Listar transações por banco de destino
    List<Transacao> findByBancoDestinoId(Long bancoDestinoId);

    // Listar transações por intervalo de datas
    @Query("SELECT t FROM Transacao t WHERE t.dataTransacao BETWEEN :dataInicio AND :dataFim")
    List<Transacao> findByDataTransacaoBetween(
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim
    );

    // Listar transações por conta ID e intervalo de datas
    @Query("SELECT t FROM Transacao t WHERE t.conta.id = :contaId AND t.dataTransacao BETWEEN :dataInicio AND :dataFim")
    List<Transacao> findByContaIdAndDataTransacaoBetween(
            @Param("contaId") Long contaId,
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim
    );

}
