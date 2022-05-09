import "./App.css";
import { Marketplace } from "@fusebit/react-marketplace";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    const handleMessage = (e) => {
      const message = JSON.parse(e.data);
      setData(message);
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="App">
      <Marketplace {...data} />
    </div>
  );
}

export default App;
