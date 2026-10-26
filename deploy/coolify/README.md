# AgentScope no Coolify (implantação inicial)

Esta branch inclui um Docker Compose específico para implantação via **Git repository** no Coolify. Não altera a branch `main`.

## Configuração no Coolify

1. **Project > New Resource > Public Repository**.
2. Informe `https://github.com/marcioms70/agentscope` e selecione a branch `coolify-deploy`.
3. Escolha **Docker Compose** como Build strategy.
4. Base Directory: `/`. Docker Compose Location: `/docker-compose.coolify.yml` (use o seletor de caminho relativo conforme a versão do Coolify).
5. Confirme os serviços `web`, `api` e `redis`.
6. Configure o domínio HTTPS do serviço `web` na porta interna **80** e, separadamente, o domínio HTTPS do serviço `api` na porta interna **8000**.
7. Faça o deploy, verifique os logs e configure a URL pública do backend (API) na interface web.

O Redis não tem porta publicada, e o serviço persiste seu conteúdo e os workspaces em volumes Docker.

## Cuidados

- **Proteja o acesso à interface e à API** antes de disponibilizar agentes com acesso a ferramentas. O exemplo não deve ser exposto a usuários anônimos sem autenticação e controle de acesso.
- O arquivo original `examples/agent_service/main.py` usa `QdrantStore(location=":memory:")`; os índices da base vetorial **não persistem** após reinício. Para produção, mude para um Qdrant externo/persistente.
- O serviço de exemplo registra um MCP Playwright baseado em `npx`. A imagem contém Node.js e `npx`, mas navegadores e bibliotecas de sistema do Playwright podem exigir instalação adicional para essa ferramenta.
- Defina credenciais de provedores de modelos somente em configuração protegida. **Nunca adicione chaves ao GitHub.**
- As imagens foram preparadas para uma primeira implantação; builds e operação final devem ser verificados pelos logs do Coolify no seu servidor.
