import { MagicWordsResponse } from "./types";

export class ApiService {
    private static _instance: ApiService;
    private readonly _baseUrl: string = 'https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords';

    private constructor() { }

    public static get instance(): ApiService {
        if (!ApiService._instance) {
            ApiService._instance = new ApiService();
        }
        return ApiService._instance;
    }

    /**
     * Fetches magic words from the API
    * @returns {Promise<MagicWordsResponse>} A promise that resolves to the magic words response
     */
    public async getMagicWords(): Promise<MagicWordsResponse> {
        try {
            const response = await fetch(this._baseUrl);

            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }

            const data: MagicWordsResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching magic words:', error);
            throw error;
        }
    }
}