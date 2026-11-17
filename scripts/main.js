/**
 * RPG Up — Originate + Tidy5e
 * Foundry VTT v14 / dnd5e 6.x
 *
 * Registers a Tidy5e character sheet header control using the official Tidy API.
 * The Originate wizard and actor-marker rules remain owned by Originate.
 */
const MODULE_ID = "rpg-up-originate-tidy5e";
let registrationStarted = false;
let registered = false;

async function registerOriginateControl(tidyApi) {
  if (registrationStarted || registered) return;
  if (!game.modules.get("originate")?.active ||
      !game.modules.get("tidy5e-sheet")?.active ||
      typeof tidyApi?.registerCharacterHeaderControls !== "function") return;

  registrationStarted = true;
  try {
    // Reuse Originate's exact actor eligibility logic (including item markers).
    const { hasOriginateActorMarkers } = await import(
      "/modules/originate/scripts/shared/resolution-core.js"
    );
    if (typeof hasOriginateActorMarkers !== "function") {
      throw new Error("Originate marker API unavailable");
    }

    tidyApi.registerCharacterHeaderControls({
      controls: [{
        action: "rpg-up-originate-level-up",
        icon: "fas fa-hat-wizard",
        label: "Originate — Subir nível",
        position: "header",
        ownership: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,

        visible() {
          const actor = this.document;
          if (actor?.type !== "character") return false;
          try {
            return game.settings.get("originate", "useLevelUp") &&
              hasOriginateActorMarkers(actor);
          } catch {
            return false;
          }
        },

        async onClickAction() {
          const actor = this.document;
          if (!actor || !hasOriginateActorMarkers(actor)) return;

          try {
            const { LevelUpApp } = await import(
              "/modules/originate/scripts/levelup-app.js"
            );
            const openWindows = [
              ...Object.values(ui.windows ?? {}),
              ...Array.from(foundry.applications?.instances?.values?.() ?? [])
            ];
            const existing = openWindows.find(app =>
              app.constructor?.name === "LevelUpApp" &&
              app.actor?.id === actor.id
            );

            if (existing) existing.bringToFront();
            else new LevelUpApp(actor).render(true);
          } catch (error) {
            console.error(`${MODULE_ID} | Falha ao abrir o Originate:`, error);
            ui.notifications.error("Não foi possível abrir o Level Up do Originate.");
          }
        }
      }]
    });

    registered = true;
    console.info(`${MODULE_ID} | Botão do Originate registrado no Tidy5e.`);
  } catch (error) {
    console.error(`${MODULE_ID} | Integração indisponível:`, error);
  } finally {
    registrationStarted = false;
  }
}

// Recommended entry point from the Tidy5e developer API.
Hooks.once("tidy5e-sheet.ready", (api) => {
  void registerOriginateControl(api);
});

// Fallback if the Tidy ready hook ran before this module was loaded.
Hooks.once("ready", () => {
  void registerOriginateControl(game.modules.get("tidy5e-sheet")?.api);
});
