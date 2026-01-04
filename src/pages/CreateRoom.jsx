// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useQuizStore } from "../stores/useQuizStore";
// import { useTheme } from "../theme/Theme";
// import { Plus, ArrowRight, CheckCircle } from "lucide-react";
// import api from "../api/api";
// import toast from "react-hot-toast";

// const CreateRoom = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const {
//     setUser,
//     setRoomInfo,
//     setQuestions: setStoreQuestions,
//   } = useQuizStore();
//   const bottomRef = useRef(null);

//   const [step, setStep] = useState(1);

//   const [hostName, setHostName] = useState("");
//   const [maxQuestions, setMaxQuestions] = useState(3);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [questionsList, setQuestionsList] = useState([
//     {
//       question: "",
//       options: ["", "", "", ""],
//       correctAnswer: null,
//     },
//   ]);

//   // Auto-scroll
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [questionsList.length]);

//   const handleConfigSubmit = (e) => {
//     e.preventDefault();
//     if (maxQuestions > 5) {
//       toast.error("Maximum 5 questions allowed.");
//       return;
//     }
//     setStep(2);
//   };

//   const updateQuestionText = (index, text) => {
//     const updated = [...questionsList];
//     updated[index].question = text;
//     setQuestionsList(updated);
//   };

//   const updateOption = (qIndex, optIndex, text) => {
//     const updated = [...questionsList];
//     const newOptions = [...updated[qIndex].options];
//     newOptions[optIndex] = text;
//     updated[qIndex].options = newOptions;
//     setQuestionsList(updated);
//   };

//   const setCorrectAnswer = (qIndex, optIndex) => {
//     const updated = [...questionsList];
//     updated[qIndex].correctAnswer = optIndex;
//     setQuestionsList(updated);
//   };

//   const isCurrentQuestionValid = () => {
//     const current = questionsList[questionsList.length - 1];
//     return (
//       current.question.trim() !== "" &&
//       current.options.every((opt) => opt.trim() !== "") &&
//       current.correctAnswer !== null
//     );
//   };

//   const handleAddNext = () => {
//     if (questionsList.length >= maxQuestions) return;
//     setQuestionsList([
//       ...questionsList,
//       {
//         question: "",
//         options: ["", "", "", ""],
//         correctAnswer: null,
//       },
//     ]);
//   };

//   const handleFinalSubmit = async () => {
//     setIsSubmitting(true);

//     const payload = {
//       hostName,
//       questions: questionsList,
//     };
//     try {
//       const { data } = await api.post("/room/create", payload);
//       setUser({ name: hostName, isHost: true });
//       setRoomInfo(data.generatedCode, `Quiz Room ${data.generatedCode}`);
//       setStoreQuestions(questionsList);

//       // navigate(`/lobby/${data.generatedCode}`);
//       console.log(data);
//       console.log(questionsList);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Server error");
//       console.log(error?.response?.data?.message);
//       console.log(questionsList);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div
//       className={`min-h-[80vh] w-full pt-10 pb-20 px-4 ${theme.bg} ${theme.text}`}
//     >
//       <div className="max-w-3xl mx-auto">
//         <AnimatePresence mode="wait">
//           {/* Step 1  :- configuration */}

