-- 1. Cria a tabela de equipes
CREATE TABLE tb_equipes (
                            id BIGSERIAL PRIMARY KEY,
                            api_id BIGINT UNIQUE,
                            nome VARCHAR(255) NOT NULL UNIQUE,
                            estadio VARCHAR(255) NOT NULL,
                            escudo_url TEXT,
                            cor_primaria VARCHAR(50),
                            orcamento NUMERIC(15, 2) DEFAULT 0.00,
                            divisao VARCHAR(50),
                            posicao_tabela INTEGER
);

-- 2. Cria a tabela de jogadores com todos os campos atualizados
CREATE TABLE tb_jogadores (
                              id BIGSERIAL PRIMARY KEY,
                              nome VARCHAR(255) NOT NULL,
                              posicao VARCHAR(100),
                              idade INTEGER,
                              overall INTEGER,
                              numero_camisa INTEGER,
                              titular BOOLEAN DEFAULT FALSE,
                              foto_url TEXT,
                              equipe_id BIGINT,
                              CONSTRAINT fk_jogador_equipe FOREIGN KEY (equipe_id) REFERENCES tb_equipes(id)
);