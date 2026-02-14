export interface CoinMetadata {
  country: string;
  denomination: string;
  year: string;
  mintMark: string;
  notes: string;
}

export interface AnalysisResultData {
  gradeOutcome: {
    gradeLabel: string;
    normalizedScore: bigint;
    edgeClarityScore: bigint;
  };
  valueReport: {
    baselineValue: bigint;
    gradeMultiplier: bigint;
    gradeModDependency: bigint;
    scoreRarityBonus: bigint;
    combinedRarityBonus: bigint;
    normalizationAdjustment: bigint;
    gradeBonus: bigint;
    estimatedValue: bigint;
  };
}
