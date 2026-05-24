# typed-spec

TypeScript-only API documentation types inspired by TypeSpec.

This package is for projects where TypeSpec is only used as documentation source,
not for code generation. Instead of writing `.tsp`, write `.ts` or `.d.ts` files
containing only type declarations:

```ts
import type {} from "typed-spec";

export type UsersApi = route<"/users", {
  read: get<(id: path<uuid>, includeDeleted?: query<boolean>) => ok<User> | notFound<ApiError>>;
  replace: put<(id: path<uuid>, user: body<User>) => ok<User> | notFound<ApiError>>;
}>;
```

That single empty type import loads all ambient helpers, so `route`, `get`,
`path`, `ok`, `uuid`, and the rest do not need to be imported by name. If the
package is listed once in `compilerOptions.types`, even that line can be omitted.

```json
{
  "compilerOptions": {
    "types": ["typed-spec"]
  }
}
```

## HTTP

```ts
type UsersRoute = route<"/users", {
  get: (id: path<uuid>) => ok<User>;
  post: (user: body<CreateUser>) => created<User>;
  put: (id: path<uuid>, user: body<User>) => ok<User>;
  del: (id: path<uuid>) => noContent;

  upload: route<"/upload", {
    post: (
      contentType: header<"multipart/form-data">,
      payload: multipartBody<{ avatar: httpPart<bytes> }>
    ) => noContent;
  }>;

  // shorthand
  search: post<"/search", (criteria: body<UserSearch>) => ok<User[]>>;
}>;
```

Responses use status helpers:

```ts
ok<T>           // 200
created<T>      // 201
accepted<T>     // 202
noContent       // 204
badRequest<T>   // 400
unauthorized<T> // 401
forbidden<T>    // 403
notFound<T>     // 404
conflict<T>     // 409
resp<Code, T>   // any status code
```

## HTTP Metadata

```ts
type Download = get<"/files/{id}", (
  id: path<uuid>,
  accept?: header<"image/png">,
  cacheBust?: query<boolean>,
  session?: cookie<string>
) => ok<bytes> & {
  contentType: header<"image/png">;
  etag: header<string>;
}>;
```

Use metadata helpers anywhere a documentation generator should distinguish the
HTTP envelope from the payload.

## Events, SSE, And Streams

```ts
type ChatStream = stream<{
  events: UserConnect | UserMessage | UserDisconnect;

  terminalEvent: "done";
}>;

export type ChatApi = route<"/chat", {
  get: () => ChatStream;
}>;
```

## Core Metadata

```ts
type Api = api<
  "/v1",
  UsersRoute,
  PostsRoute,
  ...
>;
```

## Static Analysis

There is no runtime API object or code generation. We rely on TypeScript compiler for validation.


The lowercase type names are intentional. They keep documentation source close to
TypeSpec syntax while remaining valid, erasable TypeScript.

## React Components

```ts
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
    mutation<UsersRoute["put"]>,
  ];
}>;
```

Use `component` for public props, `context` for provider values, and `use` for
context and TanStack Query dependencies.
