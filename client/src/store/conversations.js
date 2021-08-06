import {
  addNewConvoToStore,
  addOnlineUserToStore,
  addSearchedUsersToStore,
  removeOfflineUserFromStore,
  addMessageToStore,
  resetUnseenCountToStore,
  notifySeenOnByReceiptToStore
} from "./utils/reducerFunctions";

// ACTIONS

const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_MESSAGE = "SET_MESSAGE";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_OFFLINE_USER = "REMOVE_OFFLINE_USER";
const SET_SEARCHED_USERS = "SET_SEARCHED_USERS";
const CLEAR_SEARCHED_USERS = "CLEAR_SEARCHED_USERS";
const ADD_CONVERSATION = "ADD_CONVERSATION";
const RESET_UNSEEN_COUNT = "RESET_UNSEEN_COUNT";
const NOTIFY_MESSAGE_SEEN = "NOTIFY_MESSAGE_SEEN";

// ACTION CREATORS

export const gotConversations = (conversations) => {
  return {
    type: GET_CONVERSATIONS,
    conversations,
  };
};

export const setNewMessage = (message, sender) => {
  return {
    type: SET_MESSAGE,
    payload: { message, sender: sender || null },
  };
};

export const addOnlineUser = (id) => {
  return {
    type: ADD_ONLINE_USER,
    id,
  };
};

export const removeOfflineUser = (id) => {
  return {
    type: REMOVE_OFFLINE_USER,
    id,
  };
};

export const setSearchedUsers = (users) => {
  return {
    type: SET_SEARCHED_USERS,
    users,
  };
};

export const clearSearchedUsers = () => {
  return {
    type: CLEAR_SEARCHED_USERS,
  };
};

// add new conversation when sending a new message
export const addConversation = (newMessage, recipientId) => {
  return {
    type: ADD_CONVERSATION,
    payload: { recipientId, newMessage },
  };
};

// add new conversation when sending a new message
export const resetUnseenCount = (conversationId) => {
  return {
    type: RESET_UNSEEN_COUNT,
    payload: { conversationId },
  };
};

export const notifyMessageSeen = (conversationId, messageId) => {
  return {
    type: NOTIFY_MESSAGE_SEEN,
    payload: { conversationId, messageId },
  };
};

// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_CONVERSATIONS:
      console.log(action.conversations);
      return [...action.conversations.map(conversation => {
        return {...conversation, messages: conversation.messages?.reverse()}
      })];
    case SET_MESSAGE:
      return addMessageToStore(state, action.payload);
    case ADD_ONLINE_USER: {
      return addOnlineUserToStore(state, action.id);
    }
    case REMOVE_OFFLINE_USER: {
      return removeOfflineUserFromStore(state, action.id);
    }
    case SET_SEARCHED_USERS:
      return addSearchedUsersToStore(state, action.users);
    case CLEAR_SEARCHED_USERS:
      return state.filter((convo) => convo.id);
    case ADD_CONVERSATION:
      return addNewConvoToStore(
        state,
        action.payload.newMessage,
        action.payload.recipientId,
      );
    case RESET_UNSEEN_COUNT:
      return resetUnseenCountToStore(
        state,
        action.payload
      )
    case NOTIFY_MESSAGE_SEEN:
      return notifySeenOnByReceiptToStore(
        state,
        action.payload
      )
    default:
      return state;
  }
};

export default reducer;
