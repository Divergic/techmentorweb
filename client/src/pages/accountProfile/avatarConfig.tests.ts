import { IConfig } from "../../services/config/config";
import { IDataStore } from "../../services/dataStore/dataStore";
import { AvatarConfig } from "./avatarConfig";

describe("AvatarConfig", () => {
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
            let sut = new AvatarConfig(config, store);

            expect(sut.PostAction).toEqual(config.apiUri + "/profile/avatars/");
        });
        it("returns address when config is missing trailing /", () => {
            config.apiUri += "/";
            
            let sut = new AvatarConfig(config, store);

            expect(sut.PostAction).toEqual(config.apiUri + "profile/avatars/");
        });
    });

    describe("Headers", () => {
        it("returns undefined authorization when accessToken is null", () => {
            store.accessToken = null;

            let sut = new AvatarConfig(config, store);
            
            expect(sut.Headers).toBeDefined();
            expect(sut.Headers.Authorization).toBeUndefined();
        });
        it("returns authorization when accessToken is defined", () => {
            let sut = new AvatarConfig(config, store);
            
            expect(sut.Headers).toBeDefined();
            expect(sut.Headers.Authorization).toEqual("Bearer " + store.accessToken);
        });
    });

    describe("GetAvatarUri", () => {
        it("returns uri of avatar", () => {
            let sut = new AvatarConfig(config, store);

            let profileId = "asdfasdfasdf";
            let avatarId = "134234234";
            let eTag = "asdf234asdf";

            let actual = sut.GetAvatarUri(profileId, avatarId, eTag);

            expect(actual).toEqual(config.apiUri + "/profiles/" + profileId + "/avatars/" + avatarId + "?etag=" + eTag);
        });
        it("returns uri of avatar with empty eTag", () => {
            let sut = new AvatarConfig(config, store);

            let profileId = "asdfasdfasdf";
            let avatarId = "134234234";
            let eTag = "";

            let actual = sut.GetAvatarUri(profileId, avatarId, eTag);

            expect(actual).toEqual(config.apiUri + "/profiles/" + profileId + "/avatars/" + avatarId);
        });
        it("returns uri of avatar with null eTag", () => {
            let sut = new AvatarConfig(config, store);

            let profileId = "asdfasdfasdf";
            let avatarId = "134234234";
            let eTag = null;

            let actual = sut.GetAvatarUri(profileId, avatarId, eTag);

            expect(actual).toEqual(config.apiUri + "/profiles/" + profileId + "/avatars/" + avatarId);
        });
    });
});