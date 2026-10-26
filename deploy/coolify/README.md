# AgentScope no Coolify — implantação protegida

Esta branch `coolify-deploy` mantém o original `main` intacto.

## Implantação

1. Coolify: Project > New Resource > Public Repository, `https://github.com/marcioms70/agentscope/tree/coolify-deploy`.
2. Selecione **Docker Compose**, base `/`, arquivo `/docker-compose.coolify.yml`.
3. **Domains for api: mantenha VAZIO.** O backend deve ser privado, acessível só pela rede Docker.
4. **Domains for web:** gere um domínio HTTPS no serviço `web` (porta interna **80**).
5. Em **Environment Variables**, defina os dois valores (marque-os como segredos, sem publicar os valores):
   - `AGENTSCOPE_BASIC_AUTH_USER`: usuário para abrir a interface.
   - `AGENTSCOPE_BASIC_AUTH_PASSWORD`: senha longa e exclusiva; nunca inclua no GitHub.
6. Salve; execute **Deploy**. A interface falha de forma segura se as variáveis estiverem ausentes.
7. Ao acessar o domínio web, o navegador solicitará usuário e senha HTTP Basic.
8. Na configuração inicial da interface, o backend sugerido é `https://SEU_DOMINIO_WEB/backend`; o campo usuário nessa tela é apenas o identificador de sessão `X-User-ID`, não a senha de acesso.

## Arquitetura

- `web`: Nginx serve a interface com Basic Auth e encaminha `/backend/*` para `api:8000/*`.
- `api`: FastAPI interno (sem domínio nem porta publicada). Seus workspaces persistem num volume Docker.
- `redis`: serviço interno com persistência AOF em volume.

## Avisos de segurança e operação

- Use apenas **HTTPS**. Basic Auth depende do TLS externo do Coolify.
- A interface web e o gateway exigem a mesma autenticação. Não crie domínio público direto para `api`.
- O campo `username` da interface AgentScope é um identificador informado pelo navegador, **não** é autenticação. Esta implantação destina-se a **um único administrador de confiança**, não a múltiplos usuários não confiáveis.
- O serviço de exemplo expõe ferramentas com acesso ao workspace e MCPs; nunca exponha esta API de forma anônima.
- O exemplo usa `QdrantStore(location=":memory:")`, de modo que o índice vetorial não persiste no reinício. Para produção, substitua por Qdrant persistente e ajuste backup.
- Playwright MCP pode exigir dependências de navegador adicionais dentro da imagem.
- Os Dockerfiles são para primeira implantação. Conferir os logs de build e de execução no Coolify.
