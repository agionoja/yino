import { useSocket } from "~/contexts/socket-context";
import { useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import ChatModel from "~/models/chat.model";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const message = formData.get("message") || "";

  const chat = await ChatModel.create({
    receiverId: "66b3f0d6706a8659c984d86a",
    senderId: "66b3ef8534e20466aa43cfc5",
    message,
  });

  return json({ message: chat });
}

export async function loader() {
  const messages = await ChatModel.find().lean().exec();
  return json({ messages });
}

export default function ChatRoute() {
  const socket = useSocket();
  const fetcher = useFetcher<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activity, setActivity] = useState("");
  const [welcome, setWelcome] = useState<{ welcome: string } | null>(null);
  const [connectedMsg, setConnectedMsg] = useState("");
  const [messages, setMessages] = useState(loaderData?.messages || []);
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (!isSubmitting) {
      formRef.current?.reset();
      inputRef.current?.focus();
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (!socket) return;

    socket.on("activity", (name) => {
      setActivity(`${name} is typing....`);

      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);

      activityTimeoutRef.current = setTimeout(() => {
        setActivity("");
      }, 1000);
    });

    return () => {
      socket.off("activity");
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("welcome", (welcomeMessage) => {
      console.log(welcomeMessage);
      setWelcome(welcomeMessage);
    });

    socket.on("message", (newMessage) => {
      console.log({ newMessage }); // Check what is being received

      if (newMessage.welcome) {
        setWelcome(newMessage.welcome);
      }

      if (newMessage.connectedMsg) {
        setConnectedMsg(newMessage.connectedMsg);
      }

      if (newMessage.message) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("message");
      socket.off("welcome");
      socket.off("");
    };
  }, [socket]);

  return (
    <>
      <h1>{welcome?.welcome}</h1>
      <h2>{connectedMsg}</h2>
      <fetcher.Form
        ref={formRef}
        method="post"
        className={"flex items-center justify-center"}
      >
        <label className={"flex flex-col"}>
          <span>Chat</span>
          <input
            type="text"
            required
            onChange={() =>
              socket?.emit("activity", socket?.id?.substring(0, 5))
            }
            ref={inputRef}
            placeholder={"message"}
            name={"message"}
            className={"border-blue-600 border-2 p-4"}
          />
        </label>
        <button type={"submit"}>Send</button>
      </fetcher.Form>

      <ul className={"flex flex-col gap-3"}>
        {messages.length ? (
          messages.map((message, index) => (
            <li
              // className={`${message.receiver === "new ObjectId(66b3f0d6706a8659c984d86a)" ? "bg-red-500" : "bg-blue-500"}  text-white py-4`}
              key={index}
            >
              {message.message}
            </li>
          ))
        ) : (
          <li>No Messages</li>
        )}
      </ul>

      {activity && <p>{activity}</p>}
    </>
  );
}
