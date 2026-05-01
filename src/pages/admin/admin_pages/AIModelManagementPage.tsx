import { useEffect, useState } from "react";
import healthRisksImg from "/medirator_images/healthrisks.png";
import { adminApi } from "../../../api/adminApi";
import { useLanguage } from "../../../context/LanguageContext";

interface AIModelManagementPageProps {
  darkMode?: boolean;
}

interface ModelRecord {
  id: string;
  name: string;
  version: string;
  status: "Active" | "Inactive";
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  specificity: number;
  auc: number;
  latencyMs: number;
  performance: string;
  lastTrained: string;
  logs: string[];
}

const AIModelManagementPage = ({ darkMode = false }: AIModelManagementPageProps) => {
  const { t } = useLanguage();
  const [apiError, setApiError] = useState<string | null>(null);
  const [models, setModels] = useState<ModelRecord[]>([
    {
      id: "MDL-1",
      name: "Risk Predictor",
      version: "v3.4",
      status: "Active",
      accuracy: 93.4,
      precision: 92.8,
      recall: 91.9,
      f1Score: 92.3,
      specificity: 94.1,
      auc: 96.2,
      latencyMs: 82,
      performance: "stable",
      lastTrained: "2026-04-10",
      logs: ["Inference latency stable", "No drift detected"],
    },
    {
      id: "MDL-2",
      name: "Prescription Assistant",
      version: "v2.8",
      status: "Inactive",
      accuracy: 89.7,
      precision: 88.4,
      recall: 87.9,
      f1Score: 88.1,
      specificity: 90.6,
      auc: 92.3,
      latencyMs: 96,
      performance: "improving",
      lastTrained: "2026-03-28",
      logs: ["Retraining completed", "Validation run passed"],
    },
    {
      id: "MDL-3",
      name: "Diagnostic Support",
      version: "v1.9",
      status: "Inactive",
      accuracy: 87.9,
      precision: 86.8,
      recall: 85.7,
      f1Score: 86.2,
      specificity: 89.4,
      auc: 90.8,
      latencyMs: 104,
      performance: "reviewRequired",
      lastTrained: "2026-02-19",
      logs: ["Accuracy drop in respiratory cohort", "Review threshold raised"],
    },
  ]);
  const activeModels = models.filter((model) => model.status === "Active").length;
  const averageAccuracy = (models.reduce((sum, model) => sum + model.accuracy, 0) / models.length).toFixed(1);
  const averagePrecision = (models.reduce((sum, model) => sum + model.precision, 0) / models.length).toFixed(1);
  const averageRecall = (models.reduce((sum, model) => sum + model.recall, 0) / models.length).toFixed(1);
  const averageF1Score = (models.reduce((sum, model) => sum + model.f1Score, 0) / models.length).toFixed(1);
  const averageAuc = (models.reduce((sum, model) => sum + model.auc, 0) / models.length).toFixed(1);
  const averageLatency = Math.round(models.reduce((sum, model) => sum + model.latencyMs, 0) / models.length);
  const bestModel =
    models.slice().sort((left, right) => right.accuracy - left.accuracy)[0] ?? { name: "N/A", version: "", accuracy: 0 };

  const toggleStatus = (modelId: string) => {
    setModels((current) =>
      current.map((model) =>
        model.id === modelId
          ? {
              ...model,
              status: model.status === "Active" ? "Inactive" : "Active",
            }
          : model,
      ),
    );

    const selected = models.find((model) => model.id === modelId);
    if (!selected) {
      return;
    }

    void adminApi
      .setAiModelStatus(modelId, selected.status === "Active" ? "Inactive" : "Active")
      .then(() => setApiError(null))
      .catch(() => setApiError(t("admin", "modelStatusUpdateFailed", "Model status update not confirmed by server.")));
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await adminApi.listAiModels();
        if (response.length > 0) {
          setModels(response);
        }
        setApiError(null);
      } catch {
        setApiError(t("admin", "noAvailableData", "No available data."));
      }
    };

    void loadModels();
  }, [t]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">
            {t("admin", "aiModelManagementTitle", "AI Model Management")}
          </h2>
        </div>
        <img src={healthRisksImg} alt={t("admin", "aiModelManagementTitle", "AI Model Management")} className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans text-black dark:text-white">
        {apiError && (
          <div className="rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
            {apiError}
          </div>
        )}

        <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">{t("admin", "modelMetrics", "Model Metrics")}</h3>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-[#0B3C5D] p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">{t("admin", "totalModels", "Total Models")}</div>
              <div className="mt-2 text-2xl font-bold text-[#0B3C5D] dark:text-white">{models.length}</div>
            </div>
            <div className="rounded-2xl border border-[#0B3C5D] p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">{t("admin", "activeModels", "Active Models")}</div>
              <div className="mt-2 text-2xl font-bold text-[#0B3C5D] dark:text-white">{activeModels}</div>
            </div>
            <div className="rounded-2xl border border-[#0B3C5D] p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">{t("admin", "averageAccuracy", "Average Accuracy")}</div>
              <div className="mt-2 text-2xl font-bold text-[#0B3C5D] dark:text-white">{averageAccuracy}%</div>
            </div>
            <div className="rounded-2xl border border-[#0B3C5D] p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">{t("admin", "averagePrecision", "Average Precision")}</div>
              <div className="mt-2 text-2xl font-bold text-[#0B3C5D] dark:text-white">{averagePrecision}%</div>
            </div>
            <div className="rounded-2xl border border-[#0B3C5D] p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">{t("admin", "averageRecall", "Average Recall")}</div>
              <div className="mt-2 text-2xl font-bold text-[#0B3C5D] dark:text-white">{averageRecall}%</div>
            </div>
            <div className="rounded-2xl border border-[#0B3C5D] p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">{t("admin", "averageF1Score", "Average F1-Score")}</div>
              <div className="mt-2 text-2xl font-bold text-[#0B3C5D] dark:text-white">{averageF1Score}%</div>
            </div>
            <div className="rounded-2xl border border-[#0B3C5D] p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">{t("admin", "averageAuc", "Average AUC")}</div>
              <div className="mt-2 text-2xl font-bold text-[#0B3C5D] dark:text-white">{averageAuc}%</div>
            </div>
            <div className="rounded-2xl border border-[#0B3C5D] p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">{t("admin", "averageLatency", "Avg Inference Latency")}</div>
              <div className="mt-2 text-2xl font-bold text-[#0B3C5D] dark:text-white">{averageLatency} ms</div>
            </div>
            <div className="rounded-2xl border border-[#0B3C5D] p-4 sm:col-span-2 xl:col-span-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">{t("admin", "bestModel", "Best Performing Model")}</div>
              <div className="mt-2 text-base font-semibold text-[#0B3C5D] dark:text-white">
                {bestModel.name} {bestModel.version} ({bestModel.accuracy}%)
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">{t("admin", "modelRegistry", "Model Registry")}</h3>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#0B3C5D]">
            <table className="w-full min-w-[1320px] text-sm">
              <thead className="bg-[#0B3C5D] text-white">
                <tr>
                  <th className="text-left px-4 py-3">{t("admin", "name", "Name")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "version", "Version")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "status", "Status")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "accuracy", "Accuracy")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "precision", "Precision")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "recall", "Recall")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "f1Score", "F1-Score")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "specificity", "Specificity")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "auc", "AUC")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "latency", "Latency")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "performance", "Performance")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "lastTrained", "Last Trained")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "action", "Action")}</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.id} className="border-t border-[#0B3C5D]/40">
                    <td className="px-4 py-3">{model.name}</td>
                    <td className="px-4 py-3">{model.version}</td>
                    <td className="px-4 py-3">
                      {model.status === "Active"
                        ? t("admin", "activeStatus", "Active")
                        : t("admin", "inactiveStatus", "Inactive")}
                    </td>
                    <td className="px-4 py-3">{model.accuracy}%</td>
                    <td className="px-4 py-3">{model.precision}%</td>
                    <td className="px-4 py-3">{model.recall}%</td>
                    <td className="px-4 py-3">{model.f1Score}%</td>
                    <td className="px-4 py-3">{model.specificity}%</td>
                    <td className="px-4 py-3">{model.auc}%</td>
                    <td className="px-4 py-3">{model.latencyMs} ms</td>
                    <td className="px-4 py-3">
                      {t("admin", model.performance, model.performance === "stable" ? "Stable" : model.performance === "improving" ? "Improving" : "Review Required")}
                    </td>
                    <td className="px-4 py-3">{model.lastTrained}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleStatus(model.id)}
                        className="rounded-2xl border border-[#0B3C5D] px-3 py-1.5"
                      >
                        {model.status === "Active"
                          ? t("admin", "deactivate", "Deactivate")
                          : t("admin", "activate", "Activate")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4">
          <div className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">Model Logs</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {models.flatMap((model) => model.logs.map((log) => ({ model: model.name, log }))).map((entry) => (
                <li key={`${entry.model}-${entry.log}`} className="rounded-2xl border border-[#0B3C5D] p-3">
                  <span className="font-semibold">{entry.model}:</span> {entry.log}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIModelManagementPage;
