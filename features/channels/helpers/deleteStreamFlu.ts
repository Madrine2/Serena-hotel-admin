import axios from 'axios';

export async function deleteFlusonicStream(channelId: string): Promise<any> {
    const bearer = btoa("hyde:An0ther12");
    const url = `http://172.40.1.223:1831/streamer/api/v3/streams/${channelId}`;

    try {
        const response = await axios.delete(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${bearer}`,
            },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
            throw new Error(`Failed to delete stream. Axios-specific error: ${error.response?.statusText || error.message}`);
        } else {
            console.error('Non-Axios error:', error);
            throw new Error(`Failed to delete stream: ${String(error)}`);
        }
    }
}
