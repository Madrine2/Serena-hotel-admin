import axios from "axios";

export async function addStream(name: string, input: string): Promise<any> {
  const bearer = btoa("hyde:An0ther12");
  const url = `http://172.40.1.223:1831/streamer/api/v3/streams/${name}`;
  try {
    const response = await axios.put(
      url,
      JSON.stringify({
        name: name,
        inputs: [
          {
            url: input,
          },
        ],
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${bearer}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        `Failed to add stream. Please Handle Axios-specific errors: ${error.response?.statusText || error.message}`,
      );
    } else {
      // Handle non-Axios errors
      console.error("Non-Axios error:", error);
      throw new Error(`Failed to add stream: ${String(error)}`);
    }
  }
}
