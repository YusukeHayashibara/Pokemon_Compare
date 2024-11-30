 Acesso ao arquivo JSON em um servidor local
Se você estiver tentando abrir o projeto no navegador diretamente (por exemplo, ao abrir o arquivo index.html), o navegador pode bloquear a requisição fetch devido a políticas de segurança, como o CORS (Cross-Origin Resource Sharing). Para evitar esse problema, é recomendado servir o arquivo JSON usando um servidor local.

Solução:
Use um servidor local para acessar os arquivos corretamente. Algumas opções simples para isso incluem:
Usando Live Server no VSCode:
Instale a extensão Live Server no VSCode.
Clique com o botão direito no arquivo index.html e selecione Open with Live Server.
