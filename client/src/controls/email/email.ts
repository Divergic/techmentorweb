import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";

@Component
export default class Email extends Vue {
    
    @Prop()
    name: string;
    
    @Prop()
    domain: string;
    
    public get Address(): string {
        if (!this.Visible) {
            return "";
        }

        return this.name + "@" + this.domain;
    }

    public get Link(): string {
        let address = this.Address;

        if (!address) {
            return "";
        }

        return "mailto:" + address;
    }

    public get Visible(): boolean {
        if (!this.name) {
            return false;
        }

        if (!this.domain) {
            return false;
        }
    
        return true;
    }
}