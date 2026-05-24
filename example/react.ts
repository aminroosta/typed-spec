import type {} from "typed-spec";

type User = {
  id: uuid;
  name: string;
};

type UsersRoute = route<"/users", {
  get: (id: path<uuid>) => ok<User>;
  put: (id: path<uuid>, user: body<User>) => ok<User>;
}>;

type AuthContext = context<{
  user: User | null;
  signOut: () => void;
}>;

type UserCard = component<{
  userId: string;
  dense?: boolean;
  onOpen: (id: string) => void;
  use: [
    AuthContext,
    query<UsersRoute["get"]>,
    use<UsersRoute["put"]>,
  ];
}>;

declare const userCard: UserCard;
void userCard;
