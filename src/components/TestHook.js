import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

function TestHook() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient("/");
    socket.on("update", data => {
      setResponse(data);
    });
  }, []);

  return (
    <p>
      It's {response}
    </p>
  );
}

export default TestHook;