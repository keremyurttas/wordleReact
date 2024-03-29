import { useEffect, useState } from "react";
import { Prediction } from "../interfaces/interfaces";
interface Props {
  pressedKey: (key: string) => void;
  entries: Prediction[][];
}

export default function Keyboard({ entries, pressedKey }: Props) {
  const [delayedEntries, setDelayedEntries] = useState(entries); // State to hold entries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedEntries(entries);
    }, 2500);
  }, [entries]);

  const allPredictions: Prediction[] = delayedEntries.flatMap((row) => row);
  function handleKeyBG(key: string) {
    {
      const relevantPredictions = allPredictions.filter(
        (prediction) => key === prediction.letter
      );

      const counts = relevantPredictions.reduce((acc: any, entry) => {
        acc[entry.result] = (acc[entry.result] || 0) + 1;
        return acc;
      }, {});

      return counts.true
        ? "bg-cell_true dark:bg-cell_true"
        : counts["false-position"]
        ? "bg-cell_false_position dark:bg-cell_dark_false_position"
        : counts.false
        ? "bg-cell_false dark:bg-key_dark_false"
        : "";
    }
  }
  const keyboardLayout = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["Enter", "z", "x", "c", "v", "b", "n", "m", "Del"],
  ];

  return (
    <div className="mx-auto w-max flex flex-col  lg:gap-3 md:gap-2 gap-1 items-center">
      {keyboardLayout.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex  lg:gap-3 md:gap-2 gap-1 items-center"
        >
          {row.map((key, index) => (
            <div
              onClick={() => pressedKey(key)}
              key={index}
              className={`${key.length > 1 ? "uppercase" : ""}
                ${handleKeyBG(key)}
            keyboard-btn`}
            >
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
