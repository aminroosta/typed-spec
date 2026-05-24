import type {} from "typed-spec";

type ApiError = {
  message: string;
};

// @ts-expect-error route paths must start with a slash.
type InvalidPath = route<"users", {}>;

// @ts-expect-error endpoint handlers must return typed-spec responses or streams.
type InvalidHandlerReturn = route<"/bad", { get: () => string }>;

// @ts-expect-error status codes must be numeric.
type InvalidStatus = resp<"200", ApiError>;

// @ts-expect-error shorthand endpoint paths must start with a slash.
type InvalidShorthand = get<"bad", () => ok<ApiError>>;
