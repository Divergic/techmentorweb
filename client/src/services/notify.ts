import Failure from "./failure";
import * as iziToast from "iziToast";

export interface INotify {
    showError(message: string): void;
    showFailure(failure: Failure): void;
    showInformation(message: string): void;
    showSuccess(message: string): void;
    showWarning(message: string): void;
}

export class Notify implements INotify {
    public constructor(private toast: any = iziToast) {
    }
    
    public showError(message: string): void {
        this.toast.error({
            title: "Error",
            message: message,
            icon: "notifyErrorIcon"
        });
    }

    public showFailure(failure: Failure): void {
        this.toast.error({
            title: "Error",
            message: failure.message,
            icon: "notifyErrorIcon"
        });
    }

    public showInformation(message: string): void {
        this.toast.info({
            title: "Information",
            message: message
        });
    }

    public showSuccess(message: string): void {
        this.toast.success({
            "title": "Success",
            message: message,
            icon: "notifySuccessIcon"
        });
    }

    public showWarning(message: string): void {
        this.toast.warning({
            "title": "Warning",
            message: message
        });
    }
}