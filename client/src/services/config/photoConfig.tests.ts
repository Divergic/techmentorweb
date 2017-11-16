import { IConfig } from "../config/config";
import { IDataStore } from "../dataStore/dataStore";
import { PhotoConfig } from "./photoConfig";

describe("PhotoConfig", () => {
    let config: IConfig;
    let store: IDataStore;

    beforeEach(() => {
        config = <IConfig>{
            apiUri: "https://www.test.com"
        };
        store = <IDataStore>{
            accessToken: "SomeToken"
        };
    });

    describe("PostAction", () => {
        it("returns address when config has trailing /", () => {
            let sut = new PhotoConfig(config, store);

            expect(sut.PostAction).toEqual(config.apiUri + "/profile/photos/");
        });
        it("returns address when config is missing trailing /", () => {
            config.apiUri += "/";
            
            let sut = new PhotoConfig(config, store);

            expect(sut.PostAction).toEqual(config.apiUri + "profile/photos/");
        });
    });

    describe("Headers", () => {
        it("returns undefined authorization when accessToken is null", () => {
            store.accessToken = null;

            let sut = new PhotoConfig(config, store);
            
            expect(sut.Headers).toBeDefined();
            expect(sut.Headers.Authorization).toBeUndefined();
        });
        it("returns authorization when accessToken is defined", () => {
            let sut = new PhotoConfig(config, store);
            
            expect(sut.Headers).toBeDefined();
            expect(sut.Headers.Authorization).toEqual("Bearer " + store.accessToken);
        });
    });

    describe("GetPhotoUri", () => {
        it("returns uri of photo", () => {
            let sut = new PhotoConfig(config, store);

            let profileId = "asdfasdfasdf";
            let photoId = "134234234";
            let hash = "asdf234asdf";

            let actual = sut.GetPhotoUri(profileId, photoId, hash);

            expect(actual).toEqual(config.apiUri + "/profiles/" + profileId + "/photos/" + photoId + "?hash=" + hash);
        });
        it("returns uri of photo with empty hash", () => {
            let sut = new PhotoConfig(config, store);

            let profileId = "asdfasdfasdf";
            let photoId = "134234234";
            let hash = "";

            let actual = sut.GetPhotoUri(profileId, photoId, hash);

            expect(actual).toEqual(config.apiUri + "/profiles/" + profileId + "/photos/" + photoId);
        });
        it("returns uri of photo with null hash", () => {
            let sut = new PhotoConfig(config, store);

            let profileId = "asdfasdfasdf";
            let photoId = "134234234";
            let hash = null;

            let actual = sut.GetPhotoUri(profileId, photoId, hash);

            expect(actual).toEqual(config.apiUri + "/profiles/" + profileId + "/photos/" + photoId);
        });
    });
});