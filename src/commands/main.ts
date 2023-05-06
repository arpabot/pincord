import { APIApplicationCommandAttachmentOption } from "discord-api-types/v10";
import { Client, reply } from "../../cloudcord";
import config, { raw } from "../config";
import { APIApplicationCommandInteraction } from "discord-api-types/v10";
import { APIContextMenuGuildInteraction } from "discord-api-types/v10";
import { APIMessageApplicationCommandGuildInteraction } from "discord-api-types/v10";

export default function (client: Client<Env, typeof raw>, env: Env) {
  class Main {
    @client.command(config.pin)
    async pin(interaction: APIMessageApplicationCommandGuildInteraction) {
      const conf =
        raw[client.commands.toSupportedLocale(interaction.locale, raw)];
      const message = Object.values(interaction.data.resolved.messages)[0];
      if (message.pinned)
        return reply({ content: conf._.alreadyPinned, ephemeral: true });
      const response = await client.request(
        new Request(`channels/${message.channel_id}/pins/${message.id}`, {
          method: "PUT",
          headers: {
            "X-Audit-Log-Reason":
              "Pinned by " +
              interaction.member.user.username +
              " (" +
              interaction.member.user.id +
              ")",
          },
        })
      );
      if (!response.ok)
        return reply({ content: conf._.fuckYourSelf, ephemeral: true });
      return reply({ content: conf._.pinned, ephemeral: true });
    }

    @client.command(config.unpin)
    async unpin(interaction: APIMessageApplicationCommandGuildInteraction) {
      const conf =
        raw[client.commands.toSupportedLocale(interaction.locale, raw)];
      const message = Object.values(interaction.data.resolved.messages)[0];
      if (!message.pinned)
        return reply({ content: conf._.notPinned, ephemeral: true });
      const response = await client.request(
        new Request(`channels/${message.channel_id}/pins/${message.id}`, {
          method: "DELETE",
          headers: {
            "X-Audit-Log-Reason":
              "Upinned by " +
              interaction.member.user.username +
              " (" +
              interaction.member.user.id +
              ")",
          },
        })
      );
      if (!response.ok)
        return reply({ content: conf._.fuckYourSelf, ephemeral: true });
      return reply({ content: conf._.unpinned, ephemeral: true });
    }
  }
  return Main;
}
