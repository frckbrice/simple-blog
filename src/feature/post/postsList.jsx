
import { selectPostIds } from "./postSlice";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import PulseLoader from "react-spinners/PulseLoader";
import PostsExcerpt from "./PostsExcerpt";
import { useGetPostsQuery } from "./postSlice";

const PostsList = () => {
 
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery();
  
    const orderedPostIds = useSelector(selectPostIds);


  let content;
  if (isLoading) {
    content = <PulseLoader color="#fff" />;
  } else if (isSuccess) {
    content = orderedPostIds
      ?.filter((id, index, arr) => arr.indexOf(id) === index)
      ?.map((postId, index) => <PostsExcerpt key={index} postId={postId} />);
  } else if (isError) {
    content = <p>{error?.message}</p>;
  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  );
};

PostsList.prototype = {
  orderedPostIds: PropTypes.array.isRequired,
};

export default PostsList;
