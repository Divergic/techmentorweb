import Component from "vue-class-component";
import Vue from "vue";
import SearchFilters from "../../controls/searchFilters/searchFilters.vue";

@Component({
    components: {
        SearchFilters
    }
  })
export default class Home extends Vue {
}