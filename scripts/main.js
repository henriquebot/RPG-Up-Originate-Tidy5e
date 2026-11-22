/**
 * RPG Up — Originate + Tidy5e v1.0.2
 * Foundry VTT v14 / dnd5e 6.x
 *
 * Keep Tidy API registration SYNCHRONOUS (exactly as in the working console test).
 * Do not import Originate internals until a user clicks the control.
 */
const MODULE_ID = "rpg-up-originate-tidy5e";
const VERSION = "1.0.2";
const state = {
  loaded: true,
  registered: false,
  attempts: 0,
  lastAttempt: null,
  lastError: null
};

function getStatus() {
  const tidy = game.modules.get("tidy5e-sheet");
  const originate = game.modules.get("originate");
  return {
    version: VERSION,
    ...state,
    moduleActive: game.modules.get(MODULE_ID)?.active ?? false,
    tidyActive: tidy?.active ?? false,
    tidyApiAvailable: typeof tidy?.api?.registerCharacterHeaderControls === "function",
    originateActive: originate?.active ?? false,
    levelUpEnabled: originate?.active
      ? game.settings.get("originate", "useLevelUp")
      : null
  };
}

function isOriginateMarked(actor) {
  return actor?.flags?.originate?.createdBy === "originate" ||
    Boolean(actor?.flags?.["hero-genesis"]?.created);
}

async function ensureOriginateMarked(actor) {
  if (isOriginateMarked(actor)) return true;

  // An unmarked (usually imported) actor must opt in before Originate manages it.
  const options = {
    title: "Habilitar evolução com Originate?",
    content: "<p>Este personagem não foi criado no Originate. Ativar o gerenciamento de níveis do Originate para ele?</p><p>Isso adiciona um marcador ao personagem, sem alterar seu nível, classe ou habilidades neste momento.</p>",
    yes: () => true,
    no: () => false,
    defaultYes: false
  };

  const DialogV2 = foundry.applications?.api?.DialogV2;
  const accepted = typeof DialogV2?.confirm === "function"
    ? await DialogV2.confirm({
        window: { title: options.title },
        content: options.content,
        yes: { label: "Habilitar Originate" },
        no: { label: "Cancelar" },
        modal: true,
        rejectClose: false
      })
    : await Dialog.confirm(options);

  if (!accepted) return false;
  await actor.setFlag("originate", "createdBy", "originate");
  return true;
}

async function openLevelUp(actor) {
  const { LevelUpApp } = await import("/modules/originate/scripts/levelup-app.js");

  const openWindows = [
    ...Object.values(ui.windows ?? {}),
    ...Array.from(foundry.applications?.instances?.values?.() ?? [])
  ];

  const existing = openWindows.find(app =>
    app.constructor?.name === "LevelUpApp" && app.actor?.id === actor.id
  );

  if (existing) existing.bringToFront();
  else new LevelUpApp(actor).render(true);
}

function registerControl(api, source) {
  if (state.registered) return;
  state.attempts += 1;
  state.lastAttempt = source;

  if (!game.modules.get("originate")?.active ||
      !game.modules.get("tidy5e-sheet")?.active ||
      typeof api?.registerCharacterHeaderControls !== "function") {
    console.warn(`${MODULE_ID} | API ou dependências indisponíveis em ${source}.`);
    return;
  }

  try {
    // Same synchronous registration that worked in the in-game F12 test.
    api.registerCharacterHeaderControls({
      controls: [{
        action: "rpg-up-originate-level-up",
        icon: "fas fa-hat-wizard",
        label: "Originate — Subir nível",
        position: "header",
        ownership: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,

        visible() {
          try {
            return this.document?.type === "character" &&
              game.settings.get("originate", "useLevelUp") === true;
          } catch {
            return false;
          }
        },

        async onClickAction() {
          const actor = this.document;
          if (actor?.type !== "character") return;

          try {
            if (!(await ensureOriginateMarked(actor))) return;
            await openLevelUp(actor);
          } catch (error) {
            console.error(`${MODULE_ID} | Erro ao abrir o level up:`, error);
            ui.notifications.error("Falha ao abrir o assistente de nível do Originate. Veja o console F12.");
          }
        }
      }]
    });

    state.registered = true;
    state.lastError = null;
    console.info(`${MODULE_ID} v${VERSION} | Botão registrado no Tidy5e via ${source}.`);
  } catch (error) {
    state.lastError = String(error);
    console.error(`${MODULE_ID} | Falha no registro via ${source}:`, error);
  }
}

console.info(`${MODULE_ID} v${VERSION} | Carregado.`);

Hooks.once("tidy5e-sheet.ready", api => {
  registerControl(api, "tidy5e-sheet.ready");
});

Hooks.once("ready", () => {
  const mod = game.modules.get(MODULE_ID);
  if (mod) mod.api = { getStatus };
  registerControl(game.modules.get("tidy5e-sheet")?.api, "ready");
});
