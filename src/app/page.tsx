"use client";

import { Todo } from "@/services/todo-service";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

const GET_TODO_LIST = gql`
  query GetTodoList {
    getTodoList {
      id
      title
      completed
    }
  }
`;

const GET_TODO = gql`
  query Query($id: ID) {
    getTodo(id: $id) {
      id
      title
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation Mutation($input: TodoCreateInput!) {
    createTodo(input: $input) {
      id
      title
      completed
    }
  }
`;
const UPTADE_TODO = gql`
  mutation UpdateTodo($input: TodoUpdateInput!) {
    updateTodo(input: $input) {
      id
      title
      completed
    }
  }
`;
const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
      title
      completed
    }
  }
`;
export default function Home() {
  const [title, setTitle] = useState("");

  const { data, loading, error } = useQuery(GET_TODO_LIST);
  const [
    createTodo,
    { data: createdData, loading: createLoading, error: createError },
  ] = useMutation(CREATE_TODO);
  const [
    getTodo,
    { data: getTodoData, loading: getTodoLoading, error: getTodoError },
  ] = useLazyQuery(GET_TODO);
  const [
    uptadeTodo,
    { data: uptadedData, loading: uptadeLoading, error: uptadeError },
  ] = useMutation(UPTADE_TODO);
  const [
    deleteTodo,
    { data: deletedData, loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_TODO);
  console.log({ getTodoData, getTodoLoading, getTodoError });

  if (loading) return <>Loading...</>;
  if (error) return <>{error.message}...</>;
  const { getTodoList } = data;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    createTodo({
      variables: {
        input: {
          title,
          completed: false,
        },
      },
      refetchQueries: [{ query: GET_TODO_LIST }],
    });
  };

  const handleItemClick = (id: string) => {
    getTodo({
      variables: {
        id,
      },
    });
  };
  const handleUptadeClick = (id: string, title: string, completed: boolean) => {
    uptadeTodo({
      variables: {
        input: {
          id,
          title,
          completed,
        },
      },
      refetchQueries: [{ query: GET_TODO_LIST }],
    });
  };
  const handleDelteClick = (id: string) => {
    deleteTodo({
      variables: {
        id,
      },
      refetchQueries: [{ query: GET_TODO_LIST }],
    });
  };

  return (
    <div>
      <h1>{getTodoData?.getTodo && <>{getTodoData.getTodo.title}</>}</h1>
      <ul className="list-disc pl-5 mb-5 ">
        {getTodoList.map((todo: Todo) => (
          <li
            key={todo.id}
            className="cursor-pointer hover:underline flex flex-row gap-20"
            onClick={() => handleItemClick(todo.id)}
          >
            {todo.id}
            <button
              className="btn"
              onClick={() => handleUptadeClick(todo.id, `${title}`, false)}
            >
              Uptade
            </button>
            <button className="btn" onClick={() => handleDelteClick(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          placeholder="Type here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <button className="btn">Button</button>
      </form>
    </div>
  );
}
