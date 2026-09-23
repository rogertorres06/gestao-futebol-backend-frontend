package com.futebolmanager.futebol_manager.controller;

import com.futebolmanager.futebol_manager.dto.JogadorRequestDTO;
import com.futebolmanager.futebol_manager.model.Jogador;
import com.futebolmanager.futebol_manager.repository.JogadorRepository;
import com.futebolmanager.futebol_manager.service.JogadorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jogadores")
@CrossOrigin(origins = "http://localhost:5173")
public class JogadorController {

    private final JogadorService jogadorService;

    @Autowired
    private JogadorRepository jogadorRepository;

    // Injeção de dependência via construtor
    public JogadorController(JogadorService jogadorService) {

        this.jogadorService = jogadorService;
    }

    @PostMapping
    public ResponseEntity<Jogador> criarJogador(@RequestBody @Valid JogadorRequestDTO dto) {
        Jogador novoJogador = jogadorService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoJogador);
    }

    @GetMapping
    public ResponseEntity<List<Jogador>> listarJogadores() {
        List<Jogador> jogadores = jogadorService.listarTodos();
        return ResponseEntity.ok(jogadores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Jogador> buscarJogadorPorId(@PathVariable Long id) {
        return jogadorService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/equipe/{equipeId}")
    public List<Jogador> listarPorEquipe(@PathVariable Long equipeId) {
        return jogadorRepository.findByEquipeId(equipeId);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deletarJogador(@PathVariable Long id){
        try {
            jogadorService.deletar(id);
            return ResponseEntity.noContent().build();
        }catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Jogador> atualizarJogador(@PathVariable Long id, @RequestBody @Valid JogadorRequestDTO dto) {
        try {
            Jogador jogadorAtualizado = jogadorService.atualizar(id, dto);
            return ResponseEntity.ok(jogadorAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
