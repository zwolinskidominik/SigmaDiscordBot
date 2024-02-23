const { Client, GuildMember } = require("discord.js");
const AutoRole = require("../../models/AutoRole");

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
    try {
      let guild = member.guild;
      if (!guild) return;
  
      const autoRole = await AutoRole.findOne({ guildId: guild.id });
      if (!autoRole) {
        console.log("AutoRole not found for guild:", guild.id);
        return;
      }
  
      console.log("AutoRole found:", autoRole);
  
      for (const roleId of autoRole.roleIds) {
        try {
          await member.roles.add(roleId);
          console.log(`Role added successfully: ${roleId}`);
        } catch (addRoleError) {
          console.log(`Error adding role ${roleId}: ${addRoleError}`);
        }
      }
    } catch (error) {
      console.log(`Error giving roles automatically: ${error}`);
    }
  };
  