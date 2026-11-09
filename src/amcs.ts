/**
 * One entry per AMC we fetch from. `files(year, month)` returns the AMC's own published file URLs
 * for that month-end. Only AMCs whose terms we have read and are comfortable with go in here.
 * To drop an AMC (e.g. after a removal request), delete its entry and its data/<id>/ folder.
 */
export interface Amc {
  id: string;
  name: string;
  /** Page where the AMC publishes these files; linked from every output file. */
  page: string;
  /** `name` is the plain scheme name; the parsed one carries long SEBI descriptors or falls back to a sheet code. */
  files(year: number, month: number): { code: string; name: string; url: string }[];
}

const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const lastDay = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

// PPFAS names files <CODE>_PPFAS_Monthly_Portfolio_Report_<Month>_<dd>_<yyyy>.xlsx, one per scheme.
const PPFAS: Record<string, string> = {
  PPFCF: "Parag Parikh Flexi Cap Fund",
  PPTSF: "Parag Parikh ELSS Tax Saver Fund",
  PPCHF: "Parag Parikh Conservative Hybrid Fund",
  PPDAAF: "Parag Parikh Dynamic Asset Allocation Fund",
  PPLF: "Parag Parikh Liquid Fund",
  PPAF: "Parag Parikh Arbitrage Fund",
  PPLCF: "Parag Parikh Large Cap Fund",
};

export const AMCS: Amc[] = [
  {
    id: "ppfas",
    name: "PPFAS Mutual Fund",
    page: "https://amc.ppfas.com/downloads/portfolio-disclosure/",
    files: (y, m) =>
      Object.entries(PPFAS).map(([code, name]) => ({
        code,
        name,
        url: `https://amc.ppfas.com/downloads/portfolio-disclosure/${y}/${code}_PPFAS_Monthly_Portfolio_Report_${MONTH[m - 1]}_${lastDay(y, m)}_${y}.xlsx`,
      })),
  },
];
