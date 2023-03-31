import { useEffect, useRef } from "react";
import { store, useMUD } from "../store";

export function GameMessages({ height }: { height: number }) {
  const { messages } = useMUD();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    store.setState({
      messages: [{ message: "Welcome to MUD!", color: "white" }],
    });
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={ref}
      style={{
        height: `${height}px`,
      }}
      className="bg-slate-600 p-4 overflow-auto"
    >
      {messages.map((m, i) => (
        <div
          style={{
            color: m.color,
          }}
          key={i}
        >
          {m.message}
        </div>
      ))}
    </div>
  );
}
