import { useEffect, useState, useRef } from "react";

function App() {
  const [messages, setMessages] = useState(["Connected to WebSocket ⚡"]);
  const wsRef = useRef();
  const messagesEndRef = useRef();
  const [connected, setConnected] = useState(false);


  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      setConnected(true);
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: "red" },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const messageText = data?.payload?.message ?? "[No message]";
      setMessages((m) => [...m, messageText]);
    };

    wsRef.current = ws;

    return () => ws.close();
  }, []);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen bg-gradient-to-br from-black via-[#0d1117] to-black text-green-400 font-mono relative overflow-hidden">

      <div className="absolute inset-0 opacity-10 animate-pulse bg-[radial-gradient(circle,_#0f0_1px,_transparent_1px)] bg-[size:20px_20px] z-0"></div>


      <div className="z-10 relative bg-[#161b22] text-green-300 px-4 py-3 flex justify-between items-center shadow-md border-b border-green-800">
        <h1 className="text-xl font-bold tracking-wider">
          🧪 WebSocket Terminal
        </h1>
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${connected ? "bg-green-400 animate-ping" : "bg-red-600"}`}
            title={connected ? "Connected" : "Disconnected"}
          ></span>
          <span className="text-sm">{connected ? "Live" : "Offline"}</span>
        </div>
      </div>


      <div className="z-10 relative flex-1 overflow-y-auto px-6 py-4 space-y-3 pb-16">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[75%] px-4 py-2 rounded-lg shadow-md text-sm ${
                i % 2 === 0
                  ? "bg-[#1e242c] text-green-400 border border-green-700"
                  : "bg-[#2d333b] text-blue-300 border border-blue-600"
              }`}
            >
              {msg}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>


      <div className="z-20 fixed bottom-4 left-1/2 -translate-x-1/2 w-[70%] bg-[#0d1117] border border-green-800 px-4 py-3 rounded-lg flex gap-2 shadow-lg">
        <input
          id="message"
          placeholder="> type your command..."
          className="flex-1 px-4 py-3 bg-black text-green-300 border border-green-600 rounded-md focus:outline-none placeholder:text-green-500"
        />
        <button
          onClick={() => {
            const input = document.getElementById("message");
            const message = input?.value;
            if (!message.trim()) return;
            wsRef.current.send(
              JSON.stringify({
                type: "chat",
                payload: { message },
              })
            );
            input.value = "";
          }}
          className="px-5 py-2 rounded-md bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-black font-bold shadow-lg transition"
        >
          Send ⌨️
        </button>
      </div>


      <div className="absolute bottom-2 left-4 text-xs z-10 text-green-500 opacity-80">
        Built with WebSocket & React⚡
      </div>
    </div>
  );
}

export default App;
