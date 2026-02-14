import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";



actor {
  type CoinType = {
    year : Nat;
    mint : Text;
    denomination : Text;
    metadata : Text;
  };

  type ConditionMetrics = {
    sharpness : Nat;
    contrast : Nat;
    edgeClarity : Nat;
  };

  type GradeEstimation = {
    gradeLabel : Text;
    normalizedScore : Nat;
    edgeClarityScore : Nat;
  };

  type ValueBreakdown = {
    baselineValue : Nat;
    gradeMultiplier : Nat;
    gradeModDependency : Nat;
    scoreRarityBonus : Nat;
    combinedRarityBonus : Nat;
    normalizationAdjustment : Nat;
    gradeBonus : Nat;
    estimatedValue : Nat;
  };

  type ProcessResult = {
    gradeOutcome : GradeEstimation;
    valueReport : ValueBreakdown;
    message : Text;
  };

  let baselineValues = Map.empty<Text, Nat>();

  public shared ({ caller }) func configureBaseline(denomination : Text, baselineValue : Nat) : async () {
    baselineValues.add(denomination, baselineValue);
  };

  public query ({ caller }) func processCoin(metadata : Text, sharpness : Nat, contrast : Nat, edgeClarity : Nat) : async ProcessResult {
    let coinType : CoinType = {
      year = 1909;
      mint = "S";
      denomination = "Indian Head Penny";
      metadata;
    };

    let gradeEstimation : GradeEstimation = {
      gradeLabel = "VF20 - Very Fine";
      normalizedScore = sharpness + contrast;
      edgeClarityScore = edgeClarity;
    };

    let defaultBaselineValues : Map.Map<Text, Nat> = Map.fromIter<Text, Nat>(
      [
        ("Indian Head Penny", 10000),
        ("Liberty Nickel", 8000),
        ("Morgan Dollar", 25000),
        ("Buffalo Nickel", 12000),
        ("Steel Wheat Penny", 5000),
      ].values()
    );

    let actualBaseline = switch (baselineValues.get(coinType.denomination)) {
      case (?value) { ?value };
      case (null) { defaultBaselineValues.get(coinType.denomination) };
    };

    let message = concatMessage(actualBaseline, coinType.denomination);

    let valueBreakdown : ?ValueBreakdown = switch (actualBaseline) {
      case (null) { null };
      case (?baselineValue) {
        ?{
          baselineValue;
          gradeMultiplier = 3;
          gradeModDependency = 2;
          scoreRarityBonus = 1;
          combinedRarityBonus = 2;
          normalizationAdjustment = 1;
          gradeBonus = 4;
          estimatedValue = baselineValue * 3;
        };
      };
    };

    {
      gradeOutcome = gradeEstimation;
      valueReport = switch (valueBreakdown) {
        case (?breakdown) { breakdown };
        case (null) {
          {
            baselineValue = 0;
            gradeMultiplier = 0;
            gradeModDependency = 0;
            scoreRarityBonus = 0;
            combinedRarityBonus = 0;
            normalizationAdjustment = 0;
            gradeBonus = 0;
            estimatedValue = 0;
          };
        };
      };
      message;
    };
  };

  func concatMessage(actualBaseline : ?Nat, denomination : Text) : Text {
    switch (actualBaseline) {
      case (null) {
        "No specific baseline found for " # denomination # ". Using default values with detailed outcome values.";
      };
      case (?_) {
        "Baseline found, returning analysis result including outcome values.";
      };
    };
  };
};
