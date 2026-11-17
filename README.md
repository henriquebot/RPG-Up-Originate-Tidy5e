# RPG Up — Originate + Tidy5e

Integra o botão **Originate — Subir nível** ao cabeçalho da ficha de personagem **Tidy5e**, sem editar os módulos originais.

**Testado manualmente no contexto do usuário:** Foundry VTT 14.370, dnd5e 6.1.0, Originate 3.0.4, Tidy5e 15.0.0. A versão empacotada replica a integração testada no console, com verificação dos marcadores original do Originate. A instalação empacotada precisa ser validada no mundo de teste.

## Instalação

No Foundry (tela de configuração), abra **Módulos adicionais → Instalar módulo** e cole o URL do manifest:

`https://raw.githubusercontent.com/henriquebot/RPG-Up-Originate-Tidy5e/main/module.json`

Em seguida, ative no mundo:
- **Originate** (3.0.4 ou superior)
- **Tidy 5e Sheet** (15.0.0 ou superior)
- **RPG Up — Originate + Tidy5e**

Sistema: **dnd5e 6.x**. Foundry: **v14**.

## Funcionamento

O botão fica no cabeçalho da ficha Tidy5e quando:
1. A configuração de **Level Up** do Originate está ligada;
2. O ator é do tipo **character** e o usuário tem permissão de proprietário;
3. O ator é reconhecido pela função `hasOriginateActorMarkers` do próprio Originate.

**Personagens importados:** o Originate só reconhece personagens criados por ele ou com marcadores válidos. Para liberar um personagem importado, use `await actor.setFlag("originate", "createdBy", "originate")` **apenas em um ator que você quer gerenciar pelo Originate**; isso altera o marcador de origem e pode afetar outras rotinas do Originate.

O botão abre `LevelUpApp` do Originate e traz para frente uma janela já aberta, sem duplicá-la. Este módulo não muda nível, XP, itens, progressões nem configurações de personagem.

## Limitações

- Usa caminhos internos do Originate 3.0.4 para `resolution-core.js` e `levelup-app.js`. Se o Originate alterar esses arquivos, a integração precisará de atualização.
- O módulo não altera automaticamente os marcadores dos personagens.
- O DAS não é um requisito; a compatibilidade depende da ficha Tidy5e e do comportamento do Originate.

## Desenvolvimento

Arquivos: `module.json` e `scripts/main.js`. O ZIP para instalação precisa conter `module.json` na raiz.

Repositório: https://github.com/henriquebot/RPG-Up-Originate-Tidy5e
