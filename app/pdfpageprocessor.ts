// 1. Define Interfaces based on the JSON structure
interface Annotation {
  id?: string;
  overlaidText?: string;
  url?: string;
  dest?: any[];
  // ... other properties (rect, color, etc.) can be ignored for this logic
}

type Page = Annotation[]; // Each page is an array of annotations

// 2. Define the Output Structure (The "Page Guide")
interface ProgramMap {
  weeks: Record<number, WeekStructure>;
  tools: {
    physicalEval: number | null;
    fcMaxCalc: number | null;
    rmCalc: number | null;
    renewal: number | null;
  };
}

interface WeekStructure {
  startIndex: number; // The "Overview" page
  trainingPages: number[]; // The 4 workout pages
  adPage: number; // The periodic ad page
}

// 3. The Main Logic Class
const pdfPageIndexer = () => {

  
  /**
   * STRATEGY 1: TOC Extraction (The Master Key)
   * We parse Page 2 (Index 1) to find exactly where each week starts.
   */
   const processPages = (pages: Page[]) : ProgramMap => {

    const map: ProgramMap = {
      weeks: {},
      tools: {
        physicalEval: null,
        fcMaxCalc: null,
        rmCalc: null,
        renewal: null,
      },
    };

    // 1. Parse TOC (Index 1) for Weeks
    const tocPage = pages[1]; // Page 2 is the TOC
    if (tocPage) {
      tocPage.forEach((ann) => {
        if (!ann.overlaidText) return;

        // Regex to match "semana X ........... Y"
        // Captures Group 1: Week Number, Group 2: Page Number
        const weekMatch = ann.overlaidText.match(/semana\s+(\d+).*?(\d+)$/i);

        if (weekMatch) {
          const weekNum = parseInt(weekMatch[1], 10);
          const pdfPageNum = parseInt(weekMatch[2], 10);
          
          // Convert PDF Page Number (1-based) to Array Index (0-based)
          const startIndex = pdfPageNum - 1; 
          
          map.weeks[weekNum] = buildWeekStructure(startIndex);
        }
      });
    }

    // 2. Parse Domain Signatures (Functional Indicators)
    // We scan specific pages or the whole doc to find tools
    pages.forEach((page, index) => {
      page.forEach((ann) => {
        if (!ann.url) return;

        if (ann.url.includes("webhook.timehibrido.com.br")) {
          map.tools.physicalEval = index;
        } else if (ann.url.includes("/fcmax")) {
          map.tools.fcMaxCalc = index;
        } else if (ann.url.includes("/rm")) {
          map.tools.rmCalc = index;
        } else if (ann.url.includes("/renovacao")) {
          map.tools.renewal = index;
        }
      });
    });

    return map;
  }

  /**
   * STRATEGY 2: The "6-Page Heartbeat"
   * Once we know the start index, we can mathematically project the rest of the week.
   */
  const buildWeekStructure = (startIndex: number): WeekStructure =>{
    return {
      startIndex: startIndex,
      trainingPages: [
        startIndex,
        startIndex + 1, // Workout A
        startIndex + 2, // Workout B
        startIndex + 3, // Workout C
        startIndex + 4, // Workout D
      ],
      adPage: startIndex + 5, // The Ad/Filler page
    };
  }

  return {
    processPages,
  }

}

export default pdfPageIndexer;