# Roadmap do calendário — Finnitus

Ordem de implementação definida antes do código. Data: 13/09/2026.

| Etapa | Entrega | Critério de aceite |
|---|---|---|
| 1. Diagnóstico | Mapear Expo Router, Express, JWT, Prisma e PostgreSQL | Usar os contratos existentes, identificar mocks e lacunas |
| 2. Banco | Expandir Eventos sem apagar registros | Datas com horário, dia inteiro, relação com usuário e índice |
| 3. API autenticada | GET/POST/PUT/DELETE /calendar/events | Validar campos e impedir acesso a eventos de outra conta |
| 4. Finanças | GET /calendar/finance | Ler Gastos e EntradaDinheiro do período sem gerar lançamentos duplicados |
| 5. Sessão | Login real e token no SecureStore | Enviar Bearer e tratar 401 no calendário |
| 6. Front | Mês atual, marcadores, lista diária, formulário e exclusão | Substituir mocks, permitir CRUD e atualizar após alterações |
| 7. Aparelho | Escolher calendários para leitura e abrir exportação nativa | Permissão opcional, consulta mensal, reconsulta ao retornar ao app |
| 8. Validação | Testes de regras, autorização e instruções de teste em celular | Registrar o que foi executado e o que depende do ambiente |

## Escopo desta entrega

- Calendário interno no PostgreSQL: fonte de verdade dos compromissos do Finnitus.
- Eventos do aparelho: visualização local, sem envio automático ao servidor.
- Exportação: cópia manual pela interface nativa; não é sincronização bidirecional.
- Impacto previsto de evento: valor não negativo estimado; não equivale a gasto realizado.
- Finanças: leitura das tabelas existentes. Esta versão anexada não contém CRUD financeiro integrado ao servidor.
- Eventos internos únicos, com horário ou dia inteiro. Repetição interna e notificações push ficam para a próxima fase.

## Próximas fases

1. Validar em Android e iOS com contas e calendários reais.
2. Concluir a persistência da gestão financeira e testar seu reflexo no calendário.
3. Recorrência interna: modelar série, exceções e edição de uma ocorrência versus série inteira.
4. Sincronização: IDs por aparelho/usuário, fila, conflitos, exclusões e idempotência.
5. Notificações e, se necessário, OAuth para provedores externos.

## Dependências e cuidados reais encontrados

O login visual não consumia a API. Foi necessário criar a ponte de sessão. O middleware
aceitava tokens de recuperação de senha como se fossem tokens de acesso: corrigir antes
de expor os compromissos. O histórico de migrations deve ser verificado antes de aplicar
em banco existente; não executar reset para resolver divergência.
