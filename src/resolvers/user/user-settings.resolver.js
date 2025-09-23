const { gql } = require("apollo-server-express");
const UserSettings = require("../../models/user/user-settings.model");
const User = require("../../models/user/user.model");
const {
  getRedisClient,
  DEFAULT_EXPIRATION,
  getCache,
  setCache,
} = require("../../redis");
const redis = getRedisClient();

const userSettingsResolvers = {
  Query: {
    userSettings: async (_, { user_id }) => {
      return getCache(`user:${user_id}:settings`, async () => {
        const settings = await UserSettings.findOne({ user_id });
        setCache(`user:${user_id}:settings`, settings);
        return settings;
      }).then((cachedSettings) => {
        return UserSettings.hydrate(cachedSettings);
      });
    },
  },
  Mutation: {
    upsertUserSettings: async (_, { input }, ctx) => {
      const { userId, ...rest } = input;
      const { user } = ctx;
      const foundUser = await User.findOne({ _id: userId });

      if (userId !== foundUser.id || user.email !== foundUser.email) {
        throw "Not authorized";
      }

      const update = {
        artwork_url: rest.artworkUrl,
        description_lang: rest.descriptionLang,
        list_table: rest.listTable,
        show_column: rest.showColumn,
        show_settings: rest.showSettings,
        show_show_column: rest.showShowColumn,
        show_thumb_table: rest.showThumbTable,
        thumb_label_list: rest.thumbLabelList,
        thumb_size_list: rest.thumbSizeList,
        type_artwork_url: rest.typeArtworkUrl,
        filter: rest.filter,
        sorting: rest?.sorting,
      };

      // Remove undefined fields
      Object.keys(update).forEach(
        (key) => update[key] === undefined && delete update[key]
      );

      const settings = await UserSettings.findOneAndUpdate(
        { user_id: userId },
        { $set: update, $setOnInsert: { user_id: userId } },
        { new: true, upsert: true }
      );

      await redis.setEx(
        `user:${userId}:settings`,
        DEFAULT_EXPIRATION,
        JSON.stringify(settings.toObject())
      );
      return settings;
    },
  },
  UserSettings: {
    user: async (parent) => {
      if (!parent.user_id) return null;
      return User.findById(parent.user_id);
    },
    // Optionally, map snake_case to camelCase for GraphQL output
    artworkUrl: (parent) => parent.artwork_url,
    descriptionLang: (parent) => parent.description_lang,
    listTable: (parent) => parent.list_table,
    showColumn: (parent) => parent.show_column,
    showSettings: (parent) => parent.show_settings,
    showShowColumn: (parent) => parent.show_show_column,
    showThumbTable: (parent) => parent.show_thumb_table,
    thumbLabelList: (parent) => parent.thumb_label_list,
    thumbSizeList: (parent) => parent.thumb_size_list,
    typeArtworkUrl: (parent) => parent.type_artwork_url,
    filter: (parent) => parent.filter,
    sorting: (parent) => parent.sorting,
  },
};

const userSettingsTypeDefs = gql`
  type Filter {
    name: String
    types: String
  }

  type Sorting {
    key: String
    dir: String
  }

  type UserSettings {
    id: ID!
    user: User
    artworkUrl: String
    descriptionLang: String
    listTable: Boolean
    showColumn: String
    showSettings: Boolean
    showShowColumn: Boolean
    showThumbTable: Boolean
    thumbLabelList: String
    thumbSizeList: String
    typeArtworkUrl: String
    filter: Filter
    sorting: [Sorting]
  }

  input FilterInput {
    name: String
    types: String
  }

  input SortingInput {
    key: String
    dir: String
  }

  input UserSettingsInput {
    userId: ID!
    artworkUrl: String
    descriptionLang: String
    listTable: Boolean
    showColumn: String
    showSettings: Boolean
    showShowColumn: Boolean
    showThumbTable: Boolean
    thumbLabelList: String
    thumbSizeList: String
    typeArtworkUrl: String
    filter: FilterInput
    sorting: [SortingInput]
  }

  type Query {
    userSettings(user_id: ID!): UserSettings
  }

  type Mutation {
    upsertUserSettings(input: UserSettingsInput!): UserSettings
  }
`;

module.exports = { userSettingsTypeDefs, userSettingsResolvers };
