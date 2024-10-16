import { Types } from "mongoose";
import { ObjectId } from "mongodb";
import {
  GroupChatClass,
  GroupChatModel,
  SingleChatClass,
  SingleChatModel,
} from "~/models/chat.model";
import { AppFile, CHAT_TYPES } from "~/types";

type ConversationMetaData =
  | SingleConversationMetaData
  | GroupConversationMetaData;

type SingleConversationMetaData = {
  type: CHAT_TYPES.SINGLE;
  lastChat?: SingleChatClass;
};

type GroupConversationMetaData = {
  type: CHAT_TYPES.GROUP;
  lastChat?: GroupChatClass;
  name: string;
  groupId: Types.ObjectId;
  groupPhoto?: AppFile;
};

type ConversationMetaDataArgs = {
  page: number;
  limit: number;
  userId: Types.ObjectId;
};

export async function conversationMetaData({
  page,
  limit,
  userId,
}: ConversationMetaDataArgs) {
  const singleMetaData = SingleChatModel.aggregate([
    {
      $match: {
        $or: [{ sender: userId }, { receiver: userId }],
      },
    },

    { $sort: { createdAt: -1 } },

    {
      $group: {
        _id: {
          $cond: {
            if: { $eq: ["sender", userId] },
            then: "receiver",
            else: "sender",
          },
        },
        lastChat: { $first: "$$ROOT" },
      },
    },

    {
      $skip: (page - 1) * limit,
    },

    {
      $limit: limit,
    },
  ]);

  const groupMetaData = GroupChatModel.aggregate([
    {
      $match: {
        group: { $exists: true },
      },
    },

    {
      $lookup: {
        from: "groups",
        localField: "group",
        foreignField: "_id",
        as: "groupInfo",
        pipeline: [
          {
            $project: { name: 1, _id: 1 },
          },
        ],
      },
    },

    {
      $match: {
        "groupInfo.members": userId,
      },
    },

    {
      $sort: {
        createdAt: -1,
      },
    },

    {
      $group: {
        _id: "group",
        lastChat: { $first: "$$ROOT" },
      },
    },

    {
      $project: {
        lastChat: 1,
        "groupInfo.name": 1,
        "groupInfo._id": 1,
        "groupInfo.groupPhoto": 1,
      },
    },

    {
      $skip: (page - 1) * limit,
    },

    {
      $limit: limit,
    },
  ]);

  const [[groupMetaDataResult], [singleMetaDataResult]] = await Promise.all([
    groupMetaData,
    singleMetaData,
  ]);

  console.log({ groupMetaDataResult, singleMetaDataResult });

  return {
    conversationMetaData: [
      ...groupMetaDataResult,
      ...singleMetaDataResult,
    ] as ConversationMetaData[],
  };
}

const convoNav = await conversationMetaData({
  page: 1,
  limit: 40,
  userId: new ObjectId("670523f5af0ae50f723e5c2e"),
});

const convo = convoNav.conversationMetaData[0];

if (convo.type === CHAT_TYPES.SINGLE) {
}
