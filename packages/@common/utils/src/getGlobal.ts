import * as process from "process";

export const getGlobal = function () {
  /*
    console.log('typeof self ', typeof self )
    console.log('typeof window ', typeof window )
    console.log('typeof global ', typeof global )
    console.log('typeof process ', typeof process)
    if (typeof self !== 'undefined') { return self; }
    */
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (typeof process !== "undefined") {
    return process;
  }
  throw new Error("unable to locate global object");
};
