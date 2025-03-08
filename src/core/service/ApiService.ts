import { MagicWordsResponse } from "./types";

export class ApiService {
    private static _instance: ApiService;
    
    private constructor() {}
    
    public static get instance(): ApiService {
        if (!ApiService._instance) {
            ApiService._instance = new ApiService();
        }
        return ApiService._instance;
    }
    
    /**
     * Fetches magic words from the API
     * @returns Promise with magic words data
     */
    public async getMagicWords(): Promise<MagicWordsResponse> {
        try {
            const response = await fetch('https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords');
            
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