import { useSelector } from "react-redux";
import { selectUserById } from "./userSlice";
import { useParams, Link } from "react-router-dom";
import {
  useGetPostsByUserIdQuery,
} from "../post/postSlice";
import { PulseLoader } from "react-spinners";

const UserPage = () => {
  const { userId } = useParams();

  const user = useSelector((state) => selectUserById(state, Number(userId)));

  const {
    data: userPosts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsByUserIdQuery(userId);

  if (!user) {
    return (
      <section>
        <p>No User Found</p>
      </section>
    );
  }

  let content;
  if (isLoading) {
    content = <PulseLoader color="#fff" />;
  } else if (isSuccess) {
    const { ids, entities } = userPosts;
    content = ids.map((id) => (
      <li key={id}>
        <Link to={`/post/${id}`}>{entities[id].title}</Link>
      </li>
    ));
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{content}</ol>
    </section>
  );
};

export default UserPage;
