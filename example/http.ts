import type {} from "typed-spec";

type User = {
  id: uuid;
  name: string;
  deleted: boolean;
};

type CreateUser = {
  name: string;
};

type UserSearch = {
  name?: string;
  includeDeleted?: boolean;
};

type ApiError = {
  code: string;
  message: string;
};

type UsersRoute = route<"/users", {
  get: (id: path<uuid>, includeDeleted?: query<boolean>) => ok<User> | notFound<ApiError>;
  post: (user: body<CreateUser>) => created<User>;
  put: (id: path<uuid>, user: body<User>) => ok<User>;
  del: (id: path<uuid>) => noContent;

  upload: route<"/upload", {
    post: (
      contentType: header<"multipart/form-data">,
      payload: multipartBody<{ avatar: httpPart<bytes> }>
    ) => noContent;
  }>;

  search: post<"/search", (criteria: body<UserSearch>) => ok<User[]>>;
}>;

type Download = get<"/files/{id}", (
  id: path<uuid>,
  accept?: header<"image/png">,
  cacheBust?: query<boolean>,
  session?: cookie<string>
) => ok<bytes> & {
  contentType: header<"image/png">;
  etag: header<string>;
}>;

type FilesRoute = route<"/files", {
  download: Download;
}>;

type ChatStream = stream<{
  events: { type: "connect"; userId: uuid } | { type: "message"; text: string } | { type: "disconnect"; userId: uuid };
  terminalEvent: "done";
}>;

type ChatApi = route<"/chat", {
  get: () => ChatStream;
}>;

type PublicApi = api<"/v1", UsersRoute, FilesRoute, ChatApi>;

declare const publicApi: PublicApi;
void publicApi;
