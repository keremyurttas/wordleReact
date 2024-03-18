import React, { useEffect, useState } from "react";

import "./App.css";
import ResultModal from "./components/ResultModal";
// import { CSSTransition } from "react-transition-group";
import HowToModal from "./components/HowToModal";
import MessageToast from "./components/MessageToast";
import { Prediction } from "./interfaces/interfaces";
function App() {
  const wordLength = 5;
  const attemptsLimit = 6;
  const dailyWord = "hello";
  // const [activeRowIndex, setActiveRowIndex] = useState(0);
  let activeRowIndex = 0;
  interface Entries {}
  interface Cell {
    letter: string;
    result: string;
    classes: string;
  }
  const [entries, setEntries] = useState(
    Array.from({ length: attemptsLimit }, (): Cell[] =>
      Array.from({ length: wordLength }, (): Cell => {
        return {
          letter: "",
          result: "",
          classes: "",
        };
      })
    )
  );

  function displayPopup(popup: string, message?: string) {
    return "sadsa";
  }
  // const [activeIndex, setActiveIndex] = useState(0);
  let activeIndex = 0;
  // const [activeRowOfEntries]
  const activeRowOfEntries = entries[activeRowIndex];
  useEffect(() => {
    const keyPressed = (e: KeyboardEvent) => {
      const newRow = entries[activeRowIndex];
      const key = e.key;
      const isLetter = /^[a-zA-Z]$/i.test(key);
      const assignCellValues = () => {
        setEntries([
          ...entries.slice(0, activeRowIndex),
          newRow,
          ...entries.slice(activeRowIndex + 1),
        ]);
      };
      switch (key) {
        case "Enter":
          if (entries[activeRowIndex].every((entry) => entry.letter !== "")) {
            checkActiveRow();
            activeRowIndex++;
            activeIndex = 0;
          } else {
            alert("Please fill all cells before moving to the next row.");
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

              assignCellValues();
            }
          }
          break;
        default:
          if (isLetter && activeIndex < wordLength) {
            // Only update entries if activeIndex is within bounds
            newRow[activeIndex] = {
              letter: e.key,
              result: "",
              classes: "",
            };
            assignCellValues();

            activeIndex++;
          }
      }
    };

    window.addEventListener("keydown", keyPressed);

    return () => {
      window.removeEventListener("keydown", keyPressed);
    };
  }, []);
  useEffect(() => {}, [entries]);
  function checkActiveRow() {
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

    setEntries([
      ...entries.slice(0, activeRowIndex),
      checkedRow,
      ...entries.slice(activeRowIndex + 1),
    ]);
    console.log(checkedRow);
  }

  function getGameTable() {
    return (
      <>
        {
          entries.map((entry, entryIndex) =>
            entry.map((cell, cellIndex) => {
              const uniqueKey = `entry-${entryIndex}-cell-${cellIndex}`;
              return (
                <div
                  key={uniqueKey}
                  className={cell.classes + "cell w-20 h-20"}
                >
                  {cell.letter}
                </div>
              );
            })
          )

          /* {entries.map((row, index) => {
          row.map((cell) => {
            <div
              className="cell w-20 h-20 bg-red-500"
              // className={`${handleCellBG(cell.result)} ${handleShake(
              //   index
              // )} cell`}
              key={index}
            >
              {cell.letter}
            </div>;
          });
        })} */
        }
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

  // useEffect(() => {
  //   console.log(entries);
  // }, [entries]);
  return (
    <section className="md:py-10 py-5 flex flex-col justify-between h-screen dark:bg-main_dark_bg">
      <div className="mx-auto px-6 py-8 flex gap-8 md:gap-40 dark:bg-header_dark_bg bg-header_bg w-max rounded-2xl">
        <div className="flex gap-4">
          {}
          <button onClick={() => displayPopup("HowToModal")}>
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
          <button onClick={() => displayPopup("ResultModal")}>
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
