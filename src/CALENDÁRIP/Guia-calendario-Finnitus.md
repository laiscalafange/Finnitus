# Calendário do Finnitus — guia de implementação e integração

Leia primeiro `01-roadmap.md`. Este guia explica o código da cópia entregue, baseada no arquivo Finnitus(1).7z de 13/09/2026.

## 1. O que havia e o que foi implementado

| No anexo | Na entrega |
|---|---|
| Expo 57, React Native, Expo Router | Mesma estrutura e versão de SDK |
| react-native-calendars instalado | Continua desenhando a grade do mês |
| Tela com fevereiro de 2026 e mocks | Mês atual, consultas reais, seleção de dia e estados de erro/carregamento |
| Login só navegava para a home | Chamada à API existente, armazenamento da sessão e envio do Bearer |
| Tabela Eventos com apenas uma data | Início/fim, dia inteiro, vínculo com Usuario, índice e migration |
| Express, Prisma 7, PostgreSQL e middleware JWT | Rotas /calendar protegidas pelo middleware corrigido |
| FinanceiroProvider em memória; tabelas Gastos e EntradaDinheiro | Leitura dessas tabelas pelo calendário; formulário financeiro ainda precisa persistir os dados |
| Expo Calendar apenas pesquisado | Serviço nativo com permissão, seleção, leitura mensal e exportação manual |

A sua ordem — autenticação, gestão financeira e calendário — faz sentido. Contudo, a cópia enviada não tem toda essa integração anterior concluída. Por isso, conectei o login e deixei a fronteira com a gestão financeira explícita. Não apresente uma tela financeira em memória como se seus valores já estivessem no banco.

## 2. Entenda as três partes

**react-native-calendars** é o componente visual: desenha os dias e avisa qual foi selecionado. Não salva compromissos.

**A API Express + PostgreSQL** salva os eventos internos por usuário. É a fonte de verdade do Finnitus e exige acesso ao servidor. A permissão do calendário do celular não interfere nela.

**expo-calendar** acessa o calendário do sistema Android/iOS. Neste MVP, os eventos lidos ficam somente em memória no aparelho. Não são enviados ao backend, não viram gastos e não são importados automaticamente para o Finnitus.

Fluxo de criação: formulário → requisição HTTP com Bearer → middleware identifica usuário → validação → Prisma grava Eventos → resposta → tela consulta novamente o mês.

Fluxo do aparelho: tocar em permitir → aceitar permissão → selecionar calendários → ler intervalo do mês → mostrar junto aos eventos internos, com identificação de origem.

## 3. Preparar a cópia

Descompacte `Finnitus-calendario.zip` em uma pasta separada. Ela contém o projeto completo com os arquivos alterados, sem node_modules, segredos ou código Prisma gerado. Os assets e as demais telas foram preservados.

Se você já tem alterações mais recentes, compare `05-arquivos-alterados.md` e transfira apenas as mudanças necessárias. Não sobrescreva sua versão mais nova inteira.

