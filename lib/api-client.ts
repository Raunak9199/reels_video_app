import { IVideo } from "@/models/Video";

type FetchOptions = {
  method?: "GET" | "POST" | "DELETE" | "PUT";
  body?: any;
  headers?: Record<string, string>;
};

export type VideoFormData = Omit<IVideo, "_id">;

class ApiClient {
  private async fetchApi<T>(
    url: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };
    const response = await fetch(`/api${url}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  }

  async getVideos() {
    return this.fetchApi<IVideo[]>("/videos");
  }
  async getSingleVideo(id: string) {
    return this.fetchApi<IVideo>(`/videos/${id}`);
  }
  async createVideo(videoData: VideoFormData) {
    return this.fetchApi<IVideo>("/videos", {
      method: "POST",
      body: videoData,
    });
  }
}

export const apiClient = new ApiClient();
