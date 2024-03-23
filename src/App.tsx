import React, { ReactNode, useEffect, useRef, useState } from "react";

import "./App.css";
import ResultModal from "./components/ResultModal";
import HowToModal from "./components/HowToModal";
import MessageToast from "./components/MessageToast";
import Keyboard from "./components/Keyboard";
import { Statistics, Prediction } from "./interfaces/interfaces";

function App() {
  const wordLength = 5;
  const attemptsLimit = 6;
  const dailyWord = "hello";
  const activeRowRef: any = useRef();
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  activeRowRef.current = activeRowIndex;

  // let activeRowIndex = 0;
  const assignEntries = (newRow: Prediction[]) => {
    setEntries((prevEntries) => {
      const updatedEntries = [...prevEntries]; // Create a copy of the entries array
      updatedEntries[activeRowRef.current] = newRow; // Update the active row in the copied array
      return updatedEntries; // Return the updated entries array
    });
  };
  const gameTable = Array.from({ length: attemptsLimit }, (): Prediction[] =>
    Array.from({ length: wordLength }, (): Prediction => {
      return {
        letter: "",
        result: "",
        classes: "",
      };
    })
  );
  const [entries, setEntries] = useState(gameTable);
  const [isGamePlayable, setIsGamePlayable] = useState(true);

  const [statistics, setStatistics] = useState<Statistics>({
    win: false,
    correctAttempt: null,
    gameFinished: false,
  });

  // let activeIndex = 0;
  async function checkActiveRow() {
    const correctValues = dailyWord.toUpperCase().split("");
    const checkedRow = entries[activeRowRef.current].map((entry, index) => {
      const currentIndexMatches =
        entry.letter.toUpperCase() === correctValues[index];
      if (currentIndexMatches) {
        correctValues.splice(index, 1, "");
      }

      return {
        ...entry,
        result: currentIndexMatches
          ? "true"
          : correctValues.includes(entry.letter)
          ? "false-position"
          : "false",
      };
    });
    assignEntries(checkedRow);
    handleResultModal(checkedRow.every((cell) => cell.result === "true"));
  }

  function handleResultModal(isUserWon: boolean) {
    function handleShowStatistics(isUserWon: boolean) {
      setStatistics((prevStatistics) => {
        // Use the previous state to compute the new state

        const newStatistics = {
          ...prevStatistics,
          win: isUserWon,
          correctAttempt: activeRowRef.current,
          gameFinished: true,
        };
        return newStatistics;
      });
      setTimeout(() => {
        setActiveComponent(
          <ResultModal
            close={handleClose}
            message={dailyWord}
            statistics={{
              win: isUserWon,
              correctAttempt: activeRowRef.current - 1,
              gameFinished: true,
            }}
          />
        );
      }, 2500);
    }

    if (isUserWon || activeRowRef.current + 1 === attemptsLimit) {
      handleShowStatistics(isUserWon);
      setIsGamePlayable(false);
    }
  }

  function handleShake() {
    const shakeTimeout = 1000;

    // Apply shake classes
    setEntries((prevEntries) => {
      const updatedEntries = prevEntries.map((row, rowIndex) => {
        if (rowIndex === activeRowRef.current) {
          return row.map((cell) => ({ ...cell, classes: "shake" }));
        }
        return row;
      });
      return updatedEntries;
    });

    // Remove shake classes after timeout
    setTimeout(() => {
      setEntries((prevEntries) => {
        const updatedEntries = prevEntries.map((row, rowIndex) => {
          if (rowIndex === activeRowRef.current) {
            return row.map((cell) => ({ ...cell, classes: "" }));
          }
          return row;
        });
        return updatedEntries;
      });
    }, shakeTimeout);
  }

  const stateRef: any = useRef();

  const [activeIndex, setActiveIndex] = useState(0);
  stateRef.current = activeIndex;

  async function keyPressed(e: KeyboardEvent | string) {
    const currentIndex = stateRef.current;
    const newRow = entries[activeRowRef.current];

    const key = typeof e === "string" ? e : e.key;
    const isLetter = /^[a-zA-Z]$/i.test(key);
    console.log(e);
    switch (key) {
      case "Enter":
        if (
          entries[activeRowRef.current].every((entry) => entry.letter !== "")
        ) {
          await checkActiveRow();
          setActiveRowIndex((prev) => prev + 1);
          setActiveIndex(0);
        } else {
          handleShake();
          setActiveComponent(
            <MessageToast message="Not enough letters" close={handleClose} />
          );
        }
        break;
      case "Backspace":
      case "Del":
        if (currentIndex > 0) {
          setActiveIndex((prev) => prev - 1);
          newRow[currentIndex - 1] = {
            letter: "",
            result: "",
            classes: "",
          };
        }
        break;
      default:
        if (isLetter && currentIndex < wordLength) {
          // Only update entries if activeIndex is within bounds
          newRow[currentIndex].letter = key;
          setActiveIndex((prev) => prev + 1);
          assignEntries(newRow);
        }
    }
  }

  useEffect(() => {
    if (isGamePlayable) {
      window.addEventListener("keydown", keyPressed);
    } else {
      // Remove the event listener if the game is not playable
      window.removeEventListener("keydown", keyPressed);
    }

    return () => {
      window.removeEventListener("keydown", keyPressed);
    };
  }, [isGamePlayable]);

  function getGameTable() {
    return (
      <>
        {entries.map((entry, entryIndex) =>
          entry.map((cell, cellIndex) => {
            const uniqueKey = `entry-${entryIndex}-cell-${cellIndex}`;
            const delayValue = cellIndex * 500; // Calculate delay based on cellIndex

            // Use setTimeout to apply classes with delay
            setTimeout(() => {
              const element = document.getElementById(uniqueKey);
              if (element && cell.result) {
                element.classList.add(`cell-${cell.result}`);
              }
            }, delayValue);
            return (
              <div
                id={uniqueKey}
                key={uniqueKey}
                className={"cell " + cell.classes}
              >
                {cell.letter}
              </div>
            );
          })
        )}
      </>
    );
  }

  function themeSwitch() {
    const documentClasses = document.documentElement.classList;

    if (documentClasses.contains("dark")) {
      documentClasses.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      documentClasses.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }
  const [activeComponent, setActiveComponent] = useState<ReactNode>(null);

  function handleClose() {
    setActiveComponent(null);
  }

  return (
    <section className="md:py-10 py-5 flex flex-col justify-between h-screen dark:bg-main_dark">
      {activeComponent}
      <div className="mx-auto px-6 py-8 flex gap-8 md:gap-40 dark:bg-header_dark bg-header w-max rounded-2xl">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setActiveComponent(<HowToModal close={handleClose} />);
            }}
          >
            <img
              className="dark:hidden"
              src="/assets/icons/questionMark.svg"
              alt=""
            />
            <img
              className="hidden dark:block"
              src="/assets/icons/questionMarkDark.svg"
              alt=""
            />
          </button>
          <button
            onClick={() => {
              setActiveComponent(
                <ResultModal
                  close={handleClose}
                  message={dailyWord}
                  statistics={statistics}
                />
              );
            }}
          >
            <img
              className="dark:hidden"
              src="/assets/icons/statistics.svg"
              alt=""
            />
            <img
              className="dark:block hidden"
              src="/assets/icons/statisticsDark.svg"
              alt=""
            />
          </button>
        </div>
        <h2 className="font text-2xl md:text-4xl font-semibold dark:text-white">
          WORDLE
        </h2>
        <div className="">
          <div className="flex gap-1 items-center">
            <img
              width="30"
              className="dark:hidden"
              src="/assets/icons/sun.svg"
              alt=""
            />
            <img
              width="30"
              className="hidden dark:block"
              src="/assets/icons/sunDark.svg"
              alt=""
            />

            <label className="switch">
              <input onClick={() => themeSwitch()} type="checkbox" />
              <span className="slider round"></span>
            </label>
            <img
              width="25"
              src="/assets/icons/moon.svg"
              alt=""
              className="dark:hidden"
            />
            <img
              width="25"
              src="/assets/icons/moonDark.svg"
              alt=""
              className="hidden dark:block"
            />
          </div>
        </div>
      </div>
      <div className="mx-auto w-2/3 md:w-1/2 lg:w-1/5">
        <div className="letter-container">{getGameTable()}</div>
      </div>
      <Keyboard entries={entries} pressedKey={(key) => keyPressed(key)} />
    </section>
  );
}

export default App;
