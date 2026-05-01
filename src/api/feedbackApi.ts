import { http } from "./http";

export type FeedbackRole = "patient" | "doctor";

export interface FeedbackPublic {
  id: string;
  user_id: string;
  user_name: string;
  role: FeedbackRole;
  target_type: "doctor" | "patient" | "appointment" | "report" | "app";
  target_id?: string | null;
  score: number;
  comment: string;
  created_at: string;
}

export interface FeedbackCreatePayload {
  target_type: "doctor" | "patient" | "appointment" | "report" | "app";
  target_id?: string | null;
  score: number;
  comment: string;
}

export interface FeedbackUpdatePayload {
  score: number;
  comment: string;
}

export const feedbackApi = {
  async list(role: FeedbackRole): Promise<FeedbackPublic[]> {
    const { data } = await http.get<FeedbackPublic[]>("/feedback", {
      params: { role },
    });
    return data;
  },

  async create(payload: FeedbackCreatePayload): Promise<FeedbackPublic> {
    const { data } = await http.post<FeedbackPublic>("/feedback", payload);
    return data;
  },

  async update(feedbackId: string, payload: FeedbackUpdatePayload): Promise<FeedbackPublic> {
    const { data } = await http.patch<FeedbackPublic>(`/feedback/${feedbackId}`, payload);
    return data;
  },
};
