import { requireUser } from "~/guard.server";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import ConversationNavItem from "~/routes/resources.conversations/conversation-nav-item";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { ROUTES } from "~/routes";

type Props = {
  type: "support" | "regular";
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  return json(
    { user },
    {
      headers: {
        "Cache-Control": "max-age=360",
      },
    },
  );
}

export async function action({ request }: ActionFunctionArgs) {
  console.log(request);
  return null;
}

export function Conversations({ type }: Props) {
  const fetcher = useFetcher<typeof loader>({ key: "chat-system" });
  const user = fetcher.data?.user;

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load(ROUTES.RESOURCE_CONVERSATIONS);
    }
  }, [fetcher]);

  return (
    <div className="flex h-full w-full gap-7">
      {user ? (
        <>
          <aside className={"h-full shrink-0 basis-[35%] bg-white p-7"}>
            <h2>Chats</h2>
            <div>
              <ConversationNavItem
                lastConvo={
                  "help you build a strong brand identity and online presence."
                }
                group={"Yino"}
                senderName={user.name}
                lastMsgTime={new Date()}
                unReads={4}
                to={ROUTES.CONVERSATION.replace(":id", user._id)}
              />
            </div>
          </aside>

          <section
            className={
              "shrink-0 basis-full bg-dotted-pattern bg-cover bg-no-repeat p-7"
            }
          >
            <header>
              <h2>This is a placeholder</h2>
            </header>
          </section>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
