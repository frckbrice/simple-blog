import { useAddReactionMutation } from "./postSlice";
import React from "react";
import PropTypes from "prop-types";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

//eslint-disable-next-line
const ReactionButton = ({ post }) => {
  const [addReaction] = useAddReactionMutation();

  const reactionButtons = Object.entries(reactionEmoji)?.map(
    ([emojiName, emoji]) => {
      return (
        <button
          key={emoji}
          type="button"
          className="form-button-emoji"
          onClick={() => {
            const newValue = post.reactions[emojiName] + 1;
            addReaction({
              postId: post.id,
              reactions: { ...post.reactions ,
              [emojiName]: newValue},
            });
          }}
        >
          {emoji}&nbsp; {post.reactions[emojiName]}
        </button>
      );
    }
  );

  return <div>{reactionButtons}</div>;
};

ReactionButton.prototype = {
  reaction: PropTypes.object,
  dispatch: PropTypes.func,
  post: PropTypes.object,
};

//eslint-disable-next-line
export default React.memo(ReactionButton);
