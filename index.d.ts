export {};

declare namespace typedSpec {
  const kind: unique symbol;

  type pathTemplate = `/${string}`;
  type httpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
  type statusCode = number;
  type metadataKind =
    | "path"
    | "query"
    | "header"
    | "cookie"
    | "body"
    | "multipartBody"
    | "httpPart";

  type brand<Name extends string, Value> = Value & {
    readonly [kind]?: {
      readonly type: Name;
    };
  };

  type metadata<Name extends metadataKind, Value> = Value & {
    readonly [kind]?: {
      readonly metadata: Name;
      readonly value: Value;
    };
  };

  interface response<Code extends statusCode, Payload = never> {
    readonly [kind]?: {
      readonly type: "response";
      readonly status: Code;
      readonly payload: Payload;
    };
  }

  interface streamSpec<Spec> {
    readonly [kind]?: {
      readonly type: "stream";
      readonly spec: Spec;
    };
  }

  type endpointResult = response<statusCode, unknown> | streamSpec<unknown>;
  type endpointHandler = (...args: never[]) => endpointResult;

  interface endpoint<Method extends httpMethod, Path extends pathTemplate | undefined, Handler extends endpointHandler> {
    readonly [kind]?: {
      readonly type: "endpoint";
      readonly method: Method;
      readonly path: Path;
      readonly handler: Handler;
    };
  }

  type endpointFrom<
    Method extends httpMethod,
    PathOrHandler extends pathTemplate | endpointHandler,
    Handler extends endpointHandler = never,
  > = [Handler] extends [never]
    ? PathOrHandler extends endpointHandler
      ? endpoint<Method, undefined, PathOrHandler>
      : never
    : PathOrHandler extends pathTemplate
      ? endpoint<Method, PathOrHandler, Handler>
      : never;

  type operation = endpoint<httpMethod, pathTemplate | undefined, endpointHandler> | routeSpec<pathTemplate, operations> | endpointHandler;
  type operations = Record<PropertyKey, operation>;

  interface routeSpec<Path extends pathTemplate, Operations extends typedSpec.operations> {
    readonly [kind]?: {
      readonly type: "route";
      readonly path: Path;
      readonly operations: Operations;
    };
  }

  type compactApiRoutes<
    R1,
    R2,
    R3,
    R4,
    R5,
    R6,
    R7,
    R8,
    R9,
    R10,
    R11,
    R12,
    R13,
    R14,
    R15,
    R16,
  > = [
    R1,
    R2,
    R3,
    R4,
    R5,
    R6,
    R7,
    R8,
    R9,
    R10,
    R11,
    R12,
    R13,
    R14,
    R15,
    R16,
  ] extends infer Routes
    ? Routes extends readonly unknown[]
      ? Exclude<Routes[number], never>
      : never
    : never;

  interface apiSpec<BasePath extends pathTemplate, Routes> {
    readonly [kind]?: {
      readonly type: "api";
      readonly basePath: BasePath;
      readonly routes: Routes;
    };
  }

  interface contextSpec<Value> {
    readonly [kind]?: {
      readonly type: "context";
      readonly value: Value;
    };
  }

  interface componentSpec<Props> {
    readonly [kind]?: {
      readonly type: "component";
      readonly props: Props;
    };
  }

  interface hookSpec<Dependency> {
    readonly [kind]?: {
      readonly type: "hook";
      readonly dependency: Dependency;
    };
  }
}

declare global {
  type uuid = typedSpec.brand<"uuid", string>;
  type bytes = typedSpec.brand<"bytes", Uint8Array>;
  type int32 = typedSpec.brand<"int32", number>;
  type int64 = typedSpec.brand<"int64", number>;
  type float32 = typedSpec.brand<"float32", number>;
  type float64 = typedSpec.brand<"float64", number>;
  type decimal = typedSpec.brand<"decimal", number | string>;

  type path<T> = typedSpec.metadata<"path", T>;
  type query<T> = typedSpec.metadata<"query", T>;
  type header<T> = typedSpec.metadata<"header", T>;
  type cookie<T> = typedSpec.metadata<"cookie", T>;
  type body<T> = typedSpec.metadata<"body", T>;
  type multipartBody<T> = typedSpec.metadata<"multipartBody", T>;
  type httpPart<T> = typedSpec.metadata<"httpPart", T>;

  type resp<Code extends number, T = never> = typedSpec.response<Code, T>;
  type ok<T = never> = resp<200, T>;
  type created<T = never> = resp<201, T>;
  type accepted<T = never> = resp<202, T>;
  type noContent = resp<204>;
  type badRequest<T = never> = resp<400, T>;
  type unauthorized<T = never> = resp<401, T>;
  type forbidden<T = never> = resp<403, T>;
  type notFound<T = never> = resp<404, T>;
  type conflict<T = never> = resp<409, T>;

  type get<
    PathOrHandler extends typedSpec.pathTemplate | typedSpec.endpointHandler,
    Handler extends typedSpec.endpointHandler = never,
  > = typedSpec.endpointFrom<"GET", PathOrHandler, Handler>;

  type post<
    PathOrHandler extends typedSpec.pathTemplate | typedSpec.endpointHandler,
    Handler extends typedSpec.endpointHandler = never,
  > = typedSpec.endpointFrom<"POST", PathOrHandler, Handler>;

  type put<
    PathOrHandler extends typedSpec.pathTemplate | typedSpec.endpointHandler,
    Handler extends typedSpec.endpointHandler = never,
  > = typedSpec.endpointFrom<"PUT", PathOrHandler, Handler>;

  type patch<
    PathOrHandler extends typedSpec.pathTemplate | typedSpec.endpointHandler,
    Handler extends typedSpec.endpointHandler = never,
  > = typedSpec.endpointFrom<"PATCH", PathOrHandler, Handler>;

  type del<
    PathOrHandler extends typedSpec.pathTemplate | typedSpec.endpointHandler,
    Handler extends typedSpec.endpointHandler = never,
  > = typedSpec.endpointFrom<"DELETE", PathOrHandler, Handler>;

  type head<
    PathOrHandler extends typedSpec.pathTemplate | typedSpec.endpointHandler,
    Handler extends typedSpec.endpointHandler = never,
  > = typedSpec.endpointFrom<"HEAD", PathOrHandler, Handler>;

  type options<
    PathOrHandler extends typedSpec.pathTemplate | typedSpec.endpointHandler,
    Handler extends typedSpec.endpointHandler = never,
  > = typedSpec.endpointFrom<"OPTIONS", PathOrHandler, Handler>;

  type route<Path extends typedSpec.pathTemplate, Operations extends typedSpec.operations> =
    typedSpec.routeSpec<Path, Operations> & Operations;

  type stream<Spec> = typedSpec.streamSpec<Spec>;

  type api<
    BasePath extends typedSpec.pathTemplate,
    R1 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations>,
    R2 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
    R3 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
    R4 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
    R5 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
    R6 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
    R7 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
    R8 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
    R9 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
    R10 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
    R11 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
    R12 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
    R13 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
    R14 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
    R15 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
    R16 extends typedSpec.routeSpec<typedSpec.pathTemplate, typedSpec.operations> = never,
  > = typedSpec.apiSpec<
    BasePath,
    typedSpec.compactApiRoutes<R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15, R16>
  >;

  type context<Value> = typedSpec.contextSpec<Value>;
  type component<Props extends Record<PropertyKey, unknown>> = typedSpec.componentSpec<Props>;
  type use<Dependency> = typedSpec.hookSpec<Dependency>;
}
