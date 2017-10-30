import { IConfig, Config } from "./config/config";
import { IDataStore, DataStore } from "./dataStore/dataStore";
import { ILocation, Location } from "./location";
import { IUserService, UserService } from "./authentication/userService";
import Axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import Failure from "./failure";

export interface IHttp {
    get<T>(resourceUri: string): Promise<T>;
    post<T, R>(resourceUri: string, data?: T): Promise<R>;
    put<T, R>(resourceUri: string, data?: T): Promise<R>;
}

export class Http implements IHttp {
    private client: AxiosInstance;

    public constructor(client?: AxiosInstance, config: IConfig = new Config(), dataStore: IDataStore = new DataStore(), location: ILocation = new Location(), userService: IUserService = new UserService()) {
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

            if (response.status !== 401) {
                return Promise.resolve(error);
            }

            if (userService.IsAuthenticated === false) {
                // The user is not authenticated and has been able to issue a request to a secure resource

                // TODO: This really should redirect to the unauthorized page
                return Promise.resolve(error);
            }

            if (userService.SessionExpired === false) {
                // The user is authenticated has still has a valid session
                // They have invoked something they are not allowed to hit
                
                // TODO: This really should redirect to the unauthorized page
                return Promise.resolve(error);
            }

            const failure = new Failure("Your authentication session has expired.");

            // We will redirect the user to authenticate again because their session has expired
            let returnUri = location.getHref();
            let signInUri = location.getSignInUri(returnUri);

            // Redirect to the sign in page with a return back to the current page
            location.setHref(signInUri);
            
            return Promise.reject(failure);
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

    public async put<T, R>(resourceUri: string, data?: T): Promise<R> {
        try {
            let rawResponse = await this.client.put(resourceUri, data);
            let response = <AxiosResponse>(rawResponse);

            return this.ProcessResult<R>(response, [200, 204]);
        }
        catch (error) {
            throw this.CreateFailure(error);
        }
    }

    private ProcessResult<T>(response: AxiosResponse, allowedStatusCodes: Array<number>): T {
        // In failure scenarios, the first parameter is actually an error with response as a property
        // This needs to be mapped correctly so that the rest of the method can execute correctly
        if ((<any>response).response) {
            response = <AxiosResponse>(<any>response).response;
        }

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
        
        if (typeof error === "string") {
            return new Failure(error);
        }
        
        if (error.response && error.response.data) {
            if (typeof error.response.data === "string") {
                return new Failure(error.response.data);
            }
            else if (error.response.data.message) {
                return new Failure(error.response.data.message);
            }
        }

        throw error;
    }
}