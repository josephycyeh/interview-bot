import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

interface ExecuteCodeParams {
  script: string;
  language: string;
  versionIndex?: string;
}

interface ExecuteCodeResponse {
  output: string;
}

export const executeCode = async (params: ExecuteCodeParams): Promise<ExecuteCodeResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/execute`, params);
    return { output: response.data.output };
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to execute code');
  }
}; 