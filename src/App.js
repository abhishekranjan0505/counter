import { useState } from "react";
import Counter from "./components/Counter";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <Counter setCountInParent={setCount} />
      <p className="bottom">Count value: {count}</p>
    </div>
  );
}

export default App;
