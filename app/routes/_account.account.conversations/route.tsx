import { Conversations } from "~/routes/resources.conversations/route";

export default function Conversation() {
  return (
    <>
      <div className={"flex h-full items-center gap-2"}>
        {/*<Chat size={30} /> <span>Chats</span>*/}
        <Conversations type={"regular"} />
      </div>
    </>
  );
}
