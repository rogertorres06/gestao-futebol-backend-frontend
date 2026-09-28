# ⚽ Futebol Manager API

API REST desenvolvida para gerenciamento de equipes de futebol e jogadores, focada em boas práticas de arquitetura e consistência de dados.

## 🚀 Tecnologias Utilizadas
- **Java 21**
- **Spring Boot 3.3.5** (Spring Data JPA, Spring Web, Validation)
- **PostgreSQL 18**
- **Flyway** (Migrations / Controle de versão de Banco de Dados)
- **Lombok**
- **Maven**

## 🛠️ Destaques de Arquitetura e Implementação
- **Arquitetura em Camadas:** Separação clara de responsabilidades entre `Controller`, `Service` e `Repository`.
- **DTO Pattern:** Isolamento das entidades de domínio através de DTOs (`JogadorRequestDTO`).
- **Database Versioning:** Migrações organizadas com Flyway (`V1__initial_schema.sql`, `V2__add_salario_to_tb_jogadores.sql`) e tratamento automático de checksums.
- **Precisão Financeira:** Manipulação rigorosa de valores monetários utilizando `BigDecimal` no Java e tipo `NUMERIC` no PostgreSQL.

## ⚙️ Como Rodar o Projeto

1. Certifique-se de ter o PostgreSQL rodando localmente com a base `futebol_manager`.
2. Configure o usuário e senha no arquivo `src/main/resources/application.properties`.
3. Execute a aplicação via Maven ou IntelliJ:
   ```bash
   mvn spring-boot:run

## 📸 Pré-visualização da Aplicação
<img width="1002" height="588" alt="image" src="https://github.com/user-attachments/assets/466706a1-c56c-4428-a670-e25f394f2b50" />
<img width="1007" height="535" alt="image" src="https://github.com/user-attachments/assets/891bf270-0a17-4471-919e-05b696bb6dc2" />

