# RPG Up — Originate + Tidy5e

Integra o botão **Originate — Subir nível** ao cabeçalho do **Tidy5e**, sem editar os módulos originais.

## Instalação

Manifest (Foundry v14):
`https://raw.githubusercontent.com/henriquebot/RPG-Up-Originate-Tidy5e/main/module.json`

Requisitos: Foundry v14, sistema dnd5e 6.x, Originate 3.0.4+ e Tidy5e Sheet 15.0.0+ ativos.

Após atualizar, reinicie ou recarregue o mundo e reabra a ficha Tidy5e.

## v1.0.1 — correção de integração

- O botão é registrado **sincronamente**, como no código de console que funcionou, sem importar módulos extras na inicialização.
- O controle agora aparece em qualquer ficha Tidy5e de personagem (`character`) quando o Originate Level Up está habilitado e o usuário tem permissão de proprietário.
- Se a ficha for importada e não tiver marcadores do Originate, o primeiro clique solicita confirmação para adicionar o marcador `flags.originate.createdBy`. **Não modifica nada sem confirmação.**
- Se houver uma janela do assistente já aberta para o mesmo personagem, traz a janela para frente.
- Indicadores de diagnóstico no console e API de status: `game.modules.get("rpg-up-originate-tidy5e").api.getStatus()`.

O módulo somente registra um botão de interface. A evolução em si é feita pelo Originate e suas regras. A integração com o DAS não é modificada.

**Atenção:** marcar um ator importado como criado pelo Originate altera a forma como o próprio Originate o reconhece e pode afetar rotinas de progressão. Recomenda-se testar em cópia antes de evoluir personagens em uso.

## Se o botão não aparecer

1. Confirme que o módulo **RPG Up — Originate + Tidy5e** v1.0.1 está habilitado em **Configurar módulos**.
2. Confirme que **Originate** e **Tidy5e Sheet** estão habilitados.
3. Verifique que a ficha aberta é do Tidy5e e **Enable Level Up Management** do Originate está ligado.
4. No console F12, consulte `game.modules.get("rpg-up-originate-tidy5e")?.api?.getStatus()`. `registered` deve ser `true`.

## Notas

- Usa o arquivo interno `/modules/originate/scripts/levelup-app.js` do Originate 3.0.4.
- O botão de nível não usa XP. As configurações de avanço são controladas pelo dnd5e/Originate.
- Licença MIT.
