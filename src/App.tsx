import React, { useState } from "react";

import "./App.css";
import ResultModal from "./components/ResultModal";
import { CSSTransition } from "react-transition-group";
import HowToModal from "./components/HowToModal";
import MessageToast from "./components/MessageToast";

function App() {
  const [isModalActive, setIsModalActive] = useState(true);
  const [isMessageToastActive, setIsMessageToastActive] = useState(true);
  const [isHowModalActive, setIsHowModalActive] = useState(true);
  return (
    <div>
      <CSSTransition
        in={isMessageToastActive}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <MessageToast
          message="wrong"
          close={() => setIsMessageToastActive(false)}
        />
      </CSSTransition>
      <CSSTransition
        in={isHowModalActive}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <HowToModal close={() => setIsHowModalActive(false)} />
      </CSSTransition>
      <CSSTransition
        in={isModalActive}
        timeout={300} // Adjust the duration of the transition (in milliseconds)
        classNames="fade" // Define your CSS transition class
        unmountOnExit
      >
        <div>
          {/* Render your component with transition */}

          <ResultModal
            statistics={{ win: true, correctAttempt: 2, gameFinished: true }}
            message="apple"
            close={() => setIsModalActive(false)}
          />
        </div>
      </CSSTransition>
      
      <button onClick={() => setIsModalActive(true)}>open modal</button>
      <button onClick={() => setIsMessageToastActive(true)}>open toast</button>
      <button onClick={() => setIsHowModalActive(true)}>open How modal</button>
    </div>
  );
}

export default App;
