const { useState, useEffect, useRef } = React;

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const handleReset = () => {
    clearInterval(timerRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(1500);
    setTimerLabel("Session");
    setIsRunning(false);
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  };

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (timerLabel === "Session") {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (timerLabel === "Session") {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      const audio = document.getElementById("beep");
      audio.play();
      if (timerLabel === "Session") {
        setTimerLabel("Break");
        setTimeLeft(breakLength * 60);
      } else {
        setTimerLabel("Session");
        setTimeLeft(sessionLength * 60);
      }
    }
  }, [timeLeft, timerLabel, breakLength, sessionLength]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  return (
    <div id="clock">
      <h1>25 + 5 Clock</h1>
      <div className="control-group">
        <div>
          <h2 id="break-label">Break Length</h2>
          <button id="break-decrement" onClick={handleBreakDecrement}>
            -
          </button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={handleBreakIncrement}>
            +
          </button>
        </div>
        <div>
          <h2 id="session-label">Session Length</h2>
          <button id="session-decrement" onClick={handleSessionDecrement}>
            -
          </button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={handleSessionIncrement}>
            +
          </button>
        </div>
      </div>
      <div id="timer">
        <h2 id="timer-label">{timerLabel}</h2>
        <span id="time-left">{formatTime(timeLeft)}</span>
      </div>
      <button id="start_stop" onClick={handleStartStop}>
        {isRunning ? "Stop" : "Start"}
      </button>
      <button id="reset" onClick={handleReset}>
        Reset
      </button>
      <audio id="beep" src="breack.mp3" preload="auto"></audio>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
