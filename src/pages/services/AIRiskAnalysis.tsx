import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usersApi } from "../../api/usersApi";
import "./AIRiskAnalysis.css";

interface FamilyMemberEntry {
  relation: string;
  age: number;
  disease: string;
}

interface RiskAnalysisResponse {
  id: string;
  patient_id: string;
  created_at: string;
  family_history_analysis: {
    genetic_risk_percentage: number;
    risk_level: "Low" | "Medium" | "High";
    explanation: string;
  };
  symptom_analysis: {
    predicted_disease: string;
    confidence: number;
    explanation: string;
  };
  overall_risk_score: number;
  genetic_contribution: number;
  symptom_contribution: number;
  most_likely_disease: string;
  final_interpretation: string;
}

interface DiseaseListResponse {
  diseases: string[];
}

interface AIRiskAnalysisProps {
  darkMode?: boolean;
}

interface FamilyMemberRecord {
  id: string;
  relationship: string;
  name: string;
  age: string;
  disease: string;
  displayName: string;
}

const normalizeRelation = (relation: string): string => {
  const normalized = relation.toLowerCase().trim();
  
  // Handle grandfather variations
  if (normalized.includes("grandfather")) {
    if (normalized.includes("father") || normalized.includes("paternal")) return "paternal_grandfather";
    if (normalized.includes("mother") || normalized.includes("maternal")) return "maternal_grandfather";
  }
  
  // Handle grandmother variations
  if (normalized.includes("grandmother")) {
    if (normalized.includes("father") || normalized.includes("paternal")) return "paternal_grandmother";
    if (normalized.includes("mother") || normalized.includes("maternal")) return "maternal_grandmother";
  }
  
  // Direct mappings
  if (normalized.includes("father") && !normalized.includes("grandfather")) return "father";
  if (normalized.includes("mother") && !normalized.includes("grandmother")) return "mother";
  
  return normalized.replace(/\s+/g, "_");
};

