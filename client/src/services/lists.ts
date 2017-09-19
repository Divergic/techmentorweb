import Timezones from "tz-ids/index.jsnext.js";

export class ListItem<T> {
    public name: string;
    public value?: T;
} 

export interface IListsService {
    getBirthYears(): Array<ListItem<number>>;
    getGenders(): Array<ListItem<string>>;
    getProfileStatuses(): Array<ListItem<string>>;
    getSkillLevels(): Array<ListItem<string>>;
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

        return this.prepareList(years);
    }

    public getGenders(): Array<ListItem<string>> {
        let availableGenders = <Array<string>>["Male", "Female", "Non-binary"];
        
        return this.prepareList(availableGenders);
    }

    public getProfileStatuses(): Array<ListItem<string>> {
        return <Array<ListItem<string>>>[
            <ListItem<string>> {name: "Hidden", value: "hidden"}, 
            <ListItem<string>> {name: "Unavailable", value: "unavailable"}, 
            <ListItem<string>> {name: "Available", value: "available"}
        ];
    }

    public getSkillLevels(): Array<ListItem<string>> {
        let availableSkills = <Array<ListItem<string>>>[
            <ListItem<string>> {name: "Hobbyist", value: "hobbyist"}, 
            <ListItem<string>> {name: "Beginner", value: "beginner"}, 
            <ListItem<string>> {name: "Intermediate", value: "intermediate"}, 
            <ListItem<string>> {name: "Expert", value: "expert"}, 
            <ListItem<string>> {name: "Master", value: "master"}
        ];

        return this.prepareItemList(availableSkills);
    }

    public getTechYears(): Array<ListItem<number>> {
        let years: Array<number> = new Array<number>();
        let maximumYear = new Date().getFullYear();
        let minimumYear: number = 1989;
        
        for (let index = maximumYear; index >= minimumYear; index--) {
            years.push(index);
        }
        
        return this.prepareList(years);
    }
    
    public getTimezones(): Array<ListItem<string>> {
        return this.prepareList(Timezones);
    }
    
    private prepareItemList<T>(values: Array<ListItem<T>>): Array<ListItem<T>> {
        values.unshift(<ListItem<T>>{name: "Unspecified", value: <T><any>null});

        return values;
    }
    
    private prepareList<T>(values: Array<T>): Array<ListItem<T>> {
        let items = new Array<ListItem<T>>();

        items.push(<ListItem<T>>{name: "Unspecified", value: <T><any>null});

        for (let index = 0; index < values.length; index++) {
            let value = values[index];

            items.push(<ListItem<T>>{name: value.toString(), value: value});
        }

        return items;
    }
}