//           {step === 1 && (
//             <motion.div
//               key="step1"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, x: -50 }}
//               className={`p-8 rounded-2xl border shadow-xl ${theme.container}`}
//             >
//               <h2 className={`text-3xl font-bold mb-6 ${theme.text}`}>
//                 Start a Quiz
//               </h2>
//               <form onSubmit={handleConfigSubmit} className="space-y-6">
//                 <div>
//                   <label
//                     className={`block text-sm font-medium mb-2 ${theme.textMuted}`}
//                   >
//                     Host Name
//                   </label>
//                   <input
//                     value={hostName}
//                     onChange={(e) => setHostName(e.target.value)}
//                     className={`w-full p-4 rounded-xl outline-none transition-all ${theme.inputBg} ${theme.text}`}
//                     placeholder="Enter your name"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label
//                     className={`block text-sm font-medium mb-2 ${theme.textMuted}`}
//                   >
//                     Number of Questions (Max 5)
//                   </label>
//                   <input
//                     type="number"
//                     min="1"
//                     max="5"
//                     value={maxQuestions}
//                     onChange={(e) => setMaxQuestions(parseInt(e.target.value))}
//                     className={`w-full p-4 rounded-xl outline-none transition-all ${theme.inputBg} ${theme.text}`}
//                     required
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
//                 >
//                   Continue to Questions <ArrowRight size={20} />
//                 </button>
//               </form>
//             </motion.div>
//           )}

//           {/* Step 2: Questions Bulider */}

//           {step === 2 && (
//             <motion.div
//               key="step2"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="space-y-8"
//             >
//               <div className="flex justify-between items-center">
//                 <h2 className={`text-2xl font-bold ${theme.text}`}>
//                   Builder ({questionsList.length}/{maxQuestions})
//                 </h2>
//               </div>

//               {/* Render List of Questions */}

//               {questionsList.map((q, qIndex) => {
//                 const isCurrent = qIndex === questionsList.length - 1;

//                 return (
//                   <motion.div
//                     key={qIndex}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className={`p-6 rounded-2xl border shadow-lg transition-all duration-300
//                                 ${
//                                   isCurrent
//                                     ? theme.container
//                                     : `${theme.cardBg} opacity-60`
//                                 }
//                             `}
//                   >
//                     <div className="flex justify-between items-center mb-4">
//                       <span
//                         className={`text-xs font-bold uppercase tracking-wider ${theme.text}`}
//                       >
//                         Question {qIndex + 1}
//                       </span>
//                       {!isCurrent && (
//                         <CheckCircle size={20} className="text-green-500" />
//                       )}
//                     </div>

//                     {/* Question Input */}

//                     <input
//                       value={q.question}
//                       onChange={(e) =>
//                         updateQuestionText(qIndex, e.target.value)
//                       }
//                       placeholder="Type your question here..."
//                       disabled={!isCurrent}
//                       className={`w-full p-3 mb-4 text-lg font-medium rounded-lg bg-transparent border-b-2 outline-none placeholder:opacity-50
//                                     ${theme.text}
//                                     ${
//                                       isCurrent
//                                         ? "border-indigo-500"
//                                         : "border-transparent"
//                                     }
//                                 `}
//                     />

