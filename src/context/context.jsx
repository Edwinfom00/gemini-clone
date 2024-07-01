import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

export const ContextProvider = (props) => {
  const [input, SetInput] = useState("");
  const [recentPrompt, SetRecentPrompt] = useState("");
  const [prevPrompts, SetPrevPrompts] = useState([]);
  const [showResult, SetShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    SetShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    SetShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await run(prompt);
      SetRecentPrompt(prompt);
    } else {
      SetPrevPrompts((prev) => [...prev, input]);
      SetRecentPrompt(input);
      response = await run(input);
    }
    // SetRecentPrompt(input);
    // SetPrevPrompts((prev) => [...prev, input]);
    // const response = await run(input);
    let responseArray = response.split("**");
    let newResponse = "";

    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");

    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nestWord = newResponseArray[i];
      delayPara(i, nestWord + " ");
    }
    setLoading(false);
    SetInput("");
  };

  const contextValue = {
    prevPrompts,
    SetPrevPrompts,
    onSent,
    SetRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    SetInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
