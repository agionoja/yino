import { IUser } from "~/models/user.model";
import { ReactNode, useContext, createContext } from "react";

type User =
  | Pick<IUser, "email" | "name" | "phoneNumber" | "_id" | "role" | "address">
  | undefined;

type ProvideProps = {
  user: User;
  children: ReactNode;
};

const context = createContext<User>(undefined);

export function useUser() {
  return useContext(context);
}

export function UserProvider({ children, user }: ProvideProps) {
  return <context.Provider value={user}>{children}</context.Provider>;
}
