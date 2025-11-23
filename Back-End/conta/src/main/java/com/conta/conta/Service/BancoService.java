package com.conta.conta.Service;

import com.conta.conta.DTO.BancoRequest;
import com.conta.conta.DTO.BancoResponse;
import com.conta.conta.DTO.BancoUpdateRequest;
import com.conta.conta.DTO.BancoUpdateResponse;
import com.conta.conta.Entity.Banco;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Repository.BancoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BancoService {

    private final BancoRepository bancoRepository;
    private final ContaService contaService;

    public BancoService(BancoRepository bancoRepository, ContaService contaService) {
        this.bancoRepository = bancoRepository;
        this.contaService = contaService;
    }

    // ========================================================
    // CRIAR BANCO (associado à conta logada)
    // ========================================================
    @Transactional
    public BancoResponse salvar(BancoRequest dto) {
        Conta conta = contaService.buscarContaLogada();

        validarChavePix(dto.getChavePix(), null);

        Banco banco = dto.toEntity();
        banco.setConta(conta);

        if (dto.getStatus() != null) {
            banco.setStatus(dto.getStatus());
        }
        if (dto.getPermitirTransacao() != null) {
            banco.setPermitirTransacao(dto.getPermitirTransacao());
        }
        if (dto.getBancoUrl() != null && !dto.getBancoUrl().isBlank()) {
            banco.setBancoUrl(dto.getBancoUrl());
        }

        Banco bancoSalvo = bancoRepository.save(banco);
        contaService.atualizarSaldoTotal(conta.getId());

        return BancoResponse.fromEntity(bancoSalvo);
    }

    // ========================================================
    // LISTAR TODOS BANCOS (ADMIN)
    // ========================================================
    public List<BancoResponse> listarBancos() {
        return bancoRepository.findAll()
                .stream()
                .map(BancoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // ========================================================
    // LISTAR BANCOS DO USUÁRIO LOGADO
    // ========================================================
    public List<BancoResponse> listarBancoPorContaId() {
        Conta conta = contaService.buscarContaLogada();
        return bancoRepository.findByContaId(conta.getId())
                .stream()
                .map(BancoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // ========================================================
    // LISTAR BANCOS QUE PERMITEM TRANSAÇÃO (para PIX)
    // ========================================================
    public List<Banco> listarBancosPermitemTransacao() {
        Conta conta = contaService.buscarContaLogada();
        return bancoRepository.findByContaIdAndPermitirTransacao(conta.getId(), true);
    }

    // ========================================================
    // BUSCAR COM VERIFICAÇÃO DE PERMISSÃO
    // ========================================================
    public Banco buscarEntidadePorId(Long bancoId) {
        Conta conta = contaService.buscarContaLogada();

        Banco banco = bancoRepository.findById(bancoId)
                .orElseThrow(() -> new EntityNotFoundException("Banco não encontrado"));

        if (!banco.getConta().getId().equals(conta.getId())) {
            throw new AccessDeniedException("Você não tem permissão para acessar este banco");
        }

        return banco;
    }

    public BancoResponse buscarPorId(Long bancoId) {
        return BancoResponse.fromEntity(buscarEntidadePorId(bancoId));
    }

    // ========================================================
    // ATUALIZAR SOMENTE CAMPOS ENVIADOS
    // ========================================================
    @Transactional
    public BancoUpdateResponse atualizar(Long bancoId, BancoUpdateRequest dto) {
        Banco banco = buscarEntidadePorId(bancoId);

        if (dto.getTitular() != null && !dto.getTitular().isBlank()) {
            banco.setTitular(dto.getTitular());
        }
        if (dto.getNomeBanco() != null && !dto.getNomeBanco().isBlank()) {
            banco.setNomeBanco(dto.getNomeBanco());
        }
        if (dto.getSaldo() != null) {
            if (dto.getSaldo() < 0) {
                throw new IllegalArgumentException("Saldo não pode ser negativo.");
            }
            banco.setSaldo(dto.getSaldo());
        }
        if (dto.getChavePix() != null && !dto.getChavePix().isBlank()) {
            validarChavePix(dto.getChavePix(), banco.getId());
            banco.setChavePix(dto.getChavePix());
        }
        if (dto.getStatus() != null) {
            banco.setStatus(dto.getStatus());
        }
        if (dto.getPermitirTransacao() != null) {
            banco.setPermitirTransacao(dto.getPermitirTransacao());
        }
        if (dto.getBancoUrl() != null && !dto.getBancoUrl().isBlank()) {
            banco.setBancoUrl(dto.getBancoUrl());
        }

        Banco bancoAtualizado = bancoRepository.save(banco);
        contaService.atualizarSaldoTotal(banco.getConta().getId());

        return BancoUpdateResponse.fromEntity(bancoAtualizado);
    }

    // ========================================================
    // REMOVER BANCO
    // ========================================================
    @Transactional
    public void removerPorId(Long bancoId) {
        Banco banco = buscarEntidadePorId(bancoId);
        bancoRepository.delete(banco);
        contaService.atualizarSaldoTotal(banco.getConta().getId());
    }

    // ========================================================
    // Validar chave pix
    // ========================================================
    private void validarChavePix(String chavePix, Long idAtual) {
        bancoRepository.findByChavePix(chavePix)
                .ifPresent(b -> {
                    if (idAtual == null || !b.getId().equals(idAtual)) {
                        throw new IllegalArgumentException("Esta chave PIX já está em uso.");
                    }
                });
    }

    // ========================================================
    // BUSCAR POR CHAVE PIX (com validação de permissão)
    // ========================================================
    public Banco buscarEntidadePorChavePix(String chavePix) {
        Conta conta = contaService.buscarContaLogada();

        return bancoRepository.findByChavePix(chavePix)
                .filter(b -> b.getConta().getId().equals(conta.getId()))
                .orElseThrow(() -> new EntityNotFoundException("Banco não encontrado ou sem permissão"));
    }

    // ========================================================
    // ATUALIZAR BANCO MODIFICADO
    // ========================================================
    @Transactional
    public Banco atualizarBanco(Banco banco) {
        if (banco.getSaldo() < 0) {
            throw new IllegalArgumentException("Saldo não pode ser negativo.");
        }
        return bancoRepository.save(banco);
    }

}
