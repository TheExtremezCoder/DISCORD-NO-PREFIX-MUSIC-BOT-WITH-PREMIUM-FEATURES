import { PermissionFlagsBits } from "discord.js";
import OrasDispatcher from "../../wrapper/Dispatcher.js";
import OrasCommand from "../../abstract/OrasCommand.js";
export default class Connect extends OrasCommand {
    constructor(client) {
        super(client);
        this.name = "connect";
        this.aliases = ["join", "conn"];
        this.cat = "music";
        this.desc = "Connects the bot to a voice channel";
        this.dev = false;
        this.vc = true;
        this.samevc = false;
        this.premium = {
            guild: false,
            user: false,
        };
        this.exec = async (message, args, prefix) => {
            try {
                const dispatcher = this.client.api.get(message.guild.id);
                if (dispatcher && dispatcher.player) {
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guild.id)
                                .setDescription(`❌ I am already Connected to ${message.guild.members.me.voice.channel.name}`),
                        ],
                    });
                }
                else {
                    let channel = message.member.voice.channel;
                    if (!message.guild.members.me
                        .permissionsIn(channel)
                        .has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]))
                        return message.reply({
                            embeds: [
                                this.client.utils
                                    .premiumEmbed(message.guild.id)
                                    .setDescription(`❌ I don't have required permissions to connect to that channel`)
                            ],
                        });
                    if (this.client.api.get(message.guild.id)) {
                        this.client.api.get(message.guild.id).destroy();
                        this.client.api.delete(message.guild.id);
                    }
                    let node = this.client.shoukaku.getNode();
                    let player = await node.joinChannel({
                        guildId: message.guildId,
                        channelId: message.member.voice.channelId,
                        shardId: message.guild.shardId,
                        deaf: true,
                    });
                    const dispatcher = new OrasDispatcher(this.client, message.guild, message.channel, player);
                    this.client.api.set(message.guildId, dispatcher);
                    return message.reply({
                        embeds: [
                            this.client.utils
                                .premiumEmbed(message.guild.id)
                                .setDescription(`✅   Successfully **Connected** to Your voice channel.`)
                        ],
                    });
                }
            }
            catch (e) {
                return message.reply({ content: `❌ I couldn't Connect to that Voice Channel!` });
            }
        };
    }
}
//# sourceMappingURL=Connect.js.map