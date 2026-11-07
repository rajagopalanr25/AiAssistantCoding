const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('codearena_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    const error: any = new Error(data.message || 'API request failed');
    error.statusCode = response.status;
    error.code = data.code;
    throw error;
  }

  return data as T;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (payload: { name: string; email: string; password: string; targetRole?: string; yearsOfExperience?: number }) =>
    request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () => request<{ user: any }>('/auth/me'),

  updateProfile: (profile: any) =>
    request<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  // Problems
  getProblems: (params?: { difficulty?: string; topic?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ problems: any[] }>(`/problems${query ? `?${query}` : ''}`);
  },

  getProblem: (idOrSlug: string) =>
    request<{ problem: any }>(`/problems/${idOrSlug}`),

  createCustomProblem: (payload: any) =>
    request<{ message: string; problem: any }>('/problems/custom', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Interviews
  startInterview: (config: {
    problemId: string;
    language: string;
    tokenBudget: number;
    durationMinutes: number;
    assistanceMode: string;
    interviewMode: string;
  }) =>
    request<{ interviewId: string; interview: any }>('/interviews/start', {
      method: 'POST',
      body: JSON.stringify(config),
    }),

  getInterview: (id: string) =>
    request<{ interview: any; tokens: any; problem: any; interactions: any[] }>(`/interviews/${id}`),

  saveDraft: (id: string, payload: { codeDraft?: string; notes?: string; timeElapsedSeconds?: number }) =>
    request<{ message: string }>(`/interviews/${id}/draft`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  getTokenStatus: (id: string) =>
    request<any>(`/interviews/${id}/tokens`),

  runCode: (id: string, payload: { sourceCode: string; language: string }) =>
    request<{ execution: any }>(`/interviews/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitInterview: (id: string, payload: { sourceCode: string; language: string; timeTakenSeconds: number }) =>
    request<{ submissionId: string; evaluationId: string; overallScore: number; verdict: string; execution: any }>(
      `/interviews/${id}/submit`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

  getEvaluation: (id: string) =>
    request<{ evaluation: any; submission: any; interview: any; problem: any }>(`/interviews/${id}/evaluation`),

  getReplay: (id: string) =>
    request<{ interview: any; submission: any; interactions: any[]; evaluation: any }>(`/interviews/${id}/replay`),

  deleteInterview: (id: string) =>
    request<{ message: string }>(`/interviews/${id}`, { method: 'DELETE' }),

  // AI Assistant
  askAI: (payload: {
    interviewId: string;
    message: string;
    type?: string;
    currentCode?: string;
    conversationHistory?: any[];
    hintLevel?: number;
  }) =>
    request<{
      interactionId: string;
      response: string;
      type: string;
      tokens: any;
      isSimulated: boolean;
    }>('/ai/query', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Analytics
  getDashboardStats: () =>
    request<{ metrics: any; charts: any }>('/analytics/dashboard'),

  getHistory: () =>
    request<{ history: any[] }>('/analytics/history'),

  // Resume Prep
  generateResumePrep: (resumeText: string) =>
    request<{ analysis: any }>('/resume/generate', {
      method: 'POST',
      body: JSON.stringify({ resumeText }),
    }),
};

