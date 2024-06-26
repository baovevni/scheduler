import { useState } from "react";
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  
  function transition(newMode, replace = false) {
    if (replace){
      setHistory(prev => [...prev.slice(0, prev.length - 1), newMode]);
    } else {
      setHistory(prev => [...prev, newMode]);
    }
    setMode(newMode)
  }

  function back() {
    setHistory(prev => {
      if (prev.length > 1) {
        const newHistory = prev.slice(0, prev.length -1);
        setMode(history[newHistory.length -1]);
        return newHistory;
      }
      return prev;
    })
  }

  return { mode, transition, back };
}