const AIRiskAnalysis: React.FC<AIRiskAnalysisProps> = ({ darkMode = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientFromQuery = searchParams.get("patient")?.trim() ?? "";
  const isDoctorView = Boolean(patientFromQuery);
  const patientId = isDoctorView ? patientFromQuery : user?.id;

  const [diseases, setDiseases] = useState<string[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberRecord[]>([]);
  const [symptomDescription, setSymptomDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RiskAnalysisResponse | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [familyHistoryComplete, setFamilyHistoryComplete] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Load diseases list on mount
  useEffect(() => {
    const loadDiseases = async () => {
      try {
        const response = await fetch("/api/v1/risk-analysis/diseases");
        if (response.ok) {
          const data: DiseaseListResponse = await response.json();
          setDiseases(data.diseases);
        }
      } catch (err) {
        console.error("Failed to load diseases list:", err);
      }
    };

    loadDiseases();
  }, []);

  // Validate if family history is complete
  const isFamilyHistoryComplete = (): boolean => {
    const requiredRelations = [
      "father",
      "mother",
      "paternal_grandfather",
      "paternal_grandmother",
      "maternal_grandfather",
      "maternal_grandmother",
    ];

    const providedRelations = familyMembers.map((m) => normalizeRelation(m.relationship));
    
    // Check if all required relations are present
    const allPresent = requiredRelations.every((relation) => 
      providedRelations.includes(relation)
    );

    if (!allPresent) {
      return false;
    }

    // Check if each required member has complete fields
    for (const member of familyMembers) {
      const normalized = normalizeRelation(member.relationship);
      if (requiredRelations.includes(normalized)) {
        if (!member.relationship || !member.age || !member.disease) {
          return false;
        }
      }
    }

    return true;
  };

  // Load patient data (family history + symptoms) on mount
  useEffect(() => {
    const loadPatientData = async () => {
      setDataLoading(true);
      try {
        if (!patientId) {
          setDataLoading(false);
          return;
        }

        const response = await usersApi.getProfile(patientId);
        if (response) {
          // Load family history
          if (response.family_history) {
            const parsed = Array.isArray(response.family_history)
              ? response.family_history
              : typeof response.family_history === "string"
              ? JSON.parse(response.family_history)
              : response.family_history;

            if (Array.isArray(parsed)) {
              const members = parsed.map((m: any, idx: number) => ({
                id: m.id ?? `${Date.now()}-${idx}`,
                relationship: m.relationship ?? m.relation ?? "",
                name: m.name ?? "",
                age: String(m.age ?? ""),
                disease: m.disease ?? "",
                displayName: m.displayName ?? m.name ?? m.relationship ?? m.relation ?? "Family Member",
              }));
              setFamilyMembers(members);
            }
          }

          // Load symptom description if available
          if (response.medical_history?.symptoms) {
            setSymptomDescription(response.medical_history.symptoms);
          } else if (response.symptoms) {
            setSymptomDescription(response.symptoms);
          }
        }
      } catch (err) {
        console.error("Failed to load patient data:", err);
      } finally {
        setDataLoading(false);
      }
    };

    loadPatientData();
  }, [patientId]);

  // Update family history completion status whenever members change
  useEffect(() => {
    setFamilyHistoryComplete(isFamilyHistoryComplete());
  }, [familyMembers]);

  const handleAnalyze = async () => {
    setError(null);

    // Check if family history is complete
    if (!familyHistoryComplete) {
      setError("Family history is incomplete. Please complete all required family members before running AI Risk Analysis.");
      return;
    }

    setIsLoading(true);

    try {
      if (!patientId) {
        setError("Patient ID not found");
        return;
      }

      // Convert family members to API format (only required members)
      const requiredRelations = [
        "father",
        "mother",
        "paternal_grandfather",
        "paternal_grandmother",
        "maternal_grandfather",
        "maternal_grandmother",
      ];

      const familyMembersForAPI: FamilyMemberEntry[] = familyMembers
        .filter((m) => requiredRelations.includes(normalizeRelation(m.relationship)))
        .map((m) => ({
          relation: normalizeRelation(m.relationship),
          age: parseInt(m.age) || 0,
          disease: m.disease,
        }));

      const response = await fetch("/api/v1/risk-analysis/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          family_members: familyMembersForAPI,
          symptom_description: symptomDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Analysis failed: ${response.statusText}`);
      }

      const analysisResult: RiskAnalysisResponse = await response.json();
      setResult(analysisResult);
      setShowResults(true);
      setShowForm(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Analysis failed. Please try again.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case "low":
        return "#4caf50";
      case "medium":
        return "#ff9800";
      case "high":
        return "#f44336";
      default:
        return "#9c27b0";
    }
  };

  const handleBackToForm = () => {
    setShowForm(true);
    setShowResults(false);
  };

  return (
    <div className={`ai-risk-analysis ${darkMode ? "dark" : "light"}`}>
      <div className="container">
        <h1>AI Risk Analysis</h1>

        {error && <div className="error-banner">{error}</div>}

        {dataLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your health data...</p>
          </div>
        ) : showForm ? (
          <div className="form-section">
            {/* Family History Status Section */}
            <div className="form-group">
              <h2>📋 Family History Status</h2>
              <div className={`status-card ${familyHistoryComplete ? "complete" : "incomplete"}`}>
                <div className="status-icon">{familyHistoryComplete ? "✓" : "⚠"}</div>
                <div className="status-content">
                  <p className="status-title">
                    {familyHistoryComplete ? "Family History Complete" : "Family History Incomplete"}
                  </p>
                  <p className="status-description">
                    {familyHistoryComplete
                      ? "All required family members are present. You can proceed with AI Risk Analysis."
                      : "Please complete all required family members in the Family History section before proceeding."}
                  </p>
                </div>
              </div>

              {familyMembers.length > 0 && (
                <div className="family-preview">
                  <h3>Current Family Members ({familyMembers.length}):</h3>
                  <div className="members-grid">
                    {familyMembers.map((member) => (
                      <div key={member.id} className="member-card">
                        <div className="member-relation">{member.relationship}</div>
                        <div className="member-info">
                          <p>Age: <strong>{member.age}</strong></p>
                          <p>Disease: <strong>{member.disease}</strong></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {familyMembers.length === 0 && (
                <div className="empty-state">
                  <p>No family history found. Please go to the Family History section and add your family members.</p>
                </div>
              )}
            </div>

            {/* Symptom Input Section */}
            <div className="form-group">
              <h2>🏥 Symptom Description</h2>
              <p className="info-text">
                Describe your current symptoms in your own words (optional). Examples: "fever, chest pain, fatigue"
              </p>
              <textarea
                value={symptomDescription}
                onChange={(e) => setSymptomDescription(e.target.value)}
                placeholder="I am feeling... (describe your symptoms here)"
                className="symptom-input"
                rows={4}
                disabled={isLoading}
              />
              {symptomDescription && (
                <div className="symptom-preview">
                  <strong>Current input:</strong> {symptomDescription}
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="button-group">
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !familyHistoryComplete}
                className={`btn-primary ${!familyHistoryComplete ? "disabled" : ""}`}
                title={!familyHistoryComplete ? "Please complete family history first" : "Run analysis"}
              >
                {isLoading ? "Analyzing..." : "Run AI Risk Analysis"}
              </button>
            </div>
          </div>
        ) : showResults && result ? (
          <div className="results-section">
            <button onClick={handleBackToForm} className="btn-back">
              ← Back
            </button>

            <div className="results-container">
              <h2>Your AI Risk Analysis Report</h2>

              {/* Section 1: Family History Risk Analysis */}
              <div className="result-card family-analysis">
                <div className="section-number">1</div>
                <h3>Family History Risk Analysis</h3>
                <div className="section-content">
                  <div className="risk-level-badge" style={{ backgroundColor: getRiskLevelColor(result.family_history_analysis.risk_level) }}>
                    {result.family_history_analysis.risk_level} Risk
                  </div>
                  <div className="risk-metric">
                    <label>Genetic Risk:</label>
                    <div className="risk-bar">
                      <div 
                        className="risk-fill"
                        style={{
                          width: `${result.family_history_analysis.genetic_risk_percentage}%`,
                          backgroundColor: getRiskLevelColor(result.family_history_analysis.risk_level)
                        }}
                      ></div>
                    </div>
                    <span className="risk-value">{result.family_history_analysis.genetic_risk_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="explanation">
                    <strong>Inheritance Pattern:</strong>
                    <p>{result.family_history_analysis.explanation}</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Symptom Risk Analysis */}
              <div className="result-card symptom-analysis">
                <div className="section-number">2</div>
                <h3>Symptom-Based Risk Analysis</h3>
                <div className="section-content">
                  <div className="disease-prediction">
                    <label>Predicted Condition:</label>
                    <div className="predicted-disease">{result.symptom_analysis.predicted_disease}</div>
                  </div>
                  <div className="confidence-metric">
                    <label>Confidence Score:</label>
                    <div className="risk-bar">
                      <div 
                        className="risk-fill"
                        style={{
                          width: `${result.symptom_analysis.confidence}%`,
                          backgroundColor: getRiskLevelColor(
                            result.symptom_analysis.confidence < 33.33 ? "Low" : 
                            result.symptom_analysis.confidence < 66.66 ? "Medium" : "High"
                          )
                        }}
                      ></div>
                    </div>
                    <span className="risk-value">{result.symptom_analysis.confidence.toFixed(1)}%</span>
                  </div>
                  <div className="explanation">
                    <strong>Symptom-Based Reasoning:</strong>
                    <p>{result.symptom_analysis.explanation}</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Combined Final Report */}
              <div className="result-card final-report">
                <div className="section-number">3</div>
                <h3>Final AI Combined Report</h3>
                <div className="section-content">
                  <div className="overall-score-display">
                    <div className="score-circle" style={{ backgroundColor: getRiskLevelColor(
                      result.overall_risk_score < 33.33 ? "Low" : 
                      result.overall_risk_score < 66.66 ? "Medium" : "High"
                    ) }}>
                      <span className="score-value">{result.overall_risk_score.toFixed(1)}%</span>
                      <span className="score-label">Overall Risk</span>
                    </div>
                  </div>

                  <div className="report-metrics">
                    <div className="metric">
                      <label>Most Likely Disease:</label>
                      <div className="metric-value disease-highlight">{result.most_likely_disease}</div>
                    </div>
                    <div className="metric-row">
                      <div className="metric">
                        <label>Genetic Contribution:</label>
                        <div className="metric-value">{result.genetic_contribution.toFixed(1)}%</div>
                      </div>
                      <div className="metric">
                        <label>Symptom Contribution:</label>
                        <div className="metric-value">{result.symptom_contribution.toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="final-interpretation">
                    <strong>Medical Interpretation:</strong>
                    <p className="interpretation-text">
                      {result.final_interpretation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="results-footer">
                <div className="disclaimer">
                  <strong>⚠️ Important Disclaimer:</strong>
                  <p>
                    This AI analysis is for informational purposes only and should not be considered a medical diagnosis. 
                    Always consult with a qualified healthcare professional for accurate diagnosis and treatment recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AIRiskAnalysis;
