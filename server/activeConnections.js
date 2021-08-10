// map of active users/ sockets =>  { userId -> socketId },
const onlineUsers = {};

// map of active conversation => { conversationId => userId1, userId2 };
const conversations = {};

module.exports = {
  onlineUsers,
  conversations
};
