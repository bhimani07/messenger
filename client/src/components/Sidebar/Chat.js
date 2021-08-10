import React, { Component } from "react";
import { Box, Badge } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { updateConversation } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const styles = {
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
};

class Chat extends Component {
  handleClick = async (conversation) => {
    await this.props.setActiveChat(conversation.otherUser.username);
    if (conversation.id) {
        await this.updateConversationHelper(conversation);
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    // if there are messages coming from sender in active chat to receiver then dispatch it to mark it as seen!
    const conversation = this.props.conversation;
    if (conversation.unseenCount > 0 && this.props.activeConversation === this.props.conversation.otherUser.username) {
      await this.updateConversationHelper(conversation);
    }
  }

  updateConversationHelper = async (conversation) => {
    const seenMessagesByCurrentUser = conversation.messages.filter(message => message.senderId === conversation.otherUser.id);
    const lastMessageSeenId = seenMessagesByCurrentUser?.[seenMessagesByCurrentUser.length - 1]?.id;
    this.props.updateConversation(conversation.id, conversation.otherUser.id, this.props.user.id, lastMessageSeenId);
  }

  render() {
    const { classes, conversation } = this.props;
    const { otherUser, unseenCount } = conversation;
    return (
      <Box
        onClick={() => this.handleClick(this.props.conversation)}
        className={classes.root}
      >
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={this.props.conversation} hasNewMessages={unseenCount > 0}/>
        { unseenCount > 0 && this.props.activeConversation !== otherUser.username && <Badge badgeContent={unseenCount} color="primary"/> }
      </Box>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    updateConversation: (conversationId, senderId, recipientId, lastMessageSeenId) => {
      dispatch(updateConversation({conversationId, senderId, recipientId, lastMessageSeenId}));
    }
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    activeConversation: state.activeConversation
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Chat));
