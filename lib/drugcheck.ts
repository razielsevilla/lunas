// ---------------------------------------------------------------------------
// lib/drugcheck.ts — Drug Interaction Checker
//
// Primary:  DrugBank API (if DRUGBANK_API_KEY is set)
// Fallback: Local hardcoded table of 20 common dangerous pairs
//
// Per architecture.md: fallback is auto-used when API is unavailable —
// no action needed during demo if DrugBank is down.
// ---------------------------------------------------------------------------

export type InteractionSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CONTRAINDICATED';

export interface DrugInteractionResult {
  drug1Name: string;
  drug2Name: string;
  severity: InteractionSeverity;
  description: string;
}

// ---------------------------------------------------------------------------
// LOCAL FALLBACK TABLE — 20 common dangerous drug pairs
// Source: standard clinical pharmacology references
// Used when DRUGBANK_API_KEY is not set or API call fails
// ---------------------------------------------------------------------------

const LOCAL_INTERACTION_TABLE: DrugInteractionResult[] = [
  // ── CONTRAINDICATED ──
  {
    drug1Name: 'Warfarin',
    drug2Name: 'Aspirin',
    severity: 'CONTRAINDICATED',
    description:
      'Concurrent use significantly increases bleeding risk. Both inhibit clotting by different mechanisms.',
  },
  {
    drug1Name: 'MAO Inhibitor',
    drug2Name: 'Serotonin Reuptake Inhibitor',
    severity: 'CONTRAINDICATED',
    description:
      'Risk of life-threatening serotonin syndrome. Concurrent use is absolutely contraindicated.',
  },
  {
    drug1Name: 'Sildenafil',
    drug2Name: 'Nitrate',
    severity: 'CONTRAINDICATED',
    description:
      'Combination causes severe hypotension. Can be fatal in cardiac patients.',
  },
  {
    drug1Name: 'Methotrexate',
    drug2Name: 'Trimethoprim',
    severity: 'CONTRAINDICATED',
    description:
      'Both inhibit folate metabolism. Concurrent use causes severe myelosuppression.',
  },

  // ── HIGH ──
  {
    drug1Name: 'Warfarin',
    drug2Name: 'Ibuprofen',
    severity: 'HIGH',
    description:
      'NSAIDs displace warfarin from protein binding, increasing INR and bleeding risk significantly.',
  },
  {
    drug1Name: 'Digoxin',
    drug2Name: 'Amiodarone',
    severity: 'HIGH',
    description:
      'Amiodarone increases digoxin levels by up to 70%, risking digitalis toxicity and cardiac arrhythmia.',
  },
  {
    drug1Name: 'Lithium',
    drug2Name: 'Ibuprofen',
    severity: 'HIGH',
    description:
      'NSAIDs reduce renal lithium clearance, leading to lithium toxicity (tremor, confusion, arrhythmia).',
  },
  {
    drug1Name: 'Clopidogrel',
    drug2Name: 'Omeprazole',
    severity: 'HIGH',
    description:
      'Omeprazole inhibits CYP2C19, reducing clopidogrel activation and antiplatelet efficacy.',
  },
  {
    drug1Name: 'Simvastatin',
    drug2Name: 'Clarithromycin',
    severity: 'HIGH',
    description:
      'Clarithromycin inhibits CYP3A4, raising simvastatin levels markedly and increasing rhabdomyolysis risk.',
  },
  {
    drug1Name: 'Metformin',
    drug2Name: 'Contrast Dye',
    severity: 'HIGH',
    description:
      'Iodinated contrast can precipitate acute kidney injury in patients on metformin, causing lactic acidosis.',
  },

  // ── MODERATE ──
  {
    drug1Name: 'Salbutamol',
    drug2Name: 'Losartan',
    severity: 'MODERATE',
    description:
      'Beta-2 agonists and ARBs may have antagonistic cardiovascular effects; monitor blood pressure and heart rate.',
  },
  {
    drug1Name: 'Atorvastatin',
    drug2Name: 'Amlodipine',
    severity: 'MODERATE',
    description:
      'Amlodipine moderately raises atorvastatin exposure; monitor for muscle weakness or pain.',
  },
  {
    drug1Name: 'Metoprolol',
    drug2Name: 'Verapamil',
    severity: 'MODERATE',
    description:
      'Both slow AV conduction; concurrent use risks severe bradycardia and heart block.',
  },
  {
    drug1Name: 'Tramadol',
    drug2Name: 'Sertraline',
    severity: 'MODERATE',
    description:
      'Combination increases risk of serotonin syndrome and lowers seizure threshold.',
  },
  {
    drug1Name: 'Ciprofloxacin',
    drug2Name: 'Antacid',
    severity: 'MODERATE',
    description:
      'Antacids containing magnesium or aluminum chelate ciprofloxacin, reducing absorption by up to 90%.',
  },
  {
    drug1Name: 'Furosemide',
    drug2Name: 'Gentamicin',
    severity: 'MODERATE',
    description:
      'Both are ototoxic and nephrotoxic; concurrent use significantly increases risk of hearing loss and renal damage.',
  },
  {
    drug1Name: 'Phenytoin',
    drug2Name: 'Fluconazole',
    severity: 'MODERATE',
    description:
      'Fluconazole inhibits CYP2C9, raising phenytoin levels and risking toxicity (nystagmus, ataxia).',
  },
  {
    drug1Name: 'Amlodipine',
    drug2Name: 'Clarithromycin',
    severity: 'MODERATE',
    description:
      'Clarithromycin inhibits CYP3A4, increasing amlodipine exposure and risk of hypotension.',
  },

  // ── LOW ──
  {
    drug1Name: 'Metformin',
    drug2Name: 'Alcohol',
    severity: 'LOW',
    description:
      'Alcohol potentiates metformin-associated lactic acidosis risk, especially with heavy or binge drinking.',
  },
  {
    drug1Name: 'Calcium',
    drug2Name: 'Iron',
    severity: 'LOW',
    description:
      'Calcium supplements reduce iron absorption when taken simultaneously. Separate doses by at least 2 hours.',
  },
];

