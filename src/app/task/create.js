import React, { useState } from "react";
import { PrismaClient } from "@prisma/client";
import Router from "next/router";

const prisma = new PrismaClient();

export default function CreateTask({ users, projects }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    users: [],
    project: "",
  });

  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async function (e) {
    e.preventDefault();
    try {
      const body = form;
      await fetch("/api/task/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setForm({
        name: "",
        description: "",
        project: "",
        users: "",
      });
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };
  console.log(projects);
  return (
    <div>
      <h1>Create Task</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={form.name}
          onChange={handleChange}
        />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          id="description"
          value={form.description}
          onChange={handleChange}
        />
        <label htmlFor="project">Project</label>
        <select
          name="project"
          id="project"
          value={form.project}
          onChange={handleChange}
        >
          {projects.map((project) => {
            return (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            );
          })}
        </select>
        <label htmlFor="users">Assigned</label>
        <select
          name="users"
          id="users"
          value={form.users}
          onChange={handleChange}
        >
          {users.map((user) => {
            return (
              <option key={user.id} value={user.id}>
                {user.firstName + " " + user.lastName}
              </option>
            );
          })}
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export async function getServerSideProps(params) {
  const results = await prisma.user.findMany({});
  const users = results.map((user) => {
    user.createdAt = user.createdAt.toString();
    user.updatedAt = user.updatedAt.toString();
    return user;
  });
  const projectResults = await prisma.project.findMany({});
  const projects = projectResults.map((project) => {
    project.createdAt = project.createdAt.toString();
    project.updatedAt = project.updatedAt.toString();
    return project;
  });
  return { props: { users, projects } };
}
