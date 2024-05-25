import { createRuntimeTw } from './runtime';

declare const typewind: unique symbol;

// make brand/opaque type so that typescript lsp shows error as TypewindError<Message> and not Message
type TypewindError<T> = { [typewind]: T };

export const tw =
  createRuntimeTw() as TypewindError<"Typewind's types haven't been generated. Run `npx typewind generate` or follow the docs at https://typewind.dev/docs/installation">;
