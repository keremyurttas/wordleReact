import { useEffect } from "react";

interface Props {
  message: string;
  close: () => void;
}

export default function MessageToast({ message, close }: Props) {
  useEffect(() => {
    setTimeout(() => {
      close();
    }, 1000);
  });
  return (
    <div className="absolute top-44 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-message_bg text-white">
      {message}
    </div>
  );
}
