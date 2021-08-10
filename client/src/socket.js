import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  notifyMessageSeen
} from "./store/conversations";

const SocketClient = (function () {
  let socket;

  function createInstance() {
    createSocketAndInitializeListeners();
  }

  function createSocketAndInitializeListeners() {
    const token = localStorage.getItem("messenger-token");
    socket = io(window.location.origin, {
      query: `token=${token}`,
    });
    initializeSocketListeners();
  }

  function initializeSocketListeners() {
    socket.on("connect", () => {
      console.log("connected to server");

      socket.on("add-online-user", (id) => {
        store.dispatch(addOnlineUser(id));
      });

      socket.on("remove-offline-user", (id) => {
        store.dispatch(removeOfflineUser(id));
      });

      socket.on("new-message", (data) => {
        store.dispatch(setNewMessage(data.message, data.sender));
      });

      socket.on("seen-by-user", (data) => {
        store.dispatch(notifyMessageSeen(data.conversationId, data.messageId));
      });
    });
  }

  return {
    getSocket: function () {
      if (!socket) {
        createInstance();
      }
      return socket;
    }
  };
})();

export default SocketClient;
