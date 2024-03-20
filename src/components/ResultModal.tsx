import { Statistics } from "../interfaces/interfaces";
const MAX_ATTEMPTS = 6;

interface Props {
  close: () => void;
  statistics: Statistics;
  message: string;
}

export default function ResultModal({ close, statistics, message }: Props) {
  console.log(statistics);
  const renderGameResult = () => {
    if (!statistics.gameFinished) return null;

    return (
      <h2>
        {statistics.win && "Congratulations!! "} Today's word was:{" "}
        <strong className="uppercase">{message}</strong>
      </h2>
    );
  };
  function getResultBarDesign(index: number) {
    return statistics.correctAttempt === index
      ? "w-full bg-cell_true dark:bg-cell_dark_true"
      : "bg-message";
  }
  const attempts = Array.from(
    { length: MAX_ATTEMPTS },
    (_, index) => index + 1
  );
  return (
    <section className="w-full h-full fixed pt-20 flex top-0 justify-center z-50 backdrop-blur-sm">
      <div className="w-max relative px-10 py-10 rounded-xl justify-center h-max dark:bg-key_dark bg-white space-y-4 shadow-lg">
        <button
          onClick={close}
          className="dark:text-white absolute right-5 top-5 text-2xl"
        >
          x
        </button>

        {renderGameResult()}
        <h3 className="text-2xl font-bold dark:text-white">Statistics</h3>
        <div className="flex gap-4 lg:gap-20">
          <div className="flex flex-col items-center">
            <strong className="text-2xl">
              {statistics.gameFinished ? 1 : 0}
            </strong>
            <span className="text-sm">Played</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <strong className="text-2xl">{statistics.win ? 100 : 0}</strong>
            <span className="text-sm">Win %</span>
          </div>
          <div className="flex flex-col items-center">
            <strong className="text-2xl">0</strong>
            <span className="text-sm">Current Streak</span>
          </div>
          <div className="flex flex-col items-center">
            <strong className="text-2xl">0</strong>
            <span className="text-sm">Max Streak</span>
          </div>
        </div>
        <hr />
        <h5 className="uppercase font-bold">Guess Distribution</h5>
        {attempts.map((attempt, index) => (
          <div className="flex items-center gap-2" key={attempt}>
            <strong>{index + 1}</strong>
            <div
              className={`${getResultBarDesign(
                index
              )} w-5 h-5 flex items-center justify-center text-white`}
            >
              {" "}
              {index === statistics.correctAttempt ? 1 : 0}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
