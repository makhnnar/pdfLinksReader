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
    const processData = (urls: Record<number, string[][]>) => {
        if (!originalJson) {
            console.error("Cannot process: JSON input is empty.");
            return;
        }
        try {
            const data = JSON.parse(originalJson);

            console.log("urls: ", urls)

            data.weeks.forEach((week: any, weekIndex: number) => {
                // Iterate through trainings and assign URLs based on type
                if (week.trainings && Array.isArray(week.trainings)) {
                    week.trainings.forEach((training: any) => {
                        if (training.type === 'running') {
                            // Assign URL from even positions for running trainings
                            training.sessions.forEach((session: any, sessionIndex: number) => {
                                session.explanation_video = urls[weekIndex]?.[0][sessionIndex] ?? null;
                            });
                        }
                        if (training.type === 'weights') {
                            // Assign URL from odd positions for weights trainings
                            training.sessions.forEach((session: any,sessionIndex: number) => {
                                session.blocks.forEach((block: any, blockIndex: number) => {
                                    block.explanation_video = urls[weekIndex]?.[sessionIndex + 1][blockIndex] ?? null;
                                });
                            });
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