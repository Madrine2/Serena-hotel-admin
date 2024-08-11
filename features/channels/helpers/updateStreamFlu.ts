import axios from "axios";

export async function updateFlusonicStream(
  channelId: string,
  newInput: string,
): Promise<any> {
  const bearer = btoa("hyde:An0ther12");
  const url = `http://172.40.1.223:1831/streamer/api/v3/streams/${channelId}`;

  try {
    const response = await axios.put(
      url,
      JSON.stringify({
        inputs: [
          {
            url: newInput,
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
        `Failed to update stream. Axios-specific error: ${error.response?.statusText || error.message}`,
      );
    } else {
      // Handle non-Axios errors
      console.error("Non-Axios error:", error);
      throw new Error(`Failed to update stream: ${String(error)}`);
    }
  }
}