// ---------------------------------------------------------------------------
// Normalise a drug name for matching (lowercase, strip dosage info)
// e.g. "Salbutamol 100mcg" → "salbutamol"
// ---------------------------------------------------------------------------

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\d+(\.\d+)?\s*(mg|mcg|g|ml|iu|%|units?)/gi, '')
    .replace(/\b(tablet|capsule|syrup|injection|inhaler|patch|drop|solution)\b/gi, '')
    .trim();
}

// ---------------------------------------------------------------------------
// checkInteractionsLocal
//
// Given a list of drug names, returns all interaction pairs found in the
// local fallback table. Runs in O(n²) — fine for a typical medication list.
// ---------------------------------------------------------------------------

export function checkInteractionsLocal(
  drugNames: string[]
): DrugInteractionResult[] {
  const results: DrugInteractionResult[] = [];
  const normalized = drugNames.map(normalizeName);

  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const a = normalized[i];
      const b = normalized[j];

      for (const entry of LOCAL_INTERACTION_TABLE) {
        const e1 = normalizeName(entry.drug1Name);
        const e2 = normalizeName(entry.drug2Name);

        const matches =
          (a.includes(e1) || e1.includes(a)) &&
          (b.includes(e2) || e2.includes(b));
        const matchesReversed =
          (a.includes(e2) || e2.includes(a)) &&
          (b.includes(e1) || e1.includes(b));

        if (matches || matchesReversed) {
          results.push({
            drug1Name: drugNames[i],
            drug2Name: drugNames[j],
            severity: entry.severity,
            description: entry.description,
          });
          break; // Only record the first matching rule per pair
        }
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// checkInteractionsDrugBank (primary — DrugBank API)
// ---------------------------------------------------------------------------

/**
 * Queries the DrugBank API for drug-drug interactions between the given list.
 * Falls back to the local table if the API is unavailable or key not set.
 */
export async function checkInteractions(
  drugNames: string[]
): Promise<DrugInteractionResult[]> {
  if (drugNames.length < 2) return [];

  const apiKey = process.env.DRUGBANK_API_KEY;

  if (!apiKey) {
    console.info('[drugcheck] DRUGBANK_API_KEY not set — using local fallback table.');
    return checkInteractionsLocal(drugNames);
  }

  try {
    // DrugBank DDI API endpoint
    const url = 'https://api.drugbank.com/v1/ddi';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ drug_names: drugNames }),
      signal: AbortSignal.timeout(5000), // 5-second timeout
    });

    if (!response.ok) {
      console.warn(
        '[drugcheck] DrugBank API returned %s — using local fallback.',
        response.status
      );
      return checkInteractionsLocal(drugNames);
    }

    const data = await response.json();

    // Map DrugBank response to our internal type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.interactions ?? []).map((item: any) => ({
      drug1Name: item.drug1_name ?? item.drug1 ?? drugNames[0],
      drug2Name: item.drug2_name ?? item.drug2 ?? drugNames[1],
      severity: mapDrugBankSeverity(item.severity),
      description: item.description ?? 'Potential drug interaction detected.',
    }));
  } catch (err) {
    console.error('[drugcheck] DrugBank API call failed — using local fallback:', err);
    return checkInteractionsLocal(drugNames);
  }
}

// ---------------------------------------------------------------------------
// Severity mapping from DrugBank schema to our enum
// ---------------------------------------------------------------------------

function mapDrugBankSeverity(raw: string): InteractionSeverity {
  const s = (raw ?? '').toLowerCase();
  if (s === 'contraindicated' || s === 'major') return 'CONTRAINDICATED';
  if (s === 'high' || s === 'severe') return 'HIGH';
  if (s === 'moderate' || s === 'medium') return 'MODERATE';
  return 'LOW';
}
