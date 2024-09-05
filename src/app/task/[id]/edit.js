import { useRouter } from "next/router";
import useSWR from "swr";
import Form from "../../../components/TaskForm";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EditTask = ({ users }) => {
  // This is the function that fetches the data (useSWR)
  const fetcher = (url) =>
    fetch(url)
      .then((res) => res.json())
      .then((json) => json.data);

  console.log(users);
  // We need to grap bthe id for current url
  const router = useRouter();
  const { id } = router.query;

  // Get the current task data
  const { data, error } = useSWR(id ? `/api/task/${id}` : null, fetcher);
  console.log(data);

  // If the data is loading, show a loading message
  if (!data) return <p>Loading...</p>;

  // Create a new object with the data we need to pass to the form
  const taskForm = {
    name: data.name,
    founder_name: data.description,
    users: data.users,
  };

  return (
    // This is imported from TaskForm component
    <Form
      formId="edit-task-form"
      taskForm={taskForm}
      users={users}
      forNewtask={false}
    />
  );
};

export default EditTask;

export async function getServerSideProps(params) {
  const results = await prisma.user.findMany({});
  const users = results.map((user) => {
    user.createdAt = user.createdAt.toString();
    user.updatedAt = user.updatedAt.toString();
    return user;
  });
  return { props: { users } };
}
