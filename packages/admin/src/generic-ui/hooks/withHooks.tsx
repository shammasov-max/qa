import React from "react";

const withHooks =
  <HooksInput extends object, HooksOutput extends object>(hooks: {
    (input?: HooksInput): HooksOutput;
  }) =>
  <P extends object>(Component: {
    (compPropsInput: P & HooksOutput): React.ReactNode;
  }): { (compPropsOutput: P): React.ReactNode } => {
    if (!Component) {
      throw new Error("Component must be provided to compose");
    }

    if (!hooks) {
      return Component;
    }

    return (props) => {
      //debugger;
      const hooksObject = typeof hooks === "function" ? hooks(props) : hooks;

      // Flatten values from all hooks to a single object
      const hooksProps = Object.entries(hooksObject).reduce(
        (acc, [hookKey, hook]) => {
          let hookValue = hook; //();

          if (Array.isArray(hookValue) || typeof hookValue !== "object") {
            hookValue = { [hookKey]: hookValue };
          }

          Object.entries(hookValue).forEach(([key, value]) => {
            const duplicate = acc[key] ? value : props[key];

            if (typeof duplicate !== "undefined") {
              console.warn(
                `prop '${key}' exists, overriding with value: '${duplicate}'`
              );
            }
            acc[key] = value;
          });

          return acc;
        },
        {}
      );

      return <Component {...hooksProps} {...props} />;
    };
  };

export default withHooks;
