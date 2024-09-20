import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { database } from "~/database.server";
import { ActionArguments } from "~/types/remix";

export default function Home() {
  const { notes } = useLoaderData<typeof loader>();

  return (
    <main>
      <h1>Welcome to Evergreen</h1>
      <h2>Notes</h2>
      <ul>
        {notes.map((note) => (
          <li id={note.id} key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.contents}</p>
          </li>
        ))}
      </ul>
      <Form method="post">
        <h2>New Note</h2>

        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="My note"
          required
          style={{ display: "block" }}
        />

        <textarea
          id="contents"
          name="contents"
          placeholder="Today I felt..."
          cols={25}
          rows={10}
          style={{ resize: "none", display: "block" }}
        />

        <button type="submit">Save note</button>
      </Form>
    </main>
  );
}

export async function loader() {
  const notes = await database.note.findMany();

  return json({ notes });
}

export async function action({ request }: ActionArguments) {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData);

  await database.note.create({
    data: {
      title: fields.title as string,
      contents: fields.contents as string,
    },
  });

  return redirect("/");
}
