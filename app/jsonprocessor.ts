import { useState } from "react";

const useJsonProcessor = () => {
    const [originalJson, setOriginalJson] = useState<string | null>(null);
    const [processedJson, setProcessedJson] = useState<string | null>(null);

    /**
     * Processes a JSON file and an array of URLs.
     * It parses the JSON string, then iterates through the weeks to insert URLs
     * into the 'explanation_video' property for both lifted and running trainings.
     * @param jsonInput The JSON file to process.
     * @param urls An array of URL strings.
     */
    const processData = (urls: string[][]) => {
        if (!originalJson) {
            console.error("Cannot process: JSON input is empty.");
            return;
        }
        try {
            const data = JSON.parse(originalJson);

            console.log("url size: ", urls.length)

            data.weeks.forEach((week: any, weekIndex: number) => {
                // Iterate through trainings and assign URLs based on type
                if (week.trainings && Array.isArray(week.trainings)) {
                    week.trainings.forEach((training: any) => {
                        if (training.type === 'running') {
                            // Assign URL from even positions for running trainings
                            training.explanation_video = urls[weekIndex]?.[0] ?? null;
                        }
                        if (training.type === 'weights') {
                            // Assign URL from odd positions for weights trainings
                            training.explanation_video = urls[weekIndex+1]?.[0] ?? null;
                        }
                    });
                }
            });

            setProcessedJson(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error("Error processing JSON data:", error);
            // Optionally, handle the error in the UI
        }
    };

    return {
        processData,
        originalJson,
        setOriginalJson,
        processedJson,
    };
};

export default useJsonProcessor;