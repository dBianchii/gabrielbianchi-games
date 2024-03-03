/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @next/next/no-img-element */
"use client";
import { LiveList, LiveObject } from "@liveblocks/client";
import "@liveblocks/react";
import { ClientSideSuspense } from "@liveblocks/react";
import { useState } from "react";
import {
  RoomProvider,
  useMutation,
  useOthers,
  useStorage,
  useUpdateMyPresence,
} from "../../../liveblocks.config";
import { Room } from "../room";

function WhoIsHere() {
  const userCount = useOthers((others) => others.length);

  return (
    <div className="who_is_here">There are {userCount} other users online</div>
  );
}

function SomeoneIsTyping() {
  const someoneIsTyping = useOthers((others) =>
    others.some((other) => other.presence.isTyping)
  );

  return (
    <div className="someone_is_typing">
      {someoneIsTyping ? "Someone is typing..." : ""}
    </div>
  );
}

function Example() {
  const [draft, setDraft] = useState("");
  const updateMyPresence = useUpdateMyPresence();
  const todos = useStorage((root) => root.todos);

  const addTodo = useMutation(({ storage }, text) => {
    storage.get("todos").push(new LiveObject({ text }));
  }, []);

  const toggleTodo = useMutation(({ storage }, index) => {
    const todo = storage.get("todos").get(index);
    todo?.set("checked", !todo.get("checked"));
  }, []);

  const deleteTodo = useMutation(({ storage }, index) => {
    storage.get("todos").delete(index);
  }, []);

  return (
    <Room>
      <div className="container">
        <WhoIsHere />
        <input
          type="text"
          placeholder="What needs to be done?"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            updateMyPresence({ isTyping: true });
          }}
          onKeyDown={(e) => {
            if (draft && e.key === "Enter") {
              updateMyPresence({ isTyping: false });
              addTodo(draft);
              setDraft("");
            }
          }}
          onBlur={() => updateMyPresence({ isTyping: false })}
        />
        <SomeoneIsTyping />
        {todos.map((todo, index) => {
          return (
            <div key={index} className="todo_container">
              <div className="todo" onClick={() => toggleTodo(index)}>
                <span
                  style={{
                    cursor: "pointer",
                    textDecoration: todo.checked ? "line-through" : undefined,
                  }}
                >
                  {todo.text}
                </span>
              </div>
              <button
                className="delete_button"
                onClick={() => deleteTodo(index)}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </Room>
  );
}

function Loading() {
  return (
    <div className="loading">
      <img src="https://liveblocks.io/loading.svg" alt="Loading" />
    </div>
  );
}

export default function Page() {
  return (
    <RoomProvider
      id={"roomId"}
      initialPresence={{
        isTyping: false,
      }}
      initialStorage={{ todos: new LiveList() }}
    >
      <ClientSideSuspense fallback={<Loading />}>
        {() => <Example />}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
