import React, { useState } from "react";
import Router from "next/router";

export default function NewWorkspace() {
  const [form, setForm] = useState({
    name: "",
    description: "",
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
      await fetch("/api/workspace/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setForm({
        name: "",
        description: "",
      });
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h1 className="text-lg">New Workspace</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mt-4 mb-1" htmlFor="workspace-name">
          Name
        </label>
        <input
          onChange={handleChange}
          type="text"
          id="workspace-name"
          name="name"
          value={form.name}
          className="block w-full rounded p-2"
        />
        <label className="block mt-4 mb-1" htmlFor="workspace-description">
          Description
        </label>
        <input
          className="block w-full rounded p-2"
          onChange={handleChange}
          id="workspace-description"
          name="description"
          value={form.description}
        ></input>
        <button
          className="bg-primary text-primary-foreground text-sm hover:bg-primary/90 p-2 rounded mt-4"
          type="submit"
        >
          Create Workspace
        </button>
      </form>
    </div>
  );
}
