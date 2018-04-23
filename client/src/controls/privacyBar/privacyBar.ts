import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import VueScrollTo from "vue-scrollto";

@Component
export default class PrivacyBar extends Vue {
    
    public showConfirm: boolean;

    public constructor() {
        super();

        this.showConfirm = false;
    }

    @Prop()
    public disabled: boolean;

    @Prop()
    public isProfileHidden: boolean;
    
    @Prop()
    public isHiding: boolean;

    @Prop()
    public isExporting: boolean;

    @Prop()
    public isDeleting: boolean;

    @Prop()
    public isExpanded: boolean;

    public mounted(): void {
        if (!this.isExpanded) {
            return;
        }

        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been rendered
            let options = {
                easing: "ease-in",
                offset: -60
            };
            
            VueScrollTo.scrollTo("#privacy", undefined, options);
        });
    }

    public OnShowConfirm(): void {
        this.showConfirm = true;
    }

    public OnHide(): void {        
        this.$emit("onHide");        
    }

    public OnExport(): void {
        this.$emit("onExport");        
    }

    public OnCancelDelete(): void {
        this.showConfirm = false;
    }

    public OnDelete(): void {
        this.$emit("onDelete");  
        this.showConfirm = false;      
    }
}