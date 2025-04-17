import axios, { AxiosResponse } from 'axios';
import services from '../utilities/services';
import { getHeaderResponse } from './header';

let headers = getHeaderResponse()

// Define the API methods interface
interface ApiMethods<T> {
    method: string;
    url: string;
    postObj?: T | {};
}

// Define the response type
interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    error: string | null;
}

// Common function to make API requests based on the ApiMethods interface
export const ApiRequestMethod = async <T>(
    { method, url, postObj }: ApiMethods<T>
): Promise<ApiResponse<T>> => {
    try {
        let response: any

        switch (method.toUpperCase()) {
            case 'GET':
                response = await services.get(url, headers);
                break;
            case 'POST':
                response = await services.create(url, postObj, headers);
                break;
            case 'PUT':
                response = await services.put(url, postObj, headers);
                break;
            case 'DELETE':
                response = await services.remove(url, headers);
                break;
            default:
                throw new Error('Unsupported HTTP method');
        }

        return {
            success: true,
            data: response,
            error: response,
        };
    } catch (error: any) {
        return {
            success: false,
            data: { ...error.data },
            error: error,
        };
    }
};
