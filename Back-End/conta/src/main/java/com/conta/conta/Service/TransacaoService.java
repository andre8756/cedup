package com.conta.conta.Service;

import com.conta.conta.DTO.TransacaoFiltro;
import com.conta.conta.DTO.TransacaoResponseDto;
import com.conta.conta.Entity.Banco;
import com.conta.conta.Entity.Transacao;
import com.conta.conta.Repository.TransacaoRepository;
import com.conta.conta.Specification.TransacaoSpecifications;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransacaoService {

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private ContaService contaService;

    @Autowired
    private BancoService bancoService;

    // ================================
    // LISTAGEM PRINCIPAL COM FILTROS
    // ================================
    public List<TransacaoResponseDto> listarComFiltros(TransacaoFiltro filtro) {

        if (filtro.getContaId() == null && filtro.getContasIds() == null) {
            Long contaIdLogada = contaService.buscarContaLogada().getId();
            filtro.setContaId(contaIdLogada);
        }

        Specification<Transacao> spec = TransacaoSpecifications.comFiltros(filtro);
        return convertToListDTO(transacaoRepository.findAll(spec));
    }

    public List<TransacaoResponseDto> listarPorContaLogadaEData(LocalDateTime dataInicio, LocalDateTime dataFim) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setContaId(contaService.buscarContaLogada().getId());
        filtro.setDataInicio(dataInicio);
        filtro.setDataFim(dataFim);
        return listarComFiltros(filtro);
    }

    public List<TransacaoResponseDto> listarPorBancoIdEData(Long bancoId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setBancosIds(List.of(bancoId));
        filtro.setDataInicio(dataInicio);
        filtro.setDataFim(dataFim);
        return listarComFiltros(filtro);
    }

    // ================================
    // CÁLCULOS DE RECEITA E DESPESA
    // ================================
    public float calcularReceitaMensal() {
        Long contaIdLogada = contaService.buscarContaLogada().getId();

        LocalDateTime inicioMes = LocalDateTime.now().withDayOfMonth(1)
                .withHour(0).withMinute(0).withSecond(0);

        LocalDateTime fimMes = LocalDateTime.now().withDayOfMonth(LocalDateTime.now().toLocalDate().lengthOfMonth())
                .withHour(23).withMinute(59).withSecond(59);

        return transacaoRepository.somaReceitaMensal(contaIdLogada, inicioMes, fimMes);
    }

    public float calcularDespesaMensal() {
        Long contaIdLogada = contaService.buscarContaLogada().getId();

        LocalDateTime inicioMes = LocalDateTime.now().withDayOfMonth(1)
                .withHour(0).withMinute(0).withSecond(0);

        LocalDateTime fimMes = LocalDateTime.now().withDayOfMonth(LocalDateTime.now().toLocalDate().lengthOfMonth())
                .withHour(23).withMinute(59).withSecond(59);

        return transacaoRepository.somaDespesaMensal(contaIdLogada, inicioMes, fimMes);
    }

    // ================================
    // PROCESSAR TRANSFERÊNCIA
    // ================================
    @Transactional
    public TransacaoResponseDto processarTransacao(String bancoOrigemChavePix, String bancoDestinoChavePix, Transacao transacao) {

        Banco bancoOrigem = bancoService.buscarEntidadePorChavePix(bancoOrigemChavePix);
        Banco bancoDestino = bancoService.buscarEntidadePorChavePix(bancoDestinoChavePix);

        if (bancoOrigem.getSaldo() < transacao.getValor()) {
            throw new RuntimeException("Saldo insuficiente no banco de origem");
        }

        if (!bancoOrigem.isPermitirTransacao()) {
            throw new RuntimeException("O banco não permite fazer transferências");
        }

        bancoOrigem.setSaldo(bancoOrigem.getSaldo() - transacao.getValor());
        bancoDestino.setSaldo(bancoDestino.getSaldo() + transacao.getValor());

        Transacao transacaoFinal = new Transacao(
                transacao.getValor(),
                transacao.getDescricao(),
                bancoOrigem.getConta(),
                bancoOrigem,
                bancoDestino.getConta(),
                bancoDestino
        );

        Transacao transacaoSalva = transacaoRepository.save(transacaoFinal);

        // salvar atualizações de saldo
        bancoService.atualizarBanco(bancoOrigem);
        bancoService.atualizarBanco(bancoDestino);

        contaService.atualizarSaldoTotal(bancoOrigem.getConta().getId());
        contaService.atualizarSaldoTotal(bancoDestino.getConta().getId());

        return convertToDTO(transacaoSalva);
    }

    // ================================
    // MÉTODOS DE LISTAGEM
    // ================================
    public List<TransacaoResponseDto> listarPorContaLogada() {
        Long contaIdLogada = contaService.buscarContaLogada().getId();
        return convertToListDTO(transacaoRepository.findByContaId(contaIdLogada));
    }

    public Optional<Transacao> buscarPorId(Long id) {
        return transacaoRepository.findById(id);
    }

    // ================================
    // REMOVER TRANSAÇÃO
    // ================================
    @Transactional
    public void removerPorId(Long id) {
        Transacao transacao = transacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transação não encontrada"));

        transacaoRepository.deleteById(id);

        contaService.atualizarSaldoTotal(transacao.getBancoOrigem().getConta().getId());
        contaService.atualizarSaldoTotal(transacao.getBancoDestino().getConta().getId());
    }

    // ================================
    // CONVERSORES DTO
    // ================================
    private TransacaoResponseDto convertToDTO(Transacao transacao) {
        if (transacao == null) return null;

        return new TransacaoResponseDto(
                transacao.getId(),
                transacao.getContaOrigem().getId(),
                transacao.getBancoOrigem().getChavePix(),
                transacao.getBancoOrigem().getNomeBanco(),
                transacao.getBancoOrigem().getTitular(),
                transacao.getContaDestino().getId(),
                transacao.getBancoDestino().getChavePix(),
                transacao.getBancoDestino().getNomeBanco(),
                transacao.getBancoDestino().getTitular(),
                transacao.getValor(),
                transacao.getDescricao(),
                transacao.getDataTransacao()
        );
    }

    private List<TransacaoResponseDto> convertToListDTO(List<Transacao> transacoes) {
        return transacoes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
