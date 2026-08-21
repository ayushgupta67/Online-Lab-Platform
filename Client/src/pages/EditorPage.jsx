import React, { useState, useEffect } from "react";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { useClassroomStore } from "../store/useClassroomStore.js";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";

const languageExtensions = {
  c: cpp(),
  cpp: cpp(),
  python3: python(),
  java: java(),
};

let testCasesList = [];

const EditorPage = () => {
  const [script, setCode] = useState('print("Hello")');
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python3");
  const [selectedTestCase, setSelectedTestCase] = useState("");
  const [assignment, setAssignment] = useState(null);
  const [showInput, setShowInput] = useState(true);
  const [score, setScore] = useState(null); // State to store the score

  const { assignmentId } = useParams();
  const { getAssignment, submitAssignment, getSubmittedCode} = useClassroomStore(); // Import the submitAssignment function

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const fetchedAssignment = await getAssignment(assignmentId);
        setAssignment(fetchedAssignment);
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    };

    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId, getAssignment]);

  // fetch the submitted code with assignment id 
  useEffect(() => {
    const fetchSubmittedCode = async () => {
      try {
        const submittedCode = await getSubmittedCode(assignmentId);
        if (submittedCode) {
          setCode(submittedCode.code); // Set the code in the editor
          setScore(submittedCode.score); // Set the score in the editor
        }
      } catch (error) {
        console.error("Error fetching submitted code:", error);
      }
    };
    if (assignmentId) {
      fetchSubmittedCode();
    }
  }, [assignmentId, getSubmittedCode]);


  testCasesList = assignment?.testCases || [];

  const handleRun = async () => {
    console.log("Language sent:", language);
    try {
      const response = await axiosInstance.post('/compile', {
        script,
        language,
        versionIndex: 3,
        stdin: input,
      });

      console.log("Response from server:", response);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = response.data;
      setOutput(data.output || "No output received");
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput(error.message);
    }
  };

  const evaluateCode = async () => {
    let passedTestCases = 0;

    for (const testCase of testCasesList) {
      try {
        const response = await axiosInstance.post("/compile", {
          script,
          language,
          versionIndex: 3,
          stdin: testCase.input,
        });
        // const response = await fetch("http://localhost:5000/api/compile", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     script,
        //     language,
        //     versionIndex: 3,
        //     stdin: testCase.input,
        //   }),
        // });
        if (response.status < 200 || response.status >= 300) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.data;
        if (data.output.trim() === testCase.expectedOutput.trim()) {
          passedTestCases++;
        }
      } catch (error) {
        console.error("Error evaluating test case:", error);
      }
      break;
    }

    const totalTestCases = testCasesList.length;
    const calculatedScore = Math.round((passedTestCases / totalTestCases) * 100);
    setScore(calculatedScore);

    // Call the evaluate function with the score, assignmentId
    //console.log("Submitting assignment with score:", calculatedScore);
    await submitAssignment(script,calculatedScore, assignmentId);
  };

  return (
    <div className="h-screen pt-16 w-screen bg-gray-900 text-white flex ">
      {/* Left Panel */}
      <div className="w-1/3 flex flex-col py-2 px-4 my-0 space-y-4">
        {/* Problem Description */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md h-1/2 overflow-auto">
          <h2 className="text-lg font-semibold mb-2">
            {assignment ? assignment.assignmentName : "Loading..."}
          </h2>
          <p className="text-sm">
            {assignment ? assignment.description : "Fetching assignment details..."}
          </p>
        </div>

        {/* Test Cases Selector */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md h-1/2">
          <h3 className="text-md font-semibold mb-2">Test Cases</h3>
          <select
            className="w-full p-2 bg-gray-700 text-white rounded"
            onChange={(e) => {
              const testCase = testCasesList.find(tc => tc._id === e.target.value);
              setSelectedTestCase(testCase?.expectedOutput || "");
              setInput(testCase?.input || "");
            }}
          >
            <option value="">Select a test case</option>
            {testCasesList.map((test) => (
              <option key={test._id} value={test._id}>
                Test {test.input}
              </option>
            ))}
          </select>

          <textarea
            value={selectedTestCase}
            readOnly
            className="w-full h-20 bg-gray-700 text-white mt-2 p-2 rounded resize-none"
          />
        </div>
      </div>

      {/* Right Panel (Split Editor + Output) */}
      <Split
        className="flex-1 flex flex-col pt-4 "
        sizes={[65, 35]}
        minSize={200}
        direction="vertical"
      >
        {/* Code Editor */}
        <div className="bg-gray-800 p-2 flex flex-col h-full">
          <CodeMirror
            value={script}
            height="100%"
            width="100%"
            extensions={[languageExtensions[language]]}
            theme={oneDark}
            onChange={(value) => setCode(value)}
            className="flex-1"
          />

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between p-2 bg-gray-700 rounded-lg mt-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-0.5 bg-gray-600 text-white rounded"
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="python3">Python</option>
              <option value="java">Java</option>
            </select>

            <div className="flex items-center gap-2">
              {/* Score Display */}
              {score !== null && (
                <span className="text-green-500 font-semibold">
                  Score: {score}%
                </span>
              )}

              {/* Submit Button */}
              <button
                className="bg-green-500 px-4 py-0.5 rounded text-white hover:bg-green-600"
                onClick={evaluateCode}
              >
                Submit
              </button>

              {/* Run Code Button */}
              <button
                className="bg-blue-500 px-4 py-0.5 rounded text-white hover:bg-blue-600"
                onClick={handleRun}
              >
                Run Code
              </button>
            </div>
          </div>
        </div>

        {/* Input/Output Toggle Section */}
        <div className="bg-gray-800 p-4 rounded-lg h-full">
          <div className="flex justify-between mb-2">
            {/* Toggle Buttons */}
            <button
              className={`px-4 py-1 rounded ${
                showInput ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
              }`}
              onClick={() => setShowInput(true)}
            >
              Input
            </button>
            <button
              className={`px-4 py-1 rounded ${
                !showInput ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
              }`}
              onClick={() => setShowInput(false)}
            >
              Output
            </button>
          </div>

          {/* Input Field */}
          {showInput && (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full bg-gray-700 text-white p-2 rounded resize-none"
              placeholder="Enter input here..."
            />
          )}

          {/* Output Field */}
          {!showInput && (
            <pre className="bg-gray-700 p-2 rounded h-full overflow-auto">{output}</pre>
          )}
        </div>
      </Split>
    </div>
  );
};

export default EditorPage;
