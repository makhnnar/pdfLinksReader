'use client';

import React from "react";  
import usePdfFileProcessor from "./pdfprocessor";
import useJsonProcessor from "./jsonprocessor";

export default function Home() {
  const {
    processFile,
    links,
    loading,
    error,
  } = usePdfFileProcessor();

  const { processData, originalJson, setOriginalJson, processedJson } =
    useJsonProcessor();

  const handleProcessJson = () => {
    if (originalJson && links) {
      processData(links);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-start gap-6 py-16 px-8 bg-white dark:bg-black sm:px-16">
        <h1>Select a PDF file to extract links</h1>
        <input type="file" id="pdf-file-input" accept=".pdf" onChange={(e)=>processFile(e.target)} />
        <div id="inputs-container" className="flex w-full flex-col gap-4">
          <label htmlFor="json-input">Paste JSON content here:</label>
          <FormatedInput
            value={originalJson || ""}
            onChange={(e) => setOriginalJson(e.target.value)}
          />
          <button onClick={handleProcessJson} className="mt-2 self-start rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Process JSON
          </button>
          <label htmlFor="json-output">Processed JSON:</label>
          <FormatedInput
            value={processedJson || ""}
            onChange={() => {}}
          />
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
      </main>
    </div>
  );
}

interface FormatedInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const FormatedInput = ({ value, onChange }: FormatedInputProps) => {
  return (
    <textarea value={value} onChange={onChange} className="w-full rounded border bg-zinc-50 p-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900" rows={15} />
  );
};
