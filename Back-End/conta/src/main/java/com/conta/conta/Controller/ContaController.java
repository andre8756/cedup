package com.conta.conta.Controller;

import com.conta.conta.DTO.TransacaoFiltro;
import com.conta.conta.DTO.TransacaoRequestDto;
import com.conta.conta.Entity.Banco;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Entity.Transacao;
import com.conta.conta.Service.BancoService;
import com.conta.conta.Service.ContaService;
import com.conta.conta.Service.PdfService;
import com.conta.conta.Service.TransacaoService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/conta")
@PreAuthorize("hasRole('USER')")
public class ContaController {

    @Autowired
    private ContaService contaService;
    @Autowired
    private BancoService bancoService;
    @Autowired
    private TransacaoService transacaoService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private PdfService pdfService;

    // ================================
    // CONTA
    // ================================

    // Somente para ADMIN
    /*
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Conta> listarTodasContas() {
        return contaService.listarConta();
    }
    */

    @GetMapping("/atual")
    public Conta buscarContaAtual() {
        return contaService.buscarContaLogada();
    }

    @PutMapping("/atual")
    public void atualizarConta(@RequestBody Conta conta) {
        Conta contaBase = contaService.buscarContaLogada();
        modelMapper.map(conta, contaBase);
        contaService.salvar(contaBase);
    }

    @DeleteMapping("/atual")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerConta() {
        contaService.removerContaUsuario();
    }

    // ================================
    // BANCOS
    // ================================

    @GetMapping("/banco")
    public List<Banco> listarBancosDaContaAtual() {
        return bancoService.listarBancoPorContaId();
    }

    @GetMapping("/banco/id/{id}")
    public Banco buscarBanco(@PathVariable Long id) {
        return bancoService.buscarPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco não encontrado"));
    }

    @GetMapping("/banco/chave-pix/{chavePix}")
    public Banco buscarBancoPorChavePix(@PathVariable String chavePix) {
        return bancoService.buscarPorChavePix(chavePix)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco não encontrado"));
    }

    @PostMapping("/banco")
    @ResponseStatus(HttpStatus.CREATED)
    public Banco salvarBanco(@RequestBody Banco banco) {
        banco.setConta(contaService.buscarContaLogada());
        return bancoService.salvar(banco);
    }

    @PutMapping("/banco/{id}")
    public void atualizarBanco(@PathVariable Long id, @RequestBody Banco banco) {
        Banco bancoBase = bancoService.buscarPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco não encontrado"));
        modelMapper.map(banco, bancoBase);
        bancoService.salvar(bancoBase);
    }

    @DeleteMapping("/banco/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerBanco(@PathVariable Long id) {
        bancoService.removerPorId(id);
    }

    // ================================
    // TRANSAÇÕES
    // ================================

    @PostMapping("/banco/{origemPix}/{destinoPix}/transacao")
    @ResponseStatus(HttpStatus.CREATED)
    public TransacaoRequestDto salvarTransacao(
            @PathVariable String origemPix,
            @PathVariable String destinoPix,
            @RequestBody Transacao transacao) {
        return transacaoService.processarTransacao(origemPix, destinoPix, transacao);
    }

    @PutMapping("/banco/transacao/{id}")
    public void atualizarTransacao(@PathVariable Long id, @RequestBody Transacao transacao) {
        Transacao transacaoBase = transacaoService.buscarPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transação não encontrada"));
        modelMapper.map(transacao, transacaoBase);
        transacaoService.processarTransacao(
                transacaoBase.getBancoOrigem().getChavePix(),
                transacaoBase.getBancoDestino().getChavePix(),
                transacaoBase
        );
    }

    @DeleteMapping("/banco/transacao/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerTransacao(@PathVariable Long id) {
        transacaoService.removerPorId(id);
    }

    // ================================
    // FILTROS & PDF
    // ================================

    @GetMapping("/banco/transacao/filtros")
    public List<TransacaoRequestDto> listarComFiltros(TransacaoFiltro filtro) {
        return transacaoService.listarComFiltros(filtro);
    }

    @GetMapping("/banco/transacao/filtros/pdf")
    public ResponseEntity<byte[]> downloadPdfComFiltros(TransacaoFiltro filtro) {
        List<TransacaoRequestDto> transacoesFiltradas = transacaoService.listarComFiltros(filtro);
        byte[] pdfBytes = pdfService.generateTransacoesPdf(transacoesFiltradas);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("relatorio-transacoes-" + System.currentTimeMillis() + ".pdf")
                .build());
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    // ================================
    // RESUMOS
    // ================================

    @GetMapping("/banco/transacao/receita")
    public ResponseEntity<?> receitaMensal() {
        try {
            float total = transacaoService.calcularReceitaMensal();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao calcular receita mensal: " + e.getMessage());
        }
    }

    @GetMapping("/banco/transacao/despesa")
    public ResponseEntity<?> despesaMensal() {
        try {
            float total = transacaoService.calcularDespesaMensal();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao calcular despesa mensal: " + e.getMessage());
        }
    }
}

