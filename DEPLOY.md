# Deploy na VM

## Pré-requisitos

- Docker e Docker Compose instalados na VM
- Conta no GitHub com acesso ao repositório

---

## Primeira vez

### 1. Clonar o repositório

```bash
git clone https://github.com/RuanVasco/ticket-ease.git
cd ticket-ease
```

### 2. Criar o arquivo de variáveis de ambiente

```bash
cp .env.example .env
nano .env
```

Preencha todos os valores:

```env
CORS_ALLOWED_ORIGINS=http://<IP_DA_VM>
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/ticketease
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<senha_segura>
API_SECURITY_TOKEN_SECRET=<string_aleatoria_minimo_32_chars>

VITE_API_BASE_URL=http://<IP_DA_VM>:8080
VITE_WS_URL=ws://<IP_DA_VM>:8080/ws
```

### 3. Autenticar o Docker no GHCR

Crie um Personal Access Token (PAT) no GitHub com escopo `read:packages`:
**GitHub → Settings → Developer settings → Personal access tokens → Generate new token**

Em seguida, na VM:

```bash
echo "<SEU_PAT>" | docker login ghcr.io -u ruanvasco --password-stdin
```

Isso salva as credenciais em `/root/.docker/config.json`, que o Watchtower usa para fazer pull das imagens.

### 4. Subir os containers

```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## Atualizações

As atualizações são automáticas. A cada **5 minutos** o Watchtower verifica se há uma nova imagem no GHCR e, se houver, faz o pull e reinicia o container.

O fluxo completo após um `git push` para `main`:

```
push para main
    → GitHub Actions: build + testes + lint
    → se passar: nova imagem publicada no GHCR com tag :latest
    → Watchtower detecta a mudança (até 5 min)
    → pull + restart automático
```

Para forçar uma atualização imediata sem esperar o Watchtower:

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

---

## Comandos úteis

```bash
# Ver status dos containers
docker compose -f docker-compose.prod.yml ps

# Ver logs de um serviço específico
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f watchtower

# Reiniciar um serviço
docker compose -f docker-compose.prod.yml restart api

# Parar tudo
docker compose -f docker-compose.prod.yml down

# Parar e remover volumes (CUIDADO: apaga o banco)
docker compose -f docker-compose.prod.yml down -v
```

---

## Secrets no GitHub Actions

Para que o CI/CD construa o frontend com as URLs corretas, configure os seguintes secrets no repositório:

**GitHub → Settings → Secrets and variables → Actions**

| Secret | Exemplo |
|---|---|
| `VITE_API_BASE_URL` | `http://<IP_DA_VM>:8080` |
| `VITE_WS_URL` | `ws://<IP_DA_VM>:8080/ws` |

O `GITHUB_TOKEN` para autenticação no GHCR é gerado automaticamente pelo GitHub Actions — não precisa criar.
