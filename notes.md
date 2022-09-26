- Front End: localhost:3000
- Back End Doc: localhost:4000

## Access Token:
- **Pra que serve?**
  - Pegar qualquer tipo de informação do usuário
  - Atualizar informações do usuário
  - Inserir informações
  - Deletar
- **Duração**
  - Dura pouco tempo / O mínimo de tempo possível
- **Risco se ele vazar**
  - Quanto maior o tempo de vida dele, maior o estrago que quem tiver o token pode fazer

## Refresh Token:
- **Pra que serve?**
  - Literalmente, para não precisar pedir a senha e o usuário para gerar um novo access_token.
- **Duração**
  - A duração dele é longa (1 Semana \ 1 Mês \ 1 Ano - Depende das necessidades da aplicação)
  - O refresh token à nivel de back end está associado ao usuário de alguma forma
- **Risco se ele vazar**
  - Se ele vazar, o usuário novo pode gerar tokens INFINITOS (access token, refresh token)
  - Precisa ter alguma forma de invalidar os refresh tokens
  - NÃO salve o refresh token no navegador do usuário.
  - O ideal é armazenar o refresh token em um servidor específico para gerenciar ele.
    - HTTP Only - https://owasp.org/www-community/HttpOnly

