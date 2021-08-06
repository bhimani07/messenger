const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // check if conversation already exist in the database and whether if sender is authorized to post messages in the conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findConversationById(conversationId);

      const isUserInConversation = conversation.user1Id === senderId || conversation.user2Id === senderId;
      if (conversation && !isUserInConversation) {
        return res.sendStatus(403);
      }
    }

    // create conversation if it doesn't exist.
    if (!conversation) {
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }

    const message = await Message.create({
      senderId,
      text,
      isSeen: false,
      conversationId: conversation.id
    });

    res.json({message, sender});
  } catch (error) {
    next(error);
  }
});

// expects { conversationId } in body
router.patch("/markSeen", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    if (!req.body.conversationId) {
      return res.sendStatus(400);
    }
    if (!req.body.senderId) {
      return res.sendStatus(400);
    }
    const receiptId = req.user.id;
    const { conversationId } = req.body;

    //check if requesting user belong to the conversation.
    const conversation = await Conversation.findConversationById(conversationId);
    const isUserInConversation = conversation?.user1Id === receiptId || conversation?.user2Id === receiptId;
    if (!conversation || !isUserInConversation) {
      return res.sendStatus(403);
    }

    await Message.update({isSeen: true},{
      where:{
        conversationId,
        isSeen: false,
        senderId: {
          [Op.not] : receiptId,
        }
      }
    });

    res.json({success: true});
  } catch (error) {
    next(error);
  }
})

module.exports = router;
