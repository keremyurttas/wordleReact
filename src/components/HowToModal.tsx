import { useEffect, useState } from "react";

interface Props {
  close: () => void;
}

export default function HowToModal({ close }: Props) {
  useEffect(() => {
    setTimeout(() => {
      setAnimation(true);
    }, 500);
  });
  const [animation, setAnimation] = useState(false);
  function exampleWordle(word: string, classes: string, desiredIndex: number) {
    return (
      <>
        {word.split("").map((cell, index) => (
          <div
            key={index}
            className={`${index === desiredIndex && classes} ${
              animation && "rotate-x"
            } cell text-lg md:text-2xl`}
          >
            {cell}
          </div>
        ))}
      </>
    );
  }
  return (
    <section className="w-full h-full fixed flex pt-20 top-0 justify-center backdrop-blur-sm z-50">
      <div className="w-max p-10 rounded-xl backdrop-blur-sm justify-center h-max bg-white dark:bg-key_dark space-y-4 shadow-lg">
        <div>
          <button
            onClick={close}
            className="absolute right-5 top-5 text-2xl cursor-pointer hover:text-white focus:outline-none"
          >
            x
          </button>
          <h3 className="text-4xl font-bold dark:text-white">How To Play</h3>
          <span className="font-light">Guess the Wordle in 6 tries.</span>
        </div>
        <ul className="list-disc">
          <li>Each guess must be valid 5-letter word.</li>
          <li>
            The color of the tiles will change to show how close your guess was
            to the word.
          </li>
        </ul>
        <hr />
        <div className="space-y-4">
          <h5 className="font-semibold">Examples</h5>
          <div>
            <div className="space-y-2">
              <div className="letter-container w-1/2">
                {exampleWordle("weary", "bg-cell_true dark:bg-cell_true", 0)}
              </div>
              <p>
                <strong>W</strong> is in the word and in the correct spot.
              </p>
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <div className="letter-container w-1/2">
                {exampleWordle(
                  "pills",
                  "bg-cell_false_position dark:bg-cell_dark_false_position",
                  1
                )}
              </div>
              <p>
                <strong>I</strong> is in the word but in the wrong spot.
              </p>
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <div className="letter-container w-1/2">
                {exampleWordle(
                  "vague",
                  "bg-cell_false dark:bg-cell_dark_false",
                  3
                )}
              </div>
              <p>
                <strong>U</strong> is not in the word in any spot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
