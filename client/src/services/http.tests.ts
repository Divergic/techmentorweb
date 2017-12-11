import { Http } from "./http";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { IConfig } from "./config/config";
import { IDataStore } from "./dataStore/dataStore";
import { ILocation } from "./location";
import { IUserService } from "./authentication/userService";

const core = require("../tests/core");

type RequestConfigFunc = (config: AxiosRequestConfig) => AxiosRequestConfig;
type ResponseErrorFunc = (error: any) => any;

describe("Http", () => {
    let requestConfig: AxiosRequestConfig;
    let data: any;
    let successfulResponse: any;
    let successfulEmptyResponse: any;
    let noStatusOrDataResponse: any;
    let noStatusResponse: any;
    let unauthorizedResponse: any;
    let badRequestResponse: any;
    let requestConfigFunc: RequestConfigFunc;
    let responseErrorFunc: ResponseErrorFunc;
    let client: AxiosInstance;
    let config: IConfig;
    let dataStore: IDataStore;
    let location: ILocation;
    let userService: IUserService;
    let sut: Http;

    beforeEach(() => {
        // Cancel out the console calls to avoid noisy logging in tests
        spyOn(console, "error");

        requestConfig = <AxiosRequestConfig>{
            headers: {
                Authorization: null
            }
        };
        data = {
            firstName: "Jane",
            lastName: "Smith"
        };
        successfulResponse = {
            data: data,
            status: 200
        };
        successfulEmptyResponse = {
            status: 200
        };
        noStatusOrDataResponse = {
            contents: "this is an unexpected and invalid response"
        };
        noStatusResponse = {
            data: "this is an unexpected and invalid response"
        };
        unauthorizedResponse = {
            "data": "Status Code: 401; Unauthorized                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ",
            "status": 401,
            "statusText": "Unauthorized",
            "headers": { 
                "content-type": "text/plain" 
            },
            "config": {
                "transformRequest": {},
                "transformResponse": {},
                "timeout": 0,
                "xsrfCookieName": "XSRF-TOKEN",
                "xsrfHeaderName": "X-XSRF-TOKEN",
                "maxContentLength": -1,
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "Authorization": "Bearer stuff"
                },
                "baseURL": "https://techmentorapidev.azurewebsites.net/",
                "method": "get",
                "url": "https://techmentorapidev.azurewebsites.net/profile/"
            },
            "request": {}
        };
        badRequestResponse = {
            "data": {
                "errors": [
                    {
                        "field": "FirstName",
                        "message": "The FirstName field is required."
                    }
                ],
                "message": "Validation Failed"
            },
            "status": 400,
            "statusText": "Bad Request",
            "headers": {
                "content-type": "application/json; charset=utf-8"
            },
            "config": {
                "transformRequest": {},
                "transformResponse": {},
                "timeout": 0,
                "xsrfCookieName": "XSRF-TOKEN",
                "xsrfHeaderName": "X-XSRF-TOKEN",
                "maxContentLength": -1,
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json;charset=utf-8",
                },
                "baseURL": "https://techmentorapidev.azurewebsites.net/",
                "method": "put",
                "url": "https://techmentorapidev.azurewebsites.net/profile/",
            },
            "request": {}
        };
        client = <AxiosInstance>{
            interceptors: {
                request: {
                    use: (func: RequestConfigFunc): void => {
                        requestConfigFunc = func;
                    }
                },
                response: {
                    use: (configFunc: any, errorFunc: ResponseErrorFunc): void => {
                        responseErrorFunc = errorFunc;
                    }
                }
            },
            get: async (uri: string): Promise<any> => {
                return null;
            },
            post: async (uri: string, data: any): Promise<any> => {
                return null;
            },
            put: async (uri: string, data: any): Promise<any> => {
                return null;
            }
        };
        config = <IConfig>{            
        };
        dataStore = <IDataStore>{
            accessToken: "some access token"
        };
        location = <ILocation>{
            getHref: (): string => {
                return "";
            },
            getSignInUri: (uri: string): string => {
                return "";
            },
            setHref: (uri: string): void => {
            }
        };
        userService = <IUserService>{
            IsAuthenticated: true,
            SessionExpired: true
        };
        sut = new Http(client, config, dataStore, location, userService);
    });

    describe("constructor", () => {
        it("sets authorization header when accessToken exists", () => {                
            expect(requestConfigFunc).not.toBeNull();

            let actual = requestConfigFunc.call(sut, requestConfig);

            expect(actual.headers.Authorization).toEqual("Bearer " + dataStore.accessToken);
        });
        it("leaves authorization header when not accessToken exists", () => {                
            dataStore.accessToken = null;

            expect(requestConfigFunc).not.toBeNull();

            let actual = requestConfigFunc.call(sut, requestConfig);
            
            expect(actual.headers.Authorization).toBeNull();
        });
        it("response error returns error when not 401", core.runAsync(async () => {  
            let error = {
                response: {
                    status: 500
                }
            };
            
            expect(responseErrorFunc).not.toBeNull();

            let actual = await responseErrorFunc(error);

            expect(actual).toEqual(error);
        }));
        it("response error returns error when 401 and user not authenticated", core.runAsync(async () => {  
            let error = {
                response: {
                    status: 401
                }
            };

            userService.IsAuthenticated = false;
            
            expect(responseErrorFunc).not.toBeNull();

            let actual = await responseErrorFunc(error);

            expect(actual).toEqual(error);
        }));
        it("response error returns error when 401 and user session not expired", core.runAsync(async () => {  
            let error = {
                response: {
                    status: 401
                }
            };

            userService.SessionExpired = false;
            
            expect(responseErrorFunc).not.toBeNull();

            let actual = await responseErrorFunc(error);
            
            expect(actual).toEqual(error);
        }));
        it("response error redirects sign in when 401 returned an unauthenticated", core.runAsync(async () => {  
            let signInUri = "https://www.test.com/auth";
            let returnUri = "/profile";
            let error = {
                response: {
                    status: 401
                }
            };

            spyOn(location, "getHref").and.returnValue(returnUri);
            spyOn(location, "getSignInUri").and.returnValue(signInUri);
            spyOn(location, "setHref");

            expect(responseErrorFunc).not.toBeNull();

            try {
                await responseErrorFunc(error);

                throw new Error("An error should have been thrown");
            }
            catch (e) {
                expect(e.visibleToUser).toBeTruthy();
            }

            expect(location.getSignInUri).toHaveBeenCalledWith(returnUri);
            expect(location.setHref).toHaveBeenCalledWith(signInUri);
        }));
    });

    describe("get", () => {
        it("gets the specified resource", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "get").and.returnValue(successfulResponse);

            await sut.get<any>(resource);

            expect(client.get).toHaveBeenCalledWith(resource);
        }));
        it("returns 200 response", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "get").and.returnValue(successfulResponse);

            let actual = await sut.get<any>(resource);

            expect(actual).toEqual(successfulResponse.data);
        }));
        it("returns empty response", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "get").and.returnValue(successfulEmptyResponse);

            let actual = await sut.get<any>(resource);

            expect(actual).toBeNull();
        }));
        it("throws exception when client throws error", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";
            let failure = new Error("some failure");

            spyOn(client, "get").and.returnValue(Promise.reject(failure));

            try {
                await sut.get<any>(resource);
            }
            catch (e) {
                expect(e).toEqual(failure);
            }
        }));
        it("throws failure when response is a failure without status or data", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "get").and.returnValue(noStatusOrDataResponse);

            try {
                await sut.get<any>(resource);
                
                throw new Error("An error should have been thrown");
            }
            catch (e) {         
                expect(e.visibleToUser).toBeTruthy();
                expect(e.message).toEqual("Unexpected status response");
            }
        }));
        it("throws failure when response is a failure without status", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "get").and.returnValue(noStatusResponse);

            try {
                await sut.get<any>(resource);
                
                throw new Error("An error should have been thrown");
            }
            catch (e) {         
                expect(e.visibleToUser).toBeTruthy();
                expect(e.message).toEqual(noStatusResponse.data);
            }
        }));
        it("throws failure when response is a failure with error message in data", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "get").and.returnValue(unauthorizedResponse);

            try {
                await sut.get<any>(resource);
                
                throw new Error("An error should have been thrown");
            }
            catch (e) {         
                expect(e.visibleToUser).toBeTruthy();
                expect(e.message).toEqual(unauthorizedResponse.data);
            }
        }));
        it("throws failure when response is a failure with error message in data.message", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "get").and.returnValue(badRequestResponse);

            try {
                await sut.get<any>(resource);
                
                throw new Error("An error should have been thrown");
            }
            catch (e) {         
                expect(e.visibleToUser).toBeTruthy();
                expect(e.message).toEqual(badRequestResponse.data.message);
            }
        }));
    });

    describe("post", () => {
        it("posts to the specified resource", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "post").and.returnValue(successfulResponse);

            await sut.post<any, any>(resource, data);

            expect(client.post).toHaveBeenCalledWith(resource, data);
        }));
        it("returns 200 response", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "post").and.returnValue(successfulResponse);

            let actual = await sut.post<any, any>(resource, data);

            expect(actual).toEqual(successfulResponse.data);
        }));
        it("returns 201 response", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            successfulResponse.status = 201;

            spyOn(client, "post").and.returnValue(successfulResponse);

            let actual = await sut.post<any, any>(resource, data);

            expect(actual).toEqual(successfulResponse.data);
        }));
        it("returns 204 response", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            successfulResponse.status = 204;

            spyOn(client, "post").and.returnValue(successfulResponse);

            let actual = await sut.post<any, any>(resource, data);

            // A 204 is No Content so the body is ignored
            expect(actual).toBeNull();
        }));
        it("returns empty response", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "post").and.returnValue(successfulEmptyResponse);

            let actual = await sut.post<any, any>(resource, data);

            expect(actual).toBeNull();
        }));
        it("throws exception when client throws error", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";
            let failure = new Error("some failure");

            spyOn(client, "post").and.returnValue(Promise.reject(failure));

            try {
                await sut.post<any, any>(resource, data);
            }
            catch (e) {
                expect(e).toEqual(failure);
            }
        }));
        it("throws failure when response is a failure without status or data", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "post").and.returnValue(noStatusOrDataResponse);

            try {
                await sut.post<any, any>(resource, data);
                
                throw new Error("An error should have been thrown");
            }
            catch (e) {         
                expect(e.visibleToUser).toBeTruthy();
                expect(e.message).toEqual("Unexpected status response");
            }
        }));
        it("throws failure when response is a failure without status", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "post").and.returnValue(noStatusResponse);

            try {
                await sut.post<any, any>(resource, data);
                
                throw new Error("An error should have been thrown");
            }
            catch (e) {         
                expect(e.visibleToUser).toBeTruthy();
                expect(e.message).toEqual(noStatusResponse.data);
            }
        }));
        it("throws failure when response is a failure with error message in data", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "post").and.returnValue(unauthorizedResponse);

            try {
                await sut.post<any, any>(resource, data);
                
                throw new Error("An error should have been thrown");
            }
            catch (e) {         
                expect(e.visibleToUser).toBeTruthy();
                expect(e.message).toEqual(unauthorizedResponse.data);
            }
        }));
        it("throws failure when response is a failure with error message in data.message", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "post").and.returnValue(badRequestResponse);

            try {
                await sut.post<any, any>(resource, data);
                
                throw new Error("An error should have been thrown");
            }
            catch (e) {         
                expect(e.visibleToUser).toBeTruthy();
                expect(e.message).toEqual(badRequestResponse.data.message);
            }
        }));
    });
    
    describe("put", () => {
        it("posts to the specified resource", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "put").and.returnValue(successfulResponse);

            await sut.put<any, any>(resource, data);

            expect(client.put).toHaveBeenCalledWith(resource, data);
        }));
        it("returns 200 response", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "put").and.returnValue(successfulResponse);

            let actual = await sut.put<any, any>(resource, data);

            expect(actual).toEqual(successfulResponse.data);
        }));
        it("returns 204 response", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            successfulResponse.status = 204;

            spyOn(client, "put").and.returnValue(successfulResponse);

            let actual = await sut.put<any, any>(resource, data);

            // A 204 is No Content so the body is ignored
            expect(actual).toBeNull();
        }));
        it("returns empty response", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "put").and.returnValue(successfulEmptyResponse);

            let actual = await sut.put<any, any>(resource, data);

            expect(actual).toBeNull();
        }));
        it("throws exception when client throws error", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";
            let failure = new Error("some failure");

            spyOn(client, "put").and.returnValue(Promise.reject(failure));

            try {
                await sut.put<any, any>(resource, data);
            }
            catch (e) {
                expect(e).toEqual(failure);
            }
        }));
        it("throws failure when response is a failure without status or data", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "put").and.returnValue(noStatusOrDataResponse);

            try {
                await sut.put<any, any>(resource, data);
                
                throw new Error("An error should have been thrown");
            }
            catch (e) {         
                expect(e.visibleToUser).toBeTruthy();
                expect(e.message).toEqual("Unexpected status response");
            }
        }));
        it("throws failure when response is a failure without status", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "put").and.returnValue(noStatusResponse);

            try {
                await sut.put<any, any>(resource, data);
                
                throw new Error("An error should have been thrown");
            }
            catch (e) {         
                expect(e.visibleToUser).toBeTruthy();
                expect(e.message).toEqual(noStatusResponse.data);
            }
        }));
        it("throws failure when response is a failure with error message in data", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "put").and.returnValue(unauthorizedResponse);

            try {
                await sut.put<any, any>(resource, data);
                
                throw new Error("An error should have been thrown");
            }
            catch (e) {         
                expect(e.visibleToUser).toBeTruthy();
                expect(e.message).toEqual(unauthorizedResponse.data);
            }
        }));
        it("throws failure when response is a failure with error message in data.message", core.runAsync(async () => {  
            let resource = "https://api.techmentortest.info/something";

            spyOn(client, "put").and.returnValue(badRequestResponse);

            try {
                await sut.put<any, any>(resource, data);
                
                throw new Error("An error should have been thrown");
            }
            catch (e) {         
                expect(e.visibleToUser).toBeTruthy();
                expect(e.message).toEqual(badRequestResponse.data.message);
            }
        }));
    });
});