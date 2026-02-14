import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProcessResult {
    valueReport: ValueBreakdown;
    gradeOutcome: GradeEstimation;
    message: string;
}
export interface GradeEstimation {
    gradeLabel: string;
    normalizedScore: bigint;
    edgeClarityScore: bigint;
}
export interface ValueBreakdown {
    scoreRarityBonus: bigint;
    gradeMultiplier: bigint;
    gradeModDependency: bigint;
    estimatedValue: bigint;
    baselineValue: bigint;
    normalizationAdjustment: bigint;
    gradeBonus: bigint;
    combinedRarityBonus: bigint;
}
export interface backendInterface {
    configureBaseline(denomination: string, baselineValue: bigint): Promise<void>;
    processCoin(metadata: string, sharpness: bigint, contrast: bigint, edgeClarity: bigint): Promise<ProcessResult>;
}
