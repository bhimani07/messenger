import React, { Component } from "react";
import { Box, Badge } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { updateUnseenCount } from "../../store/utils/thunkCreators";
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
    if (conversation.id) await this.props.updateUnseenCount(conversation.id, this.props.user.id);
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    // if there are messages coming from sender in active chat to receiver then dispatch it to mark it as seen!
    if (this.props.conversation.unseenCount > 0 && this.props.activeConversation === this.props.conversation.otherUser.username) {
        await this.props.updateUnseenCount(this.props.conversation.id, this.props.user.id);
      }
  }

  render() {
    const { classes } = this.props;
    const otherUser = this.props.conversation.otherUser;
    const unseenCount = this.props.conversation.unseenCount;
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
        <ChatContent conversation={this.props.conversation} />
        { unseenCount > 0 && this.props.activeConversation !== otherUser.username ?
          <Badge badgeContent={unseenCount} color="primary"/> : <React.Fragment/> }
      </Box>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    updateUnseenCount: (conversationId, userId) => {
      dispatch(updateUnseenCount({conversationId, userId}));
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
