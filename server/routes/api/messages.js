const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // check if conversation already exist in database
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findConversationById(conversationId);

      if (conversation
        && !(conversation.user1Id === senderId || conversation.user1Id === recipientId)
        && !(conversation.user2Id === senderId || conversation.user2Id === recipientId)) {
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
      conversationId: conversation.id,
    });

    res.json({message, sender});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
