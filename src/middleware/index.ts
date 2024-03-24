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
      throw error;
    });
}

async function isAWord(word: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (response.ok) {
      return true; // Word is found
    } else {
      // Word not found
      return false;
    }
  } catch (error) {
    console.error("Error while checking if word is valid:", error);
    return false;
  }
}

export { getNewWord, isAWord };
