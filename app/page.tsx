'use client';

import React from "react";  
import usePdfFileProcessor from "./pdfprocessor";

export default function Home() {
  const {
    processFile,
    links,
    loading,
    error
  } = usePdfFileProcessor();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>Select a PDF file to extract links</h1>
        <input type="file" id="pdf-file-input" accept=".pdf" onChange={(e)=>processFile(e.target)} />
        <div id="links-container">
          {links}
        </div>
      </main>
    </div>
  );
}


