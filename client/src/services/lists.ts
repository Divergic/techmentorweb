import Timezones from "tz-ids/index.jsnext.js";

export class ListItem<T> {
    public name: string;
    public value?: T;
} 

export interface IListsService {
    getBirthYears(): Array<number>;
    getProfileStatuses(): Array<ListItem<string>>;
    getSkillLevels(): Array<ListItem<string>>;
    getTechYears(): Array<number>;
    getTimezones(): Array<string>;
}

export class ListsService implements IListsService {

    public getBirthYears(): Array<number> {
        let years: Array<number> = new Array<number>();
        let currentYear = new Date().getFullYear();
        let minimumYear: number = currentYear - 100;
        
        // We will assume that there will be no mentors younger than 10 in order to reduce the size of the list
        let maximumYear = currentYear - 10;

        for (let index = maximumYear; index >= minimumYear; index--) {
            years.push(index);
        }

        return years;
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

    public getTechYears(): Array<number> {
        let years: Array<number> = new Array<number>();
        let maximumYear = new Date().getFullYear();
        let minimumYear: number = 1989;
        
        for (let index = maximumYear; index >= minimumYear; index--) {
            years.push(index);
        }
        
        return years;
    }
    
    public getTimezones(): Array<string> {
        return Timezones;
    }
    
    private prepareItemList<T>(values: Array<ListItem<T>>): Array<ListItem<T>> {
        values.unshift(<ListItem<T>>{name: "Unspecified", value: <T><any>null});

        return values;
    }
}