//                     {/* Options Grid */}

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                       {q.options.map((opt, optIndex) => (
//                         <div key={optIndex} className="relative group">
//                           <input
//                             value={opt}
//                             onChange={(e) =>
//                               updateOption(qIndex, optIndex, e.target.value)
//                             }
//                             disabled={!isCurrent}
//                             placeholder={`Option ${optIndex + 1}`}
//                             className={`w-full p-3 pl-10 rounded-lg outline-none transition-all ${
//                               theme.text
//                             }
//                                                 ${
//                                                   q.correctAnswer === optIndex
//                                                     ? "border border-green-500 bg-green-500/10"
//                                                     : theme.inputBg
//                                                 }
//                                             `}
//                           />
//                           <button
//                             onClick={() => setCorrectAnswer(qIndex, optIndex)}
//                             disabled={!isCurrent}
//                             className={`absolute left-3 top-3.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors
//                                                 ${
//                                                   q.correctAnswer === optIndex
//                                                     ? "border-green-500 bg-green-500"
//                                                     : "border-slate-400 hover:border-slate-600"
//                                                 }
//                                             `}
//                           >
//                             {q.correctAnswer === optIndex && (
//                               <div className="w-1.5 h-1.5 bg-white rounded-full" />
//                             )}
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </motion.div>
//                 );
//               })}

//               {/* Controls */}

//               <div ref={bottomRef} className="pt-4 flex gap-4">
//                 {questionsList.length < maxQuestions ? (
//                   <button
//                     onClick={handleAddNext}
//                     disabled={!isCurrentQuestionValid()}
//                     className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
//                                 ${
//                                   isCurrentQuestionValid()
//                                     ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
//                                     : "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
//                                 }
//                             `}
//                   >
//                     <Plus size={20} />
//                     {isCurrentQuestionValid()
//                       ? "Add Next Question"
//                       : "Fill details to continue"}
//                   </button>
//                 ) : (
//                   <button
//                     onClick={handleFinalSubmit}
//                     disabled={!isCurrentQuestionValid() || isSubmitting}
//                     className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-xl shadow-green-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
//                   >
//                     {isSubmitting
//                       ? "Creating Room..."
//                       : "Finalize & Launch Quiz"}{" "}
//                     <ArrowRight size={20} />
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default CreateRoom;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "../stores/useQuizStore";
import { useTheme } from "../theme/Theme";
import { Plus, ArrowRight, CheckCircle } from "lucide-react";
import api from "../api/api";
import toast from "react-hot-toast";

const CreateRoom = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    setUser,
    setRoomInfo,
    setQuestions: setStoreQuestions,
  } = useQuizStore();
  const bottomRef = useRef(null);

  const [step, setStep] = useState(1);
  const [hostName, setHostName] = useState("");
  const [maxQuestions, setMaxQuestions] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CHANGED: correctAnswer is now null (intended for string)
  const [questionsList, setQuestionsList] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: null,
    },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [questionsList.length]);

  const handleConfigSubmit = (e) => {
    e.preventDefault();
    if (maxQuestions > 5) return alert("Maximum 5 questions allowed.");
    setStep(2);
  };

  const updateQuestionText = (index, text) => {
    const updated = [...questionsList];
    updated[index].question = text;
    setQuestionsList(updated);
  };

  // CHANGED: If user edits the text of the *currently selected correct answer*,
  // we must update the correctAnswer state to match the new text.
  const updateOption = (qIndex, optIndex, text) => {
    const updated = [...questionsList];
    const oldOptionText = updated[qIndex].options[optIndex];

    // Update the option array
    updated[qIndex].options[optIndex] = text;

    // If this specific option was the correct answer, update the correct answer text too
    if (updated[qIndex].correctAnswer === oldOptionText) {
      updated[qIndex].correctAnswer = text;
    }

    setQuestionsList(updated);
  };

  // CHANGED: Sets the string value instead of index
  const setCorrectAnswer = (qIndex, optText) => {
    const updated = [...questionsList];
    updated[qIndex].correctAnswer = optText;
    setQuestionsList(updated);
  };

  const isCurrentQuestionValid = () => {
    const current = questionsList[questionsList.length - 1];
    return (
      current.question.trim() !== "" &&
      current.options.every((opt) => opt.trim() !== "") &&
      current.correctAnswer !== null &&
      current.correctAnswer !== "" // Ensure it's not empty string
    );
  };

  const handleAddNext = () => {
    if (questionsList.length >= maxQuestions) return;
    setQuestionsList([
      ...questionsList,
      { question: "", options: ["", "", "", ""], correctAnswer: null },
    ]);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      hostName,
      questions: questionsList,
    };
    try {
      const { data } = await api.post("/room/create", payload);
      setUser({ name: hostName, isHost: true });
      setRoomInfo(data.generatedCode, `Quiz Room ${data.generatedCode}`);
      setStoreQuestions(questionsList);

      // navigate(`/lobby/${data.generatedCode}`);
      console.log(data);
      console.log(questionsList);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
      console.log(error?.response?.data?.message);
      console.log(questionsList);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-[80vh] w-full pt-10 pb-20 px-4 ${theme.bg} ${theme.text}`}
    >
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className={`p-8 rounded-2xl border shadow-xl ${theme.container}`}
            >
              <h2 className={`text-3xl font-bold mb-6 ${theme.text}`}>
                Start a Quiz
              </h2>
              <form onSubmit={handleConfigSubmit} className="space-y-6">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${theme.textMuted}`}
                  >
                    Host Name
                  </label>
                  <input
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className={`w-full p-4 rounded-xl outline-none transition-all ${theme.inputBg} ${theme.text}`}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${theme.textMuted}`}
                  >
                    Number of Questions (Max 5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={maxQuestions}
                    onChange={(e) => setMaxQuestions(parseInt(e.target.value))}
                    className={`w-full p-4 rounded-xl outline-none transition-all ${theme.inputBg} ${theme.text}`}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  Continue to Questions <ArrowRight size={20} />
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className={`text-2xl font-bold ${theme.text}`}>
                  Builder ({questionsList.length}/{maxQuestions})
                </h2>
              </div>

              {questionsList.map((q, qIndex) => {
                const isCurrent = qIndex === questionsList.length - 1;

                return (
                  <motion.div
                    key={qIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-2xl border shadow-lg transition-all duration-300
                                ${
                                  isCurrent
                                    ? theme.container
                                    : `${theme.cardBg} opacity-60`
                                }
                            `}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${theme.textMuted}`}
                      >
                        Question {qIndex + 1}
                      </span>
                      {!isCurrent && (
                        <CheckCircle size={20} className="text-green-500" />
                      )}
                    </div>

                    <input
                      value={q.question}
                      onChange={(e) =>
                        updateQuestionText(qIndex, e.target.value)
                      }
                      placeholder="Type your question here..."
                      disabled={!isCurrent}
                      className={`w-full p-3 mb-4 text-lg font-medium rounded-lg bg-transparent border-b-2 outline-none placeholder:opacity-50
                                    ${theme.text} 
                                    ${
                                      isCurrent
                                        ? "border-indigo-500"
                                        : "border-transparent"
                                    }
                                `}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="relative group">
                          <input
                            value={opt}
                            onChange={(e) =>
                              updateOption(qIndex, optIndex, e.target.value)
                            }
                            disabled={!isCurrent}
                            placeholder={`Option ${optIndex + 1}`}
                            // LOGIC CHANGE: Compare q.correctAnswer (string) to opt (string)
                            className={`w-full p-3 pl-10 rounded-lg outline-none transition-all ${
                              theme.text
                            }
                                                ${
                                                  q.correctAnswer === opt &&
                                                  opt !== ""
                                                    ? theme.successBg
                                                    : theme.inputBg
                                                }
                                            `}
                          />
                          <button
                            // LOGIC CHANGE: Pass 'opt' (string) instead of index
                            onClick={() => setCorrectAnswer(qIndex, opt)}
                            disabled={!isCurrent || opt === ""}
                            className={`absolute left-3 top-3.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                                                ${
                                                  q.correctAnswer === opt &&
                                                  opt !== ""
                                                    ? "border-green-500 bg-green-500"
                                                    : "border-slate-400 hover:border-slate-600"
                                                }
                                            `}
                          >
                            {q.correctAnswer === opt && opt !== "" && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}

              <div ref={bottomRef} className="pt-4 flex gap-4">
                {questionsList.length < maxQuestions ? (
                  <button
                    onClick={handleAddNext}
                    disabled={!isCurrentQuestionValid()}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                                ${
                                  isCurrentQuestionValid()
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                                    : "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                                }
                            `}
                  >
                    <Plus size={20} />
                    {isCurrentQuestionValid()
                      ? "Add Next Question"
                      : "Fill details to continue"}
                  </button>
                ) : (
                  <button
                    onClick={handleFinalSubmit}
                    disabled={!isCurrentQuestionValid() || isSubmitting}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-xl shadow-green-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting
                      ? "Creating Room..."
                      : "Finalize & Launch Quiz"}{" "}
                    <ArrowRight size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateRoom;
