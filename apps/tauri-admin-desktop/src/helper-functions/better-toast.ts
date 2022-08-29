import toast from "react-hot-toast";

export class BetterToast {
  private loadID: string | null = null;
  private toastMessages: {
    LOADING: string;
    SUCCESS: string;
    ERROR: string;
  };
  constructor(
    toastMessages = {
      LOADING: "Loading...",
      SUCCESS: "Success!",
      ERROR: "Error!",
    }
  ) {
    this.toastMessages = toastMessages;
  }

  public start() {
    this.loadID = toast.loading(this.toastMessages.LOADING);
  }

  public success(newMessage?: string) {
    if (this.loadID === null) return;
    toast.dismiss(this.loadID);
    toast.success(newMessage || this.toastMessages.SUCCESS);
  }

  public error(newMessage?: string) {
    if (this.loadID === null) return;
    toast.dismiss(this.loadID);
    toast.error(newMessage || this.toastMessages.ERROR);
  }
}