Pré-requisitos: Node compatível com o SDK 57, npm, PostgreSQL disponível e um usuário cadastrado na autenticação existente. A documentação do SDK 57 indica Node mínimo 22.13.x; a verificação desta entrega usou Node 24.19.0. [Referência Expo 57](https://docs.expo.dev/versions/v57.0.0/).

### Terminal 1: backend

Abra o terminal dentro de `Finnitus/src/backend`:

```bash
npm ci
```

Crie `.env` copiando `.env.example` e preencha seus valores reais. São arquivos diferentes: o `.env` desta pasta pertence ao servidor; o `.env` da raiz pertence ao aplicativo.

```dotenv
DATABASE_URL=postgresql://USUARIO:SENHA@localhost:5432/finnitus
JWT_SECRET=SEU_SEGREDO_FORTE
PORT=3333
EMAIL_USER=SEU_EMAIL
EMAIL_PASSWORD=SUA_CREDENCIAL_SMTP
EMAIL_FROM=SEU_REMETENTE
WEB_ORIGIN=http://localhost:8081
```

O código antigo exige as variáveis de email ao iniciar, mesmo quando você usa apenas login e calendário. Preserve a configuração que já usa na autenticação. Não coloque DATABASE_URL, JWT_SECRET ou senha de email em variáveis EXPO_PUBLIC.

Antes de alterar o banco, faça um backup e confira o histórico:

```bash
npx prisma migrate status
```

**Se esse banco é gerenciado pelas migrations que acompanham o projeto e o histórico está consistente**, aplique as pendentes:

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Por que `migrate deploy`? A migration já está escrita na entrega. Esse comando aplica os arquivos pendentes sem tentar gerar outra migration por comparação automática. `generate` atualiza o client usado pelo código, mas não cria tabelas.

**Se o banco já tem tabelas, mas não tem o histórico, ou se os arquivos diferem dos que foram aplicados**, pare nessa etapa e reconcilie o histórico conforme o guia de baselining do Prisma. Não use `migrate reset` para contornar isso, pois ele apaga os dados. [Baselining no Prisma](https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining).

O anexo apresenta uma divergência anterior: a primeira migration usa `Gastos.Gdata` como DATE e vários campos VARCHAR, enquanto o schema atual usa DateTime/String sem os mesmos tipos nativos, além de uma relação de gastos não registrada nesse histórico. Não gere uma migration ampla de correção sem comparar com seu banco real. A migration entregue altera apenas Eventos.

### Terminal 2: front

Na raiz `Finnitus`:

```bash
npm ci
npx expo install expo-calendar expo-secure-store
```

As dependências e o lockfile já estão atualizados. O segundo comando permite ao Expo conferir as versões compatíveis no seu ambiente.

Crie o `.env` da raiz a partir de `.env.example`:

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.1.100:3333
```

Substitua o IP pelo IPv4 do computador que executa a API:

| Onde executa o front | Endereço usual da API local |
|---|---|
| Celular físico | http://IP_DO_COMPUTADOR:3333, na mesma rede |
| Emulador Android padrão do Android Studio | http://10.0.2.2:3333 |
| Navegador no computador do backend | http://localhost:3333 |
| Simulador iOS no Mac do backend | http://localhost:3333 |

`localhost` no celular aponta para o próprio celular. Em rede local, permita a porta da API no firewall; não desative o firewall inteiro. Em aplicativo distribuído, use API HTTPS.

Inicie:

```bash
npx expo start --clear
```

Se usar um development build já instalado, gere um novo binário após adicionar os módulos/plugins nativos. Reiniciar Metro sozinho não adiciona módulos a esse binário. Para compilar Android localmente, com o ambiente Android configurado, use `npx expo run:android`. Teste a integração nativa em Android/iOS; o navegador usa apenas o calendário interno.

## 4. Fazer o primeiro teste completo

1. Inicie a API e abra a tela de login.
2. Entre com uma conta já cadastrada no backend. Nesta entrega, o login direciona ao calendário para facilitar a validação.
3. Toque em **Novo evento**.
4. Preencha título “Consulta”, início `2026-09-15 09:00`, fim `2026-09-15 10:00`, impacto previsto `120,50`.
5. Salve. O evento deve aparecer no dia 15 de setembro de 2026 e marcar esse dia na grade.
6. Edite o título e confira a mudança.
7. Feche e reabra o aplicativo; consulte o dia novamente. O registro deve vir do servidor.
8. Saia, entre com outra conta e confirme que o evento não aparece.
9. Volte à primeira conta e exclua o evento pela confirmação.

Se ainda não houver conta no banco, use o `03-requisicoes.http` para chamar `/auth/register` conforme o contrato existente, depois faça login pelo aplicativo. O fluxo visual de cadastro do anexo não foi refeito nesta tarefa.

## 5. O que cada arquivo faz e por quê

### Banco e migration

`src/backend/prisma/schema.prisma` mantém Eventos e seus campos antigos, acrescentando `inicio`, `fim`, `diaInteiro` e `Usuario`. `Edata` permanece como data civil de referência para compatibilidade.

`inicio` e `fim` usam TIMESTAMPTZ: representam instantes e aceitam conversão de fuso. O intervalo é sempre **início incluído e fim excluído**. Um compromisso de 23h30 até 00h00 aparece apenas no primeiro dia; se terminar às 00h30, aparece nos dois.

Dia inteiro segue uma convenção explícita: datas civis codificadas em `00:00Z`, sem convertê-las para o fuso ao mostrar o dia. Um evento de dia inteiro no dia 13 tem fim no dia 14, exclusivo. Isso evita mostrá-lo no dia 12 em São Paulo.

A migration transforma registros antigos em dia inteiro, preservando nome, descrição e impacto. Se encontrar Eventos sem Usuario correspondente, a chave estrangeira falha: repare os vínculos antes de repetir. Nenhum registro órfão é apagado automaticamente.

O índice por usuário/início ajuda a consulta mensal. A regra SQL `fim > inicio` acrescenta proteção no banco. A relação com `onDelete: Cascade` remove os eventos se a conta for excluída.

### Validação, serviço e rotas

`calendar.validation.ts` valida título, descrição, ID, dinheiro e datas. Rejeita campos extras como `id_Usuario`: o cliente não escolhe o dono do evento.

`calendar.service.ts` contém as operações Prisma. Exemplo da exclusão:

```ts
await db.eventos.deleteMany({
  where: { id_Evento: id, id_Usuario: userId },
});
```

Filtrar só por `id_Evento` permitiria que uma conta tentasse apagar o evento de outra. A edição também inclui os dois campos na própria escrita. Consultas incluem o usuário e retornam somente eventos que se sobrepõem ao intervalo pedido.

`calendar.router.ts` recebe HTTP, exige autenticação, valida parâmetros e responde JSON. `calendar.routes.ts` liga o serviço real ao middleware. `routes/index.ts` registra `/calendar`.

| Método e rota | Função |
|---|---|
| GET /calendar/events | Consultar eventos do período |
| POST /calendar/events | Criar evento interno |
| PUT /calendar/events/:id | Substituir os campos editáveis do evento |
| DELETE /calendar/events/:id | Excluir evento próprio |
| GET /calendar/finance | Consultar lançamentos financeiros do período |

PUT exige o corpo completo. Não foi implementado PATCH parcial. IDs alheios e inexistentes retornam 404, sem revelar a existência de dados de outra pessoa.

GET recebe `inicio` e `fim` como instantes ISO com fuso, mais `inicioDia` e `fimDia` como datas civis. Os dois pares são necessários para consultar compromissos com horário e registros de dia inteiro sem deslocamentos indevidos. O serviço aceita no máximo 62 dias; se houver mais de 2.000 itens por conjunto, retorna 422, solicitando um período menor, em vez de esconder registros.

`impactoPrevisto` trafega como string, por exemplo `"120.50"`, e usa Decimal no banco. Não envie `"R$ 120,50"`. O formulário troca a vírgula por ponto antes da requisição.

### Autenticação e cliente HTTP

`authContext.jsx` mantém sessão e funções de entrar/sair. `sessionStorage.native.js` usa SecureStore no Android/iOS. A versão `.web.js` mantém o token só em memória: recarregar o navegador exige novo login.

`api.js` centraliza URL, JSON, Bearer, timeout e erros. Nenhum token está fixado no código. No calendário, 401 encerra a sessão e volta ao login. O backend continua sendo quem decide autorização.

O middleware passou a rejeitar tokens com `purpose`, incluindo os de recuperação de senha. Também valida ID inteiro positivo e restringe o algoritmo a HS256. Os tokens de acesso que o backend atual emite continuam compatíveis.

A sessão é carregada no layout raiz. O calendário exige sessão e remonta seu conteúdo quando a conta muda, para eliminar dados da conta anterior. Não foi feita uma revisão completa dos fluxos de autenticação, cadastro e proteção de todas as outras telas.

### Tela e datas

`src/app/(tabs)/calendario.jsx` substitui os mocks da tela. Mantém a base roxa do projeto e acrescenta formulário, mensagens de erro, estados vazios, confirmação de exclusão e botão atualizar.

`dates.js` reúne funções de mês, data local, intervalos e valores monetários. O dia da semana foi corrigido: a lista de nomes começa no domingo, enquanto `firstDay={1}` determina que a grade comece na segunda.

A tela consulta novamente ao ganhar foco, ao mudar o mês, ao mudar calendários selecionados, ao retornar do aplicativo externo e ao atualizar manualmente. Um contador descarta respostas antigas se uma nova consulta começar antes da anterior terminar.

### Expo Calendar

`deviceCalendar.native.js` concentra a API nativa. `deviceCalendar.web.js` fornece uma alternativa explícita sem tentar chamar recursos nativos no navegador.

Para manter relação com o material pesquisado, esta entrega usa a API funcional via:

```js
import * as Calendar from 'expo-calendar/legacy';
```

No SDK 57, importá-la do módulo raiz pode acionar métodos depreciados que lançam erro. O módulo raiz também oferece uma API nova baseada em classes. [Calendar do SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/calendar/).

A seleção de calendários é voluntária e vale para a sessão aberta. Consultar permissão ao retornar permite identificar revogação. Os IDs nativos não são gravados na tabela Eventos. Ocorrências externas usam uma chave com calendário, ID e início para não colidir quando uma série retorna várias ocorrências.

**Exportar cópia** abre a interface do sistema preenchida com o evento. O usuário confirma calendário e salvamento nessa interface. Cancelamento não é apresentado como sincronização bem-sucedida. O código não cria automaticamente outro evento interno.

Essa exportação é uma cópia independente: editar ou excluir no Finnitus não atualiza a cópia; repetir pode duplicar. Uma sincronização real exigiria guardar vínculo por conta/aparelho, tratar conflito, repetição, exclusão externa e falhas parciais. Isso está no roadmap futuro.

## 6. Integração com gestão financeira

A rota lê `Gastos` e `EntradaDinheiro` filtrando pelo usuário autenticado. Não usa `FinanceiroProvider`, porque aquele estado existe somente no aplicativo aberto.

Para os novos lançamentos aparecerem aqui, a funcionalidade financeira precisa:

1. Enviar seu formulário para uma rota financeira autenticada.
2. Gravar o registro em Gastos ou EntradaDinheiro, usando `req.userId` no servidor.
3. Seguir o contrato de datas financeiras civis. Nesta entrega, `Gdata` e `Ddata` são lidos pelo dia UTC armazenado e devolvidos como AAAA-MM-DD, preservando o comportamento do DATE no histórico original.
4. Voltar ao calendário ou tocar em Atualizar.

Se seu módulo financeiro mais recente armazena Gdata como instante com horário local, adapte esse contrato em conjunto: mantenha o instante no DTO e filtre no front pelo dia local, mudando também o intervalo de consulta. Não misture dois critérios para a mesma coluna.

Um compromisso “Consulta — previsão R$120” não prova que houve pagamento. Por isso, o calendário exibe a previsão separada e não cria um Gasto. Se quiser “Marcar como pago”, a próxima implementação deve ligar evento e lançamento com operação transacional/idempotente para impedir duplicidade.

## 7. Correções no material de pesquisa

- Participantes no Android são pessoas associadas a eventos; não equivalem a lembretes.
- A leitura do calendário do aparelho exige permissão. A tela interna do Finnitus pode funcionar sem ela.
- A UI nativa e o acesso direto aos dados têm requisitos diferentes; não trate todas as operações como a mesma permissão.
- Serviços online aparecem por meio dos calendários sincronizados pelo sistema. Integração direta com um provedor não foi implementada.
- Acesso ao Apple Calendar no aparelho é diferente de projetar uma integração de servidor com iCloud; “tudo usa OAuth” é uma generalização que precisa ser revista por provedor.
- Reconsultar ao retornar e ao atualizar não é sincronização contínua em segundo plano.

A API legacy, instalação e UI nativa estão descritas na [documentação versionada do Expo](https://docs.expo.dev/versions/v57.0.0/sdk/calendar-legacy/).

## 8. Testar e diagnosticar

No backend:

```bash
npm run test:calendar
npm run build
```

`npm run build` gera o client e compila para dist. `npm start` executa `dist/src/Servidor/server.js`. O script foi ajustado porque o tsconfig anterior não gerava arquivos no caminho esperado por start.

Na raiz:

```bash
npx tsc --noEmit
npx expo export --platform android
```

O teste puro de datas pode ser executado com `TZ=America/Sao_Paulo node --test tests/calendar-dates.test.cjs` no Bash. No PowerShell: `$env:TZ="America/Sao_Paulo"` e depois `node --test tests/calendar-dates.test.cjs`.

| Sintoma | Verificação |
|---|---|
| Network request failed | API ligada, IP correto, mesma rede e porta acessível |
| Sessão volta ao login | Token inválido/expirado; faça login novamente |
| Tabela/coluna inexistente | Banco da DATABASE_URL correto, migrations aplicadas e client gerado |
| Sem gastos, apesar do formulário financeiro | Verificar se o formulário grava no banco ou apenas no contexto React |
| Módulo nativo não encontrado | Instalar dependência e reconstruir development build |
| Acesso ao aparelho negado | Manter uso interno; permitir nas configurações se desejar |
| Erro no navegador, mas funciona no celular | WEB_ORIGIN deve corresponder à origem exata do front |
| Evento exportado duplicado | A exportação manual foi repetida; excluir a cópia pelo calendário do aparelho |

Leia `04-validacao.md` para os resultados reais e os testes que dependem do seu ambiente.
