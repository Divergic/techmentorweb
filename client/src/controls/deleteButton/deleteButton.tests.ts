import DeleteButton from "./deleteButton";
import { IAccountProfileService } from "../../services/api/accountProfileService";

describe("DeleteButton", () => {
    let profileService: IAccountProfileService;
    let sut: DeleteButton;

    beforeEach(() => {
        profileService = <IAccountProfileService>{
            deleteAccountProfile: async (): Promise<void> => {
            }
        };

        sut = new DeleteButton();
        
        sut.configure(profileService);
    });

    describe("OnDelete", () => {
        it("removes profile from service", async () => {
            spyOn(profileService, "deleteAccountProfile");

            await sut.OnDelete();

            expect(profileService.deleteAccountProfile).toHaveBeenCalled();
        });
    });
});