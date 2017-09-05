export interface IYearsService {
    getBirthYears(): Array<number>;
    getTechYears(): Array<number>;
}

export class YearsService implements IYearsService {

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

    public getTechYears(): Array<number> {
        let years: Array<number> = new Array<number>();
        let maximumYear = new Date().getFullYear();
        let minimumYear: number = 1989;
        
        for (let index = maximumYear; index >= minimumYear; index--) {
            years.push(index);
        }
        
        return years;
    }
}