import * as pdfjs from 'pdfjs-dist';
import { useState } from 'react';

// Set the worker source for pdf.js from a CDN
// This is crucial for pdf.js to work in a web environment like Next.js.
// Pointing to a local copy in the public directory.
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`; // Assuming you copied pdf.worker.mjs to your public folder


const usePdfFileProcessor = () => {

    const [links, setLinks] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const getLinks = async (url: string) => {
        console.log('url(getLinks)', url);

        try {
            const pdf = await pdfjs.getDocument(url).promise;
            console.log('pdfFile', pdf);
            console.log('pdf.numPages', pdf.numPages);

            const pagePromises = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                pagePromises.push(pdf.getPage(i).then(page => page.getAnnotations()));
            }

            const allAnnotations = await Promise.all(pagePromises);
            const processedAnnotations = allAnnotations.flatMap(annotations => {
                return annotations.filter(anno => anno.subtype === 'Link' && anno.url)
                    .map(anno => anno.url as string);
            });
            console.log('processedAnnotations', processedAnnotations);
            setLinks(processedAnnotations);
        } catch (error: any) {
            console.error('Error loading PDF:', error);
            setError(error.message);
        }
    }

    const processFile = async (input:HTMLInputElement) => {
        setLoading(true);
        setError('');

        const files = input.files;

        if (!files || files.length === 0) {
            console.log('No file selected.');
            setError('No file selected.');
            setLoading(false);
            return;
        }

        const file = files[0];

        if (file.type !== 'application/pdf') {
            console.error('Selected file is not a PDF.');
            setError('Selected file is not a PDF.');
            setLoading(false);
            return;
        }

        // Create a temporary URL for the selected local file
        const fileURL = URL.createObjectURL(file);

        console.log(`Processing file: ${file.name}`);

        try {
            // Use the generated URL with your getLinks function
            await getLinks(fileURL);
        }catch(e:any){
            // It's good practice to revoke the object URL when you're done with it
            // to free up memory.
            URL.revokeObjectURL(fileURL);
            setLoading(false);
        }
    }

    // It's good practice to revoke the object URL when you're done with it
    // to free up memory. This should be done after the PDF processing is complete.
    // However, in the current structure, processFile already handles revoking.
    // If getLinks were called directly, you'd need to revoke there.

    return {
        processFile,
        links,
        loading,
        error,
    }

}

export default usePdfFileProcessor;