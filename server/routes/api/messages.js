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
      seenOn: null,
      conversationId: conversation.id
    });

    res.json({message, sender});
  } catch (error) {
    next(error);
  }
});

// expects { conversationId } in body
router.patch("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    if (!req.body.conversationId) {
      return res.sendStatus(400);
    }
    const receiptId = req.user.id;
    const { conversationId } = req.body;

    await Message.update({seenOn: new Date()},{
      where:{
        conversationId,
        seenOn: null,
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
