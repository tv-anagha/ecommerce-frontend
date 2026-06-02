import './App.css'
import { useState } from "react";

function App() {
  const [result, setResult] = useState("");

  const pingBackend = async () => {
    try {
      const res = await fetch("http://localhost:8080/ping");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data.message);
    } catch (err) {
      setResult(err.message ?? "Request failed");
    }
  };

  return (
    <div>
      <button onClick={pingBackend}>
        Ping Backend
      </button>

      <h1>{result}</h1>
    </div>
  );
}

export default App;

