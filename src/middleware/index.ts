function getNewWord() {
  return fetch("https://random-word-api.herokuapp.com/word?length=5")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        return data[0]; // Assuming the API returns an array of words, take the first one
      } else {
        throw new Error("No data received or data format incorrect");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to be caught by the caller
    });
}
// function isAWord(userWord: string) {
//   return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${userWord}`)
//     .then((response) => {
//       if (response.ok) {
//         return true; // Return true if response is OK
//       } else if (response.status === 404) {
//         return false; // Return false if word is not found
//       } else {
//         // For any other status codes, throw an error
//         throw new Error(`Unexpected response status: ${response.status}`);
//       }
//     })
//     .catch((error) => {
//       if (
//         error instanceof Error &&
//         error.message.startsWith("Unexpected response status: 404")
//       ) {
//         return false; // Suppress console error for 404 status
//       }
//       console.error("Error fetching data:", error);
//       return false; // Return false for any other errors
//     });
// }
// async function isAWord(userWord: string) {
//   try {
//     const response = await fetch(
//       `https://api.dictionaryapi.dev/api/v2/entries/en/${userWord}`
//     );
//     if (response.ok) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return false;
//   }
// }
//   useEffect(() => {
//     getNewWord()
//       .then((word) => {
//         dailyWord = 'wards';
//         console.log(dailyWord);
//       })
//       .catch((error) => {
//         console.log("Error occured when fetcing word");
//       });
//   }, []);
export { getNewWord };
