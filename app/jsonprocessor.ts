import { useState } from "react";

const useJsonProcessor = () => {
    const [processedJson, setProcessedJson] = useState<string | null>(null);

    /**
     * Processes a JSON file and an array of URLs.
     * It parses the JSON string, then iterates through the weeks to insert URLs
     * into the 'explanation_video' property for both lifted and running trainings.
     * @param jsonInput The JSON file to process.
     * @param urls An array of URL strings.
     */
    const processData = (jsonInput: string, urls: string[][]) => {
        // TODO: Implement the logic for processing the JSON and URLs.
        try {
            const data = JSON.parse(jsonInput);

            data.weeks.forEach((week: any, weekIndex: number) => {
                const urlIndexForWeek = weekIndex * 2;

                // Process running trainings (even positions: 0, 2, 4...)
                if (week.running_trainings && Array.isArray(week.running_trainings)) {
                    week.running_trainings.forEach((training: any) => {
                        training.explanation_video = urls[urlIndexForWeek]?.[0] ?? null;
                    });
                }

                // Process lifted trainings (odd positions: 1, 3, 5...)
                if (week.lifted_trainings && Array.isArray(week.lifted_trainings)) {
                    week.lifted_trainings.forEach((training: any) => {
                        // Access the next URL index for lifted training
                        training.explanation_video = urls[urlIndexForWeek + 1]?.[0] ?? null;
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
        processedJson,
    };
};

export default useJsonProcessor;