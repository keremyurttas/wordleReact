import React, { ReactNode, useEffect, useState } from "react";

import "./App.css";
import ResultModal from "./components/ResultModal";
import HowToModal from "./components/HowToModal";
import MessageToast from "./components/MessageToast";
import { Statistics } from "./interfaces/interfaces";
interface Cell {
  letter: string;
  result: string;
  classes: string;
}
function App() {
  const wordLength = 5;
  const attemptsLimit = 6;
  const dailyWord = "hello";

  let activeRowIndex = 0;
  const assignEntries = (newRow: Cell[]) => {
    setEntries((prevEntries) => {
      const updatedEntries = [...prevEntries]; // Create a copy of the entries array
      updatedEntries[activeRowIndex] = newRow; // Update the active row in the copied array
      return updatedEntries; // Return the updated entries array
    });
  };
  const gameTable = Array.from({ length: attemptsLimit }, (): Cell[] =>
    Array.from({ length: wordLength }, (): Cell => {
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

  let activeIndex = 0;
  async function checkActiveRow() {
    const correctValues = dailyWord.split("");
    const checkedRow = entries[activeRowIndex].map((entry, index) => {
      const currentIndexMatches = entry.letter === correctValues[index];
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
          correctAttempt: activeRowIndex,
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
              correctAttempt: activeRowIndex - 1,
              gameFinished: true,
            }}
          />
        );
      }, 2500);
    }

    if (isUserWon || activeRowIndex + 1 === attemptsLimit) {
      handleShowStatistics(isUserWon);
      setIsGamePlayable(false);
    }
  }

  function handleShake() {
    const shakeTimeout = 1000;

    // Apply shake classes
    setEntries((prevEntries) => {
      const updatedEntries = prevEntries.map((row, rowIndex) => {
        if (rowIndex === activeRowIndex) {
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
          if (rowIndex === activeRowIndex) {
            return row.map((cell) => ({ ...cell, classes: "" }));
          }
          return row;
        });
        return updatedEntries;
      });
    }, shakeTimeout);
  }

  useEffect(() => {
    const keyPressed = async (e: KeyboardEvent) => {
      const newRow = entries[activeRowIndex];
      const key = e.key;
      const isLetter = /^[a-zA-Z]$/i.test(key);
      switch (key) {
        case "Enter":
          if (entries[activeRowIndex].every((entry) => entry.letter !== "")) {
            await checkActiveRow();
            activeRowIndex++;
            activeIndex = 0;
          } else {
            handleShake();
            setActiveComponent(
              <MessageToast message="Not enough letters" close={handleClose} />
            );
          }
          break;
        case "Backspace":
          {
            if (activeIndex > 0) {
              activeIndex--;
              newRow[activeIndex] = {
                letter: "",
                result: "",
                classes: "",
              };

              assignEntries(newRow);
            }
          }
          break;
        default:
          if (isLetter && activeIndex < wordLength) {
            // Only update entries if activeIndex is within bounds
            newRow[activeIndex].letter = e.key;

            assignEntries(newRow);

            activeIndex++;
          }
      }
    };

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
    </section>
  );
}

export default App;
