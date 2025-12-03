package com.conta.conta.Specification;

import com.conta.conta.DTO.TransacaoFiltro;
import com.conta.conta.Entity.Transacao;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class TransacaoSpecifications {

    public static Specification<Transacao> comFiltros(TransacaoFiltro filtro) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filtro por conta ID (origem OU destino)
            if (filtro.getContaId() != null) {
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.equal(root.get("contaOrigem").get("id"), filtro.getContaId()),
                        criteriaBuilder.equal(root.get("contaDestino").get("id"), filtro.getContaId())
                ));
            }

            // Filtro por conta origem específica
            if (filtro.getContaOrigemId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("contaOrigem").get("id"), filtro.getContaOrigemId()));
            }

            // Filtro por conta destino específica
            if (filtro.getContaDestinoId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("contaDestino").get("id"), filtro.getContaDestinoId()));
            }

            // Filtro por banco origem
            if (filtro.getBancoOrigemId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("bancoOrigem").get("id"), filtro.getBancoOrigemId()));
            }

            // Filtro por banco destino
            if (filtro.getBancoDestinoId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("bancoDestino").get("id"), filtro.getBancoDestinoId()));
            }

            // Filtro por múltiplos bancos (ORIGEM OU DESTINO)
            if (filtro.getBancosIds() != null && !filtro.getBancosIds().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                        root.get("bancoOrigem").get("id").in(filtro.getBancosIds()),
                        root.get("bancoDestino").get("id").in(filtro.getBancosIds())
                ));
            }

            // Filtro por múltiplas contas (ORIGEM OU DESTINO)
            if (filtro.getContasIds() != null && !filtro.getContasIds().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                        root.get("contaOrigem").get("id").in(filtro.getContasIds()),
                        root.get("contaDestino").get("id").in(filtro.getContasIds())
                ));
            }

            // Filtro por intervalo de datas
            if (filtro.getDataInicio() != null && filtro.getDataFim() != null) {
                predicates.add(criteriaBuilder.between(root.get("dataTransacao"), filtro.getDataInicio(), filtro.getDataFim()));
            } else if (filtro.getDataInicio() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("dataTransacao"), filtro.getDataInicio()));
            } else if (filtro.getDataFim() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("dataTransacao"), filtro.getDataFim()));
            }

            // Filtro por valor
            if (filtro.getValor() != null) {
                predicates.add(criteriaBuilder.equal(root.get("valor"), filtro.getValor()));
            }

            // Filtro por descrição (LIKE - busca parcial)
            if (filtro.getDescricao() != null && !filtro.getDescricao().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("descricao")),
                        "%" + filtro.getDescricao().toLowerCase() + "%"
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    // Métodos auxiliares para casos específicos
    public static Specification<Transacao> porContaId(Long contaId) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setContaId(contaId);
        return comFiltros(filtro);
    }

    public static Specification<Transacao> porContasIds(List<Long> contasIds) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setContasIds(contasIds);
        return comFiltros(filtro);
    }

    public static Specification<Transacao> porBancosIds(List<Long> bancosIds) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setBancosIds(bancosIds);
        return comFiltros(filtro);
    }

    public static Specification<Transacao> porDataBetween(LocalDateTime dataInicio, LocalDateTime dataFim) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setDataInicio(dataInicio);
        filtro.setDataFim(dataFim);
        return comFiltros(filtro);
    }

    public static Specification<Transacao> porContaIdEData(Long contaId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setContaId(contaId);
        filtro.setDataInicio(dataInicio);
        filtro.setDataFim(dataFim);
        return comFiltros(filtro);
    }

    public static Specification<Transacao> porBancoIdEData(Long bancoId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setBancosIds(List.of(bancoId));
        filtro.setDataInicio(dataInicio);
        filtro.setDataFim(dataFim);
        return comFiltros(filtro);
    }

}
