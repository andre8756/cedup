package com.conta.conta.Repository;

import com.conta.conta.Entity.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    List<Transacao> findByContaId(Long contaId);

    @Query("SELECT t FROM Transacao t WHERE t.bancoOrigem.id = :bancoId OR t.bancoDestino.id = :bancoId")
    List<Transacao> findByBancoOrigemIdOrBancoDestinoId(@Param("bancoId") Long bancoId,
                                                        @Param("bancoId") Long bancoId2);

    List<Transacao> findByDataTransacaoBetween(LocalDateTime inicio, LocalDateTime fim);
}
