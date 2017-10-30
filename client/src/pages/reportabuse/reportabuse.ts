import Component from "vue-class-component";
import Vue from "vue";

@Component
export default class ReportAbuse extends Vue {
    public reportAbuseEmailLink: string = this.BuildReportEmail(true);
    public reportAbuseEmail: string = this.BuildReportEmail(false);

    private BuildReportEmail(includeMailTo: boolean): string {
        // The reason this email is constructed in this way is because vuejs compiles all views and code into JavaScript
        // It is possible that a screenscraper will run the script and parse the email from the rendered page. Nothing we can do about that. 
        // We want to maintain the ability for people to click on mailto links. 
        // If the email address is hard-coded in the view html however, it will be pushed into the compiled javascript as an easily obtainable string. 
        // This at least breaks up the email to make it too hard to extract it from the javascript.
        let parts = [
            "reportabuse",
            "@",
            "techmentors.info"
        ];

        if (includeMailTo) {
            parts.unshift("mailto:");
        }

        return parts.join("");
    }
}