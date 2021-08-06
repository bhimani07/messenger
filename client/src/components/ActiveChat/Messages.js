import React from "react";
import { Avatar, Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  avatar: {
    height: 15,
    width: 15,
    position: "absolute",
    right: 0,
    marginBottom: "5%",
    transform: "translate(-40px, 0px)",
    backgroundColor: "#3A8DFF",
  },
}));

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId } = props;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <React.Fragment>
            <SenderBubble key={message.id} text={message.text} time={time}/>
            {otherUser.lastSeenMessageId === message.id &&
            <Avatar alt={otherUser.username} src={otherUser.photoUrl}
                    className={classes.avatar}/>}
          </React.Fragment>
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time}
                           otherUser={otherUser}/>
        );
      })}
    </Box>
  );
};

export default Messages;
