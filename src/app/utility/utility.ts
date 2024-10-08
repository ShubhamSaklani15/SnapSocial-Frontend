import { MatDialogConfig } from "@angular/material/dialog";

export class Utility {
    /*
    function: getTimeAge()
    description: function to get time-ago of the post 
    */
    getTimeAgo(timestamp: string) {
        const now = new Date().getTime(); // Get current timestamp
        const postDate = new Date(timestamp).getTime(); // Get post timestamp

        const timeDiff = now - postDate;
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30.44);
        const weeks = Math.floor(days / 7);
        const years = Math.floor(weeks / 52);

        if (years > 0) {
            return `${years} y`;
        } else if (weeks > 0) {
            return `${weeks} w`;
        } else if (months > 0) {
            return `${months} mo`;
        } else if (days > 0) {
            return `${days} d`;
        } else if (hours > 0) {
            return `${hours} h`;
        } else if (minutes > 0) {
            return `${minutes} m`;
        } else {
            return 'just now';
        }
    }

    /*
    function: configureConfirmationDialog()
    description: To configure the confirmation popup
    */
    configureConfirmationDialog(heading: string, confirmationMessage: string, option1: string, option2: string): MatDialogConfig<any> {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.height = "auto";
        dialogConfig.width = "auto";
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.data = { heading: heading, confirmationMessage: confirmationMessage, option1: option1, option2: option2 };
        return dialogConfig;
    }

    /*
    function: resetLocalStorage()
    description: To reset data from local storage
    */
    resetLocalStorage(): void {
        localStorage.removeItem('name');
        localStorage.removeItem('username');
        localStorage.removeItem('token');
    }
}
