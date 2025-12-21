import "@testing-library/jest-dom";
import { ReadableStream } from "stream/web";

if (typeof globalThis.ReadableStream === "undefined") {
  globalThis.ReadableStream =
    ReadableStream as unknown as typeof globalThis.ReadableStream;
}
