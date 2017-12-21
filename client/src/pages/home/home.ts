import Component from "vue-class-component";
import Vue from "vue";
import SearchFilters from "../../controls/searchFilters/searchFilters.vue";

@Component({
    components: {
        SearchFilters
    }
  })
export default class Home extends Vue {
    public OnRunSearch(genders: Array<string>, languages: Array<string>, skills: Array<string>): void {
        // Navigate to the new URI       
        let query = <any>{            
        };

        if (genders.length > 0) {
            query.gender = genders;
        }

        if (languages.length > 0) {
            query.language = languages;
        }

        if (skills.length > 0) {
            query.skill = skills;
        }

        this.$router.push({ name: "search", query: query});
    }
}