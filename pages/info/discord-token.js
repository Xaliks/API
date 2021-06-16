module.exports = {
  types: ["info", "leave_guild"],
  examples: [
    "/discord-token?type=info&token=TOKEN",
    "/discord-token?type=leave_guild&token=TOKEN&guildId=GUILD_ID",
  ],
  async run(queries) {
    const { type, token, guildId } = queries;
    if (!type) return { error: "Missing type queries" };
    if (!token) return { error: "Missing token queries" };

    if (await fetch("/users/@me").then((d) => d.message))
      return { error: "Invalid token!" };

    if (type === "info") {
      const data = {};

      // general
      const general = await fetch("/users/@me");
      data.tag = general.username + "#" + general.discriminator;
      data.id = general.id;
      data.email = general.email;
      data.email_verified = general.verified;
      data.phone = general.phone;
      data.mfa = general.mfa_enabled;
      data.locale = general.locale;
      data.avatar =
        general.avatar === null
          ? null
          : `https://cdn.discordapp.com/avatars/${general.id}/${
              general.avatar.startsWith("a_")
                ? `${general.avatar}.gif`
                : `${general.avatar}.png`
            }`;

      // connections
      const connections = await fetch("/users/@me/connections");
      data.connections = [];
      if (connections[0]) {
        connections.forEach((connection) => {
          data.connections.push({
            type: connection.type,
            name: connection.name,
            public: connection.visibility === 1 ? true : false,
            show_activity: connection.show_activity,
            access_token: connection.access_token || null,
          });
        });
      }

      // settings
      const settings = await fetch("/users/@me/settings");
      data.settings = {};
      data.settings.status = settings.status;
      data.settings.custom_status = settings.custom_status
        ? settings.custom_status.text
        : null;
      data.settings.theme = settings.theme;
      data.settings.developer_mode = settings.developer_mode;
      data.settings.timezone_offset = settings.timezone_offset;
      data.settings.contact_sync_enabled = settings.contact_sync_enabled;

      // billing
      const billing = await fetch("/users/@me/billing/payment-sources");
      data.payments = [];
      if (billing[0]) {
        billing.forEach((bill) => {
          data.payments.push({
            valid: !bill.invalid,
            brand: bill.brand,
            name: bill.billing_address.name,
            last_4: bill.last_4,
            expires: `${
              bill.expires_month.toString().length === 2
                ? bill.expires_month
                : "0" + bill.expires_month
            }/${bill.expires_year}`,
            country: bill.country,
            default: bill.default,

            billing_address: {
              address:
                bill.billing_address.line_1 + bill.billing_address.line_2 ===
                null
                  ? ""
                  : bill.billing_address.line_2,
              city: bill.billing_address.city,
              state: bill.billing_address.state,
              country: bill.billing_address.country,
            },
          });
        });
      }

      // subscriptions(nitro)
      const subscriptions = await fetch("/users/@me/billing/subscriptions");
      const subscription_slots = await fetch(
        "/users/@me/guilds/premium/subscription-slots"
      );
      data.subscriptions = [];
      data.subscription_slots = [];
      if (subscription_slots[0]) {
        subscription_slots.forEach((slot) => {
          data.subscription_slots.push({
            id: slot.id,
            subscription_id: slot.subscription_id,
            guild_subscription: slot.premium_guild_subscription
              ? {
                  id: slot.premium_guild_subscription.id,
                  guild_id: slot.premium_guild_subscription.guild_id,
                  ended: slot.premium_guild_subscription.ended,
                }
              : null,
            canceled: slot.canceled,
            cooldown_ends_at: slot.cooldown_ends_at,
          });
        });
      }
      if (subscriptions[0]) {
        subscriptions.forEach((subs) => {
          data.subscriptions.push({
            start: subs.current_period_start,
            end: subs.current_period_end,
            plan: subs.payment_gateway_plan_id,
            currency: subs.currency,
          });
        });
      }

      // gifts
      const gifts = await fetch("/users/@me/entitlements/gifts");
      data.gifts = gifts;

      // applications
      const applications = await fetch("/applications");
      data.applications = [];
      if (applications[0]) {
        applications.forEach(async (application) => {
          data.applications.push({
            id: application.id,
            name: application.name,
            description: application.description,
            summary: application.summary,
            icon:
              application.icon === null
                ? null
                : `https://cdn.discordapp.com/app-icons/${application.id}/${application.icon}.png`,
            hook: application.hook,
            verify_key: application.verify_key,
            secret: application.secret,
            redirect_uris: application.redirect_uris,
            verification_state: application.verification_state,
            interactions_endpoint_url: application.interactions_endpoint_url,
            integration_public: application.integration_public,
            integration_require_code_grant:
              application.integration_require_code_grant,
            owner: {
              id: application.owner.id,
              tag:
                application.owner.username +
                "#" +
                application.owner.discriminator,
              avatar:
                application.owner.avatar === null
                  ? null
                  : `https://cdn.discordapp.com/avatars/${
                      application.owner.id
                    }/${
                      application.owner.avatar.startsWith("a_")
                        ? `${application.owner.avatar}.gif`
                        : `${application.owner.avatar}.png`
                    }`,
            },
            bot: application.bot
              ? {
                  id: application.bot.id,
                  tag:
                    application.bot.username +
                    "#" +
                    application.bot.discriminator,
                  token: application.bot.token,
                  bot_public: application.bot_public,
                  bot_require_code_grant: application.bot_require_code_grant,
                  avatar:
                    application.bot.avatar === null
                      ? null
                      : `https://cdn.discordapp.com/avatars/${application.bot.id}/${application.bot.avatar}.png`,
                }
              : null,
          });
        });
      }

      // teams
      const teams = await fetch("/teams");
      data.teams = [];
      if (teams[0]) {
        teams.forEach((team) => {
          data.teams.push({
            id: team.id,
            name: team.name,
            owner_id: team.owner_user_id,
            icon:
              icon === null
                ? null
                : `https://cdn.discordapp.com/team-icons/${team.id}/${team.icon}.png`,
          });
        });
      }

      // guilds
      const guilds = await fetch("/users/@me/guilds");
      data.own_guilds = [];
      data.adm_guilds = [];
      data.guilds = [];
      if (guilds[0]) {
        guilds.forEach((guild) => {
          const guild_data = {
            id: guild.id,
            name: guild.name,
            icon:
              guild.icon === null
                ? null
                : `https://cdn.discordapp.com/icons/${guild.id}/${
                    guild.icon.startsWith("a_")
                      ? `${guild.icon}.gif`
                      : `${guild.icon}.png`
                  }`,
            permissions: guild.permissions,
            features: guild.features,
          };
          if (guild.owner) {
            data.own_guilds.push(guild_data);
          } else if ((3 & Number(guild.permissions)) == 3) {
            data.adm_guilds.push(guild_data);
          } else {
            data.guilds.push(guild_data);
          }
        });
      }

      return data;
    }
    if (type === "leave_guild") {
      if (!guildId) return { error: "Missing guildId queries" };

      const data = await fetch(`/users/@me/guilds/${guildId}`, "DELETE", false);
      if (data.includes("Unknown Guild")) return { error: "Unknown guild" };
      if (data.includes("Invalid Guild")) return { error: "Invalid Guild" };

      return { success: true };
    }

    function fetch(endpoint, method = "GET", json = true) {
      return require("node-fetch")(
        `https://canary.discord.com/api/v9${endpoint}`,
        {
          method,
          headers: {
            Authorization: encodeURIComponent(token),
          },
        }
      ).then((resp) => (json ? resp.json() : resp.text()));
    }
  },
};
