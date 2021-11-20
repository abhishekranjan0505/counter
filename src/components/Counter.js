import React, { useEffect, useState } from "react";
import "./Counter.css";

const MAX_VALUE = 1000;
let controllerFn = null;

const updateCount = async (count) => {
  const controller = new AbortController();

  // cancel any pending count update request
  if (controllerFn && !controllerFn.signal.aborted) {
    controllerFn.abort();
  }
  controllerFn = controller;

  await fetch(
    "https://interview-8e4c5-default-rtdb.firebaseio.com/front-end.json",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        abhishek: count,
      }),
      signal: controller.signal,
    }
  );
};

const fetchCount = async () => {
  return await fetch(
    "https://interview-8e4c5-default-rtdb.firebaseio.com/front-end/abhishek.json"
  );
};

const Counter = ({ setCountInParent }) => {
  const [count, setCount] = useState(1);
  const [updating, setUpdating] = useState(false);
  const [fetching, setFetching] = useState(true);

  const decrement = () => {
    setCount(count - 1);
  };
  const increment = () => {
    if (count >= MAX_VALUE) return;
    setCount(count + 1);
  };
  const inputChangeHandler = (e) => {
    const val = Number(e.target.value);
    if (val > MAX_VALUE) return;
    setCount(val);
  };

  useEffect(() => {
    fetchCount()
      .then((res) => res.json())
      .then((c) => {
        if (c === null) {
          c = 1;
        }
        setCount(c);
        setFetching(false);
        setCountInParent(c);
      });
  }, [setCountInParent]);

  useEffect(() => {
    if (!fetching) {
      setUpdating(true);
      updateCount(count).then(() => {
        setUpdating(false);
      });
    }
    setCountInParent(count);
  }, [count, setCountInParent, fetching]);

  return (
    <div className="container">
      <div className="top">
        {updating && (
          <div className="saving">
            <div className="loader" />
            <p>Saving counter value</p>
          </div>
        )}
      </div>
      {fetching ? (
        "Fetching count..."
      ) : (
        <div className="counter">
          <button onClick={decrement}>-</button>
          <input
            type="number"
            value={count}
            onChange={inputChangeHandler}
            max="1000"
          />
          <button onClick={increment}>+</button>
        </div>
      )}
    </div>
  );
};

export default Counter;
