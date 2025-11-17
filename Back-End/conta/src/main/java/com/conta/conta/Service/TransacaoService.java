package com.conta.conta.Service;

import com.conta.conta.DTO.TransacaoFiltro;
import com.conta.conta.DTO.TransacaoRequestDto;
import com.conta.conta.Entity.Banco;
import com.conta.conta.Entity.Conta;
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
    // Metodo principal com filtros
    // ================================
    public List<TransacaoRequestDto> listarComFiltros(TransacaoFiltro filtro) {
        Specification<Transacao> spec = TransacaoSpecifications.comFiltros(filtro);
        return convertToListDTO(transacaoRepository.findAll(spec));
    }

    public List<TransacaoRequestDto> listarPorContaIdNew(Long contaId) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setContaId(contaId);
        return listarComFiltros(filtro);
    }

    public List<TransacaoRequestDto> listarPorContasIds(List<Long> contasIds) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setContasIds(contasIds);
        return listarComFiltros(filtro);
    }

    public List<TransacaoRequestDto> listarPorBancosIds(List<Long> bancosIds) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setBancosIds(bancosIds);
        return listarComFiltros(filtro);
    }

    public List<TransacaoRequestDto> listarPorContaIdEDataNew(Long contaId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setContaId(contaId);
        filtro.setDataInicio(dataInicio);
        filtro.setDataFim(dataFim);
        return listarComFiltros(filtro);
    }

    public List<TransacaoRequestDto> listarPorBancoIdEData(Long bancoId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setBancosIds(List.of(bancoId));
        filtro.setDataInicio(dataInicio);
        filtro.setDataFim(dataFim);
        return listarComFiltros(filtro);
    }

    // ================================
    // CÁLCULOS DE RECEITA E DESPESA
    // ================================
    public float calcularReceitaMensal(Long contaId) {
        LocalDateTime inicioMes = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime fimMes = LocalDateTime.now().withDayOfMonth(LocalDateTime.now().toLocalDate().lengthOfMonth())
                .withHour(23).withMinute(59).withSecond(59);

        return transacaoRepository.somaReceitaMensal(contaId, inicioMes, fimMes);
    }

    public float calcularDespesaMensal(Long contaId) {
        LocalDateTime inicioMes = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime fimMes = LocalDateTime.now().withDayOfMonth(LocalDateTime.now().toLocalDate().lengthOfMonth())
                .withHour(23).withMinute(59).withSecond(59);

        return transacaoRepository.somaDespesaMensal(contaId, inicioMes, fimMes);
    }

    // ================================
    // PROCESSAR TRANSFERÊNCIA
    // ================================
    @Transactional
    public TransacaoRequestDto processarTransacao(String bancoOrigemChavePix, String bancoDestinoChavePix, Transacao transacao) {
        Banco bancoOrigem = bancoService.buscarPorChavePix(bancoOrigemChavePix)
                .orElseThrow(() -> new EntityNotFoundException("Banco de origem não encontrado"));
        Banco bancoDestino = bancoService.buscarPorChavePix(bancoDestinoChavePix)
                .orElseThrow(() -> new EntityNotFoundException("Banco de destino não encontrado"));

        // Verificar saldo do banco de origem
        if (bancoOrigem.getSaldo() < transacao.getValor()) {
            throw new RuntimeException("Saldo insuficiente no banco de origem");
        }

        // Atualizar saldos
        bancoOrigem.setSaldo(bancoOrigem.getSaldo() - transacao.getValor());
        bancoDestino.setSaldo(bancoDestino.getSaldo() + transacao.getValor());

        // Criar e salvar a transação
        Transacao transacaoFinal = new Transacao(
                transacao.getValor(),
                transacao.getDescricao(),
                bancoOrigem.getConta(),
                bancoOrigem,
                bancoDestino.getConta(),
                bancoDestino
        );

        Transacao transacaoSalva = transacaoRepository.save(transacaoFinal);

        // Salvar alterações nos bancos
        bancoService.salvar(bancoOrigem);
        bancoService.salvar(bancoDestino);

        // Atualizar saldo total das contas após salvar a transação
        contaService.atualizarSaldoTotal(bancoOrigem.getConta().getId());
        contaService.atualizarSaldoTotal(bancoDestino.getConta().getId());

        return convertToDTO(transacaoSalva);
    }

    // ================================
    // MÉTODOS DE LISTAGEM
    // ================================
    public List<TransacaoRequestDto> listarTransacoes() {
        return convertToListDTO(transacaoRepository.findAll());
    }

    public Optional<Transacao> buscarPorId(Long id) {
        return transacaoRepository.findById(id);
    }

    public List<TransacaoRequestDto> listarPorContaOrigemId(Long contaId) {
        return convertToListDTO(transacaoRepository.findByContaOrigemId(contaId));
    }

    public List<TransacaoRequestDto> listarPorContaDestinoId(Long contaId) {
        return convertToListDTO(transacaoRepository.findByContaDestinoId(contaId));
    }

    public List<TransacaoRequestDto> listarPorContaId(Long contaId) {
        return convertToListDTO(transacaoRepository.findByContaId(contaId));
    }

    public List<TransacaoRequestDto> listarPorBancoOrigem(Long bancoOrigemId) {
        return convertToListDTO(transacaoRepository.findByBancoOrigemId(bancoOrigemId));
    }

    public List<TransacaoRequestDto> listarPorBancoDestino(Long bancoDestinoId) {
        return convertToListDTO(transacaoRepository.findByBancoDestinoId(bancoDestinoId));
    }

    public List<TransacaoRequestDto> listarPorData(LocalDateTime dataInicio, LocalDateTime dataFim) {
        return convertToListDTO(transacaoRepository.findByDataTransacaoBetween(dataInicio, dataFim));
    }

    public List<TransacaoRequestDto> listarPorContaIdEData(Long contaId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        return convertToListDTO(transacaoRepository.findByContaIdAndDataTransacaoBetween(contaId, dataInicio, dataFim));
    }

    // ================================
    // REMOVER TRANSAÇÃO
    // ================================
    @Transactional
    public void removerPorId(Long id){
        Transacao transacao = transacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transação não encontrada"));

        transacaoRepository.deleteById(id);

        // Atualizar o saldo total das contas após deletar a transação
        contaService.atualizarSaldoTotal(transacao.getBancoOrigem().getConta().getId());
        contaService.atualizarSaldoTotal(transacao.getBancoDestino().getConta().getId());
    }

    // ================================
    // CONVERSORES DTO
    // ================================
    private TransacaoRequestDto convertToDTO(Transacao transacao) {
        if (transacao == null) return null;

        return new TransacaoRequestDto(
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

    private List<TransacaoRequestDto> convertToListDTO(List<Transacao> transacoes) {
        return transacoes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
