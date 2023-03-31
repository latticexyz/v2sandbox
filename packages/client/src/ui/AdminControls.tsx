import { useEffect } from "react";
import { useMUD, useStore } from "../store";

export const AdminControls = () => {
  const { devMode } = useMUD();

  useEffect(() => {
    const sub = (e: KeyboardEvent) => {
      if (e.key === "`") {
        useStore.setState({ devMode: !devMode });
      }
    };

    document.addEventListener("keydown", sub);
    return () => {
      document.removeEventListener("keydown", sub);
    };
  }, [devMode]);

  return (<></>);
};
