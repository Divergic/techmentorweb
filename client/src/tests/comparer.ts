export interface IComparer {
    IsEquivalent(first: any, second: any, logger?: Logger | undefined): boolean;
}

type Logger = (message: string) => void;

export class Comparer implements IComparer {
    public IsEquivalent(first: any, second: any, logger: Logger | undefined = undefined, propertyName: string = ""): boolean {
        // Check for null/undefined values
        if (!first) {
            if (!second) {
                return true;
            }

            this.LogDifference(logger, first, second, propertyName);

            return false;
        }
        else if (!second) {
            // First has a value but second doesn't
            this.LogDifference(logger, first, second, propertyName);
            
            return false;
        }        

        if (this.IsPrimitiveType(first)) {
            if (first === second) {
                return true;
            }

            this.LogDifference(logger, first, second, propertyName);
            
            return false;
        }

        // Check array items individually
        if (first.constructor === Array) {
            if (second.constructor !== Array) {
                // One is an array but the other isn't
                this.LogDifference(logger, first, second, propertyName);
            
                return false;
            }

            let firstArray = <Array<any>>first;
            let secondArray = <Array<any>>second;

            if (firstArray.length !== secondArray.length) {
                this.LogDifference(logger, first.length, second.length, propertyName + ".length");

                return false;
            }
            
            for (let index = 0; index < firstArray.length; index++) {
                let firstItem = firstArray[index];
                let secondItem = secondArray[index];

                if (this.IsEquivalent(firstItem, secondItem, logger) === false) {
                    this.LogDifference(logger, first, second, propertyName + "[" + index + "]");

                    return false;
                }
            }

            return true;
        }

        // We can't rely on whether the number of properties are different
        // One instance might not have the property assigned to it (undefined) while the other has it defined but null
        // The equivalence check we are after is really looking to compare values such that undefined is really the same equivalence as null

        // Check the properties that match on both objects
        if (!this.CheckMatchingProperties(first, second, propertyName, logger)) {
            return false;
        }

        // Check the properties on the first object that do not exist on the second
        // This is to check for null/undefined properties where the property does not exist on the other object
        if (!this.CheckMissingProperties(first, second, propertyName, logger)) {
            return false;
        }

        // Check the properties on the second object that do not exist on the first
        // This is to check for null/undefined properties where the property does not exist on the other object
        if (!this.CheckMissingProperties(second, first, propertyName, logger)) {
            return false;
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }

    private CheckMatchingProperties(first: any, second: any, propertyName: string, logger: Logger | undefined): boolean {
        let firstProperties = Object.getOwnPropertyNames(first);
        let secondProperties = Object.getOwnPropertyNames(second);

        for (let index = 0; index < firstProperties.length; index++) {
            let propName = firstProperties[index];
            let secondPropertyIndex = secondProperties.indexOf(propName);

            if (secondPropertyIndex === -1) {
                // The second object doesn't have this property
                // We are only trying to find matching properties between the objects so skip this one
                continue;
            }

            // Both objects have the same properties
            let firstPropertyValue = first[propName];            
            let secondPropertyValue = second[propName];

            // If values of same property are not equal,
            // objects are not equivalent
            // Use recursion to check the tree
            if (this.IsEquivalent(firstPropertyValue, secondPropertyValue, logger, propName) === false) {
                // No need to log the difference here as the recursive call will already have done it                
                return false;
            }
        }

        return true;
    }

    private CheckMissingProperties(first: any, second: any, propertyName: string, logger: Logger | undefined): boolean {
        let firstProperties = Object.getOwnPropertyNames(first);
        let secondProperties = Object.getOwnPropertyNames(second);

        for (let index = 0; index < firstProperties.length; index++) {
            let propName = firstProperties[index];
            let secondPropertyIndex = secondProperties.indexOf(propName);

            if (secondPropertyIndex > -1) {
                // We are only trying to compare properties that exist on the first object that don't exist in the second
                // This property exists in both so skip this one
                continue;
            }
            
            let firstPropertyValue = first[propName];
            let secondPropertyValue: any = undefined;

            // If values of same property are not equal,
            // objects are not equivalent
            // Use recursion to check the tree
            if (this.IsEquivalent(firstPropertyValue, secondPropertyValue, logger, propName) === false) {
                // No need to log the difference here as the recursive call will already have done it      
                return false;
            }
        }

        return true;
    }

    private LogDifference(logger: Logger | undefined, first: any, second: any, propertyName: string): void {
        if (!logger) {
            return;
        }

        let message: string = "";

        if (propertyName) {
            message = "[" + propertyName + "] ";
        }

        if (!first) {
            message += "{no value}";
        }
        else if (this.IsPrimitiveType(first)) {
            message += "{" + typeof(first) + "} " + first;
        }
        else {
            message += "{" + typeof(first) + "} " + JSON.stringify(first);
        }

        message += " is different to ";

        if (this.IsPrimitiveType(second)) {
            message += "{" + typeof(second) + "} " + second;
        }
        else {
            message += "{" + typeof(second) + "} " + JSON.stringify(second);
        }

        logger(message);
    }

    private IsPrimitiveType(source: any): boolean {
        if (typeof source === "string") {
            return true;
        }
        
        if (typeof source === "number") {
            return true;
        }
        
        if (typeof source === "boolean") {
            return true;
        }

        if (source instanceof Date) {
            return true;
        }
        
        return false;
    }
}