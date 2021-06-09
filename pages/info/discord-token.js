module.exports = {
  types: ["info", "leave_guild"],
  async run(queries) {
    const { type, query: token, guildId } = queries;
    if (await getUserData().then((d) => d.message))
      return { error: "Invalid token!" };

    if (type === "info") {
      const data = {};

      // general
      const general = await getUserData();
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
          : `https://cdn.discordapp.com/avatars/${general.id}/${general.avatar}.png`;

      // connections
      const connections = await getUserData("/connections");
      data.connections = [];
      if (connections[0]) {
        connections.forEach((connection) => {
          data.connections.push({
            type: connection.type,
            name: connection.name,
            public: connection.visibility === 1 ? true : false,
            show_activity: connection.show_activity,
            access_token: connection.access_token || null,
            integrations: connection.integrations,
          });
        });
      }

      // settings
      const settings = await getUserData("/settings");
      data.settings = {};
      data.settings.status = settings.status;
      data.settings.locale = settings.locale;
      data.settings.theme = settings.theme;
      data.settings.developer_mode = settings.developer_mode;
      data.settings.timezone_offset = settings.timezone_offset;

      // billing
      const billing = await getUserData("/billing/payment-sources");
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
      const subscriptions = await getUserData("/billing/subscriptions");
      data.has_nitro = false;
      data.subscriptions = [];
      if (subscriptions[0]) {
        data.has_nitro = true;
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
      const gifts = await getUserData("/entitlements/gifts");
      data.gifts = [];
      if (gifts[0]) {
        gifts.forEach((gift) => {
          data.gifts.push(gift);
        });
      }

      // guilds
      const guilds = await getUserData("/guilds");
      data.own_guilds = [];
      data.not_own_guilds = [];
      if (guilds[0]) {
        guilds
          .filter((g) => !g.owner)
          .forEach((guild) => {
            if (!guild) return;
            data.not_own_guilds.push({
              id: guild.id,
              name: guild.name,
              icon: `https://cdn.discordapp.com/avatars/${guild.id}/${guild.icon}.png`,
              features: guild.features,
            });
          });
        guilds
          .filter((g) => g.owner)
          .forEach((guild) => {
            if (!guild) return;
            data.own_guilds.push({
              id: guild.id,
              name: guild.name,
              icon: `https://cdn.discordapp.com/avatars/${guild.id}/${guild.icon}.png`,
              features: guild.features,
            });
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

    function getUserData(endpont = "") {
      return fetch(`/users/@me${endpont}`);
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
