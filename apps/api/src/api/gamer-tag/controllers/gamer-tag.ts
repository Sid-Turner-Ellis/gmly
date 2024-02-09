/**
 * gamer-tag controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::gamer-tag.gamer-tag", {
  async create(ctx) {
    const requestData = ctx.request.body.data ?? {};

    const profile = await strapi
      .service("api::profile.profile")
      .findOneByWalletAddress(ctx.state.wallet_address, {
        populate: {
          gamer_tags: {
            populate: {
              game: true,
            },
          },
        },
      });

    const hasGamerTagForGame = profile.gamer_tags.some(
      ({ game }) => game.id === requestData.game,
    );

    if (hasGamerTagForGame) {
      ctx.badRequest("AlreadyHaveGamerTagForGame");
      return;
    }

    // Gamer tag must be unique per game
    const gamerTagIsUniqueForGame = await strapi
      .service("api::gamer-tag.gamer-tag")
      .isUniqueForGame(requestData.game, requestData.tag);

    if (!gamerTagIsUniqueForGame) {
      ctx.badRequest("GamerTagTakenForGame");
      return;
    }
    ctx.request.body.data.profile = profile.id;
    const newlyCreatedGamerTag = await super.create(ctx);
    return newlyCreatedGamerTag;
  },
  async update(ctx) {
    const requestData = ctx.request.body.data ?? {};
    const gamerTagId = parseInt(ctx.params.id);
    const profile = await strapi
      .service("api::profile.profile")
      .findOneByWalletAddress(ctx.state.wallet_address);

    const gamerTag = await strapi
      .service("api::gamer-tag.gamer-tag")
      .findOne(gamerTagId, { populate: { game: true, profile: true } });

    if (profile.id !== gamerTag.profile.id) {
      ctx.badRequest("Cannot update a gamer tag that does not belong to you");
      return;
    }

    // Can only update the tag value
    if (requestData.game && requestData.game !== gamerTag.game.id) {
      ctx.badRequest("Cannot update the game for a gamer tag");
      return;
    }

    if (requestData.profile && requestData.profile !== gamerTag.profile.id) {
      ctx.badRequest("Cannot update the profile for a gamer tag");
      return;
    }

    // The new tag must be unique
    const tagWasChanged = requestData.tag && requestData.tag !== gamerTag.tag;

    if (tagWasChanged) {
      const gamerTagIsUniqueForGame = await strapi
        .service("api::gamer-tag.gamer-tag")
        .isUniqueForGame(gamerTag.game.id, requestData.tag);

      if (!gamerTagIsUniqueForGame) {
        ctx.badRequest("Gamer tag is already taken for this game");
        return;
      }
    }

    // TODO: Cannot update a gamer tag if the users team for that game has pending results

    const updatedGamerTag = await super.update(ctx);
    return updatedGamerTag;
  },
  async delete(ctx) {
    const gamerTagId = parseInt(ctx.params.id);
    const profile = await strapi
      .service("api::profile.profile")
      .findOneByWalletAddress(ctx.state.wallet_address, {
        populate: {
          team_profiles: {
            populate: {
              team: {
                populate: {
                  game: true,
                },
              },
            },
          },
          gamer_tags: {
            populate: {
              game: true,
            },
          },
        },
      });

    const gamerTagToDelete = profile.gamer_tags.find(
      (gamerTag) => gamerTag.id === gamerTagId,
    );

    // Validate the gamer tag is for that profile
    if (!gamerTagToDelete) {
      ctx.badRequest("Cannot delete a gamer tag that does not belong to you");
      return;
    }

    // Validate the gamer tag is not for a game they are in a team for
    const gamerTagGameId = gamerTagToDelete.game.id;

    const teamProfileForGame = profile.team_profiles
      .filter((teamProfile) => !teamProfile.is_pending)
      .find((teamProfile) => teamProfile.team.game.id === gamerTagGameId);

    if (teamProfileForGame) {
      ctx.badRequest(
        "Cannot delete a gamer tag for a game you are in a team for",
      );
      return;
    }

    const deletedGamerTag = await super.delete(ctx);
    return deletedGamerTag;
  },
});
