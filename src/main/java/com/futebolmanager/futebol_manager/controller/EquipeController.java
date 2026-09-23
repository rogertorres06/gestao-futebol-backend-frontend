package com.futebolmanager.futebol_manager.controller;

import com.futebolmanager.futebol_manager.model.Equipe;
import com.futebolmanager.futebol_manager.service.EquipeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipes")
@CrossOrigin(origins = "http://localhost:5173")
public class EquipeController {

    private final EquipeService equipeService;

    public EquipeController(EquipeService equipeService){
        this.equipeService = equipeService;
    }

    @PostMapping
    public ResponseEntity<Equipe> criarEquipe(@RequestBody @Valid Equipe equipe){
        Equipe novaEquipe = equipeService.salvar(equipe);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaEquipe);
    }

    @GetMapping
    public ResponseEntity<List<Equipe>> listarEquipes(){
        List<Equipe> equipes = equipeService.listarTodos();
        return ResponseEntity.ok(equipes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipe> buscarPorId(@PathVariable Long id) {
        return equipeService.buscarEquipeComJogadores(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Equipe> atualizarEquipe(@PathVariable Long id, @RequestBody Equipe equipe) {
        Equipe equipeAtualizada = equipeService.atualizar(id, equipe);
        return ResponseEntity.ok(equipeAtualizada);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEquipe (@PathVariable Long id){
        try {
            equipeService.deletar(id);
            return ResponseEntity.noContent().build();
        }catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }


}
