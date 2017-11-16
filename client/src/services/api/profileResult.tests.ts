import ProfileResult from "./profileResult";
import { IPhotoConfig } from "../config/photoConfig";

describe("ProfileResult", () => {
    let sut: ProfileResult;
    let config: IPhotoConfig;
    let photoUri: string;

    beforeEach(() => {
        photoUri = "https://www.test.com/profiles/profileIdHere/photos/photoIdHere?hash=photoHashHere";
        
        config = <IPhotoConfig>{
            GetPhotoUri: (profileId: string, photoId: string, photoHash: string): string => {
                return photoUri;
            }
        };

        sut = new ProfileResult(null, config);
        sut.birthYear = 1974;
        sut.firstName = "Barry";
        sut.gender = "male";
        sut.id = "profileIdValue";
        sut.lastName = "Goods";
        sut.photoHash = "photoHashValue";
        sut.photoId = "photoIdValue";
        sut.status = "available";
        sut.timeZone = "Australia/Canberra";
        sut.yearStartedInTech = 1990;
    });

    describe("constructor", () => {
        it("initialises with default values when source is not specified", () => {
            let actual = new ProfileResult();

            expect(actual.birthYear).toBeNull();
            expect(actual.firstName).toBeNull();
            expect(actual.gender).toBeNull();
            expect(actual.id).toBeNull();
            expect(actual.lastName).toBeNull();
            expect(actual.photoHash).toBeNull();
            expect(actual.photoId).toBeNull();
            expect(actual.status).toBeNull();
            expect(actual.timeZone).toBeNull();
            expect(actual.yearStartedInTech).toBeNull();
        });
        it("initialises with default values when source is null", () => {
            let actual = new ProfileResult(null);

            expect(actual.birthYear).toBeNull();
            expect(actual.firstName).toBeNull();
            expect(actual.gender).toBeNull();
            expect(actual.id).toBeNull();
            expect(actual.lastName).toBeNull();
            expect(actual.photoHash).toBeNull();
            expect(actual.photoId).toBeNull();
            expect(actual.status).toBeNull();
            expect(actual.timeZone).toBeNull();
            expect(actual.yearStartedInTech).toBeNull();
        });
        it("initialises with default values when source is undefined", () => {
            let actual = new ProfileResult(undefined);

            expect(actual.birthYear).toBeNull();
            expect(actual.firstName).toBeNull();
            expect(actual.gender).toBeNull();
            expect(actual.id).toBeNull();
            expect(actual.lastName).toBeNull();
            expect(actual.photoHash).toBeNull();
            expect(actual.photoId).toBeNull();
            expect(actual.status).toBeNull();
            expect(actual.timeZone).toBeNull();
            expect(actual.yearStartedInTech).toBeNull();
        });
        it("initialises with source values", () => {
            let actual = new ProfileResult(sut, config);

            expect(actual.birthYear).toEqual(sut.birthYear);
            expect(actual.firstName).toEqual(sut.firstName);
            expect(actual.gender).toEqual(sut.gender);
            expect(actual.id).toEqual(sut.id);
            expect(actual.lastName).toEqual(sut.lastName);
            expect(actual.photoHash).toEqual(sut.photoHash);
            expect(actual.photoId).toEqual(sut.photoId);
            expect(actual.status).toEqual(sut.status);
            expect(actual.timeZone).toEqual(sut.timeZone);
            expect(actual.yearStartedInTech).toEqual(sut.yearStartedInTech);
        });
    });

    describe("DisplayAge", () => {
        it("returns empty when birthYear is null", () => {
            sut.birthYear = null;

            const actual = sut.DisplayAge;

            expect(actual).toEqual("");
        });
        it("returns empty when birthYear is undefined", () => {
            sut.birthYear = <number><any>undefined;

            const actual = sut.DisplayAge;

            expect(actual).toEqual("");
        });
        it("returns age based on current year", () => {
            let currentYear = new Date().getFullYear();
            let difference = currentYear - <number>sut.birthYear;

            const actual = sut.DisplayAge;

            expect(actual).toEqual(difference.toLocaleString());
        });
    });

    describe("DisplayGender", () => {
        it("returns empty when gender is null", () => {
            sut.gender = null;

            const actual = sut.DisplayGender;

            expect(actual).toEqual("");
        });
        it("returns empty when gender is undefined", () => {
            sut.gender = <string><any>undefined;

            const actual = sut.DisplayGender;

            expect(actual).toEqual("");
        });
        it("returns gender", () => {
            sut.gender = "Female";

            const actual = sut.DisplayGender;

            expect(actual).toEqual(sut.gender);
        });
        it("returns gender as proper case", () => {
            const actual = sut.DisplayGender;

            expect(actual).toEqual("Male");
        });
    });

    describe("DisplayStatus", () => {
        it("returns empty when status is null", () => {
            sut.status = <string><any>null;

            const actual = sut.DisplayStatus;

            expect(actual).toEqual("");
        });
        it("returns empty when status is undefined", () => {
            sut.status = <string><any>undefined;

            const actual = sut.DisplayStatus;

            expect(actual).toEqual("");
        });
        it("returns status", () => {
            sut.status = "Available";

            const actual = sut.DisplayStatus;

            expect(actual).toEqual(sut.status);
        });
        it("returns status as proper case", () => {
            const actual = sut.DisplayStatus;

            expect(actual).toEqual("Available");
        });
    });

    describe("DisplayYearsInTech", () => {
        it("returns empty when yearStartedInTech is null", () => {
            sut.yearStartedInTech = null;

            const actual = sut.DisplayYearsInTech;

            expect(actual).toEqual("");
        });
        it("returns empty when yearStartedInTech is undefined", () => {
            sut.yearStartedInTech = <number><any>undefined;

            const actual = sut.DisplayYearsInTech;

            expect(actual).toEqual("");
        });
        it("returns value based on current year", () => {
            let currentYear = new Date().getFullYear();
            let difference = currentYear - <number>sut.yearStartedInTech;

            const actual = sut.DisplayYearsInTech;

            expect(actual).toEqual(difference.toLocaleString());
        });
        it("returns 1 when yearStartedInTech is current year", () => {
            let currentYear = new Date().getFullYear();
            
            sut.yearStartedInTech = currentYear;

            const actual = sut.DisplayYearsInTech;

            expect(actual).toEqual("1");
        });
        it("returns 1 when yearStartedInTech greater than current year", () => {
            let currentYear = new Date().getFullYear();
            
            sut.yearStartedInTech = currentYear + 1;

            const actual = sut.DisplayYearsInTech;

            expect(actual).toEqual("1");
        });
    });

    describe("PhotoUri", () => {
        it("returns null when photoId is null", () => {
            sut.photoId = null;

            const actual = sut.PhotoUri;

            expect(actual).toBeNull();
        });
        it("returns null when photoId is undefined", () => {
            sut.photoId = <string><any>undefined;

            const actual = sut.PhotoUri;

            expect(actual).toBeNull();
        });
        it("returns url from config", () => {
            spyOn(config, "GetPhotoUri").and.callThrough();

            const actual = sut.PhotoUri;

            expect(actual).toEqual(photoUri);
            expect((<any>config.GetPhotoUri).calls.argsFor(0)[0]).toEqual(sut.id);
            expect((<any>config.GetPhotoUri).calls.argsFor(0)[1]).toEqual(sut.photoId);
            expect((<any>config.GetPhotoUri).calls.argsFor(0)[2]).toEqual(sut.photoHash);
        });
    });
});
