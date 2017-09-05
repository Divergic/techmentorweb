import { IConfig, Config } from "./config/config";
import { IDataStore, DataStore } from "./dataStore/dataStore";
import Axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import Failure from "./failure";

export interface IHttp {
    get<T>(resourceUri: string): Promise<T>;
    post<T, R>(resourceUri: string, data?: T): Promise<R>;
}

export class Http implements IHttp {
    private client: AxiosInstance;

    public constructor(client?: AxiosInstance, config: IConfig = new Config(), dataStore: IDataStore = new DataStore()) {
        if (client) {
            this.client = client;
        } else {
            let httpConfig = <AxiosRequestConfig>{};

            httpConfig.baseURL = config.apiUri;
            
            this.client = Axios.create(httpConfig);
        }

        this.client.interceptors.request.use(async (config: AxiosRequestConfig) => {
            let token = dataStore.accessToken;

            if (token) {
                config.headers.Authorization = "Bearer " + token;
            }

            return Promise.resolve(config);
        });
        
        this.client.interceptors.response.use(async (response: AxiosResponse) => {
            return Promise.resolve(response);
        }, async (error: any) => {

            let response = error.response;

            if (response.status === 401) {
                // Assumption here is that routing has ensured that the user cannot use a page they are not allowed to
                // So if they are already in a page that is executing a service then this should be a scenario where the
                // user is not authenticated
                const failure = new Failure("Your authentication session has expired.")

                return Promise.reject(failure);
            }

            return Promise.resolve(error);
        });
    }

    public async get<T>(resourceUri: string): Promise<T> {
        try {
            let rawResponse = await this.client.get(resourceUri);
            let response = <AxiosResponse>(rawResponse);

            return this.ProcessResult<T>(response, [200]);
        }
        catch (error) {
            throw this.CreateFailure(error);
        }
    }

    public async post<T, R>(resourceUri: string, data?: T): Promise<R> {
        try {
            let rawResponse = await this.client.post(resourceUri, data);
            let response = <AxiosResponse>(rawResponse);

            return this.ProcessResult<R>(response, [200, 201, 204]);
        }
        catch (error) {
            throw this.CreateFailure(error);
        }
    }

    private ProcessResult<T>(response: AxiosResponse, allowedStatusCodes: Array<number>): T {
        if (!response.status) {
            throw this.CreateFailure(response.data);
        }

        if (allowedStatusCodes.indexOf(response.status) === -1) {
            throw this.CreateFailure(response.data);
        }

        if (response.status === 204) {
            // There is no content in the response
            return <T><any>null;
        }

        if (!response.data) {
            // There is no content in the response
            return <T><any>null;
        }

        return <T>response.data;
    }

    private CreateFailure(error: any): Failure {
        console.error(error);
        
        if (error.response
            && error.response.data
            && error.response.data.message) {
            return new Failure(error.response.data.message);
        }

        throw error;
    }
}