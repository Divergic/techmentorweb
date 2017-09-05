import Timezones from "tz-ids/index.jsnext.js";
import { ProfileStatus } from "./api/profileService";

export class ListItem<T> {
    public name: string;
    public value?: T;
} 

export interface IListsService {
    getBirthYears(): Array<ListItem<number>>;
    getGenders(): Array<ListItem<string>>;
    getProfileStatuses(): Array<ListItem<number>>;
    getTechYears(): Array<ListItem<number>>;
    getTimezones(): Array<ListItem<string>>;
}

export class ListsService implements IListsService {

    public getBirthYears(): Array<ListItem<number>> {
        let years: Array<number> = new Array<number>();
        let currentYear = new Date().getFullYear();
        let minimumYear: number = currentYear - 100;
        
        // We will assume that there will be no mentors younger than 10 in order to reduce the size of the list
        let maximumYear = currentYear - 10;

        for (let index = maximumYear; index >= minimumYear; index--) {
            years.push(index);
        }

        return this.prepareItemList(years);
    }

    public getGenders(): Array<ListItem<string>> {
        // TODO: Convert this into a call to the categories on the API to return the available genders
        let availableGenders = <Array<string>>["Male", "Female", "Non-binary"];
        
        return this.prepareItemList(availableGenders);
    }

    public getProfileStatuses(): Array<ListItem<number>> {
        return <Array<ListItem<number>>>[
            <ListItem<number>> {name: "Hidden", value: ProfileStatus.Hidden}, 
            <ListItem<number>> {name: "Unavailable", value: ProfileStatus.Unavailable}, 
            <ListItem<number>> {name: "Available", value: ProfileStatus.Available}
        ];
    }

    public getTechYears(): Array<ListItem<number>> {
        let years: Array<number> = new Array<number>();
        let maximumYear = new Date().getFullYear();
        let minimumYear: number = 1989;
        
        for (let index = maximumYear; index >= minimumYear; index--) {
            years.push(index);
        }
        
        return this.prepareItemList(years);
    }
    
    public getTimezones(): Array<ListItem<string>> {
        return this.prepareItemList(Timezones);
    }
    
    private prepareItemList<T>(values: Array<T>): Array<ListItem<T>> {
        let items = new Array<ListItem<T>>();

        items.push(<ListItem<T>>{name: "Unspecified"});

        for (let index = 0; index < values.length; index++) {
            let value = values[index];

            items.push(<ListItem<T>>{name: value.toString(), value: value});
        }

        return items;
    }
}