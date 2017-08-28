import { Location, LocationInfo } from "./location";

class HashModel {
    public error: string;
    public error_description: string;
    public state: string;
}

class QueryModel {
    public a: string;
    public b: string;
    public c: string;
    public d: string;
    public e: string;
    public f: string;
}

class NonMatchingModel {
    public doesNotExist: string;
}

describe("location.ts", () => {
    let sut: Location;
    let location: LocationInfo;
    
    beforeEach(function () {
        location = <LocationInfo>{
                href: "https://www.test.com?a=1&b=0&c=3&d&e&a=5&a=t%20e%20x%20t&e=http%3A%2F%2Fw3schools.com%2Fmy%20test.asp%3Fname%3Dståle%26car%3Dsaab#error=access_denied&error_description=User%20did%20not%20authorize%20the%20request&state=GhfIFENDVdnzTbL0FLCsy515ofzFIyjw",
                hash: "#error=access_denied&error_description=User%20did%20not%20authorize%20the%20request&state=GhfIFENDVdnzTbL0FLCsy515ofzFIyjw",
                host: "www.test.com",
                protocol: "https",
                search: "?a=1&b=0&c=3&d&e&a=5&a=t%20e%20x%20t&e=http%3A%2F%2Fw3schools.com%2Fmy%20test.asp%3Fname%3Dståle%26car%3Dsaab"
            };
        let instance = <Window>{
            location: location
        };
        
        sut = new Location(instance);
    });

    describe("constructor", () => {
        it("can create default instance", () => {
            let actual = new Location();
            let href = actual.getHref();

            expect(href).toBe(window.location.href);
        });
    });
    
    describe("fromQuery", () => {
        it("returns empty object when no items match", () => {
            let actual = sut.fromQuery<NonMatchingModel>();    
            
            expect(actual).not.toBeNull;
            expect(actual.doesNotExist).toBeUndefined;
        });
        it("returns matching values", () => {
            let actual = sut.fromQuery<QueryModel>();    
            
            expect(actual).not.toBeNull;
            expect(actual.a).toBe("t e x t");
            expect(actual.b).toBe("0");
            expect(actual.c).toBe("3");
            expect(actual.d).toBeUndefined();
            expect(actual.e).toBe("http://w3schools.com/my test.asp?name=ståle&car=saab");
            expect(actual.f).toBeUndefined();
        });
    });
    
    describe("fromHash", () => {
        it("returns empty object when no items match", () => {
            let actual = sut.fromHash<NonMatchingModel>();    
            
            expect(actual).not.toBeNull;
            expect(actual.doesNotExist).toBeUndefined;
        });
        it("returns matching values", () => {
            let actual = sut.fromHash<HashModel>();    
            
            expect(actual).not.toBeNull;
            expect(actual.error).toBe("access_denied");
            expect(actual.error_description).toBe("User did not authorize the request");
            expect(actual.state).toBe("GhfIFENDVdnzTbL0FLCsy515ofzFIyjw");
        });
    });
    
    describe("getHref", () => {
        it("returns window href", () => {
            let actual = sut.getHref();    
            
            expect(actual).toEqual(location.href);
        });
    });
    
    describe("getHash", () => {
        it("returns window hash", () => {
            let actual = sut.getHash();    
            
            expect(actual).toEqual(location.hash);
        });
    });
    
    describe("getLocation", () => {
        it("returns window location", () => {
            let actual = sut.getLocation();    
            
            expect(actual).not.toBeNull();
            expect(actual.hash).toEqual(location.hash);
            expect(actual.host).toEqual(location.host);
            expect(actual.href).toEqual(location.href);
            expect(actual.protocol).toEqual(location.protocol);
            expect(actual.search).toEqual(location.search);
        });
    });

    describe("getSearch", () => {
        it("returns window search", () => {
            let actual = sut.getSearch();    
            
            expect(actual).toEqual(location.search);
        });
    });
    
    describe("setHref", () => {
        it("sets the window href", () => {
            let newHref = "stuff";

            sut.setHref(newHref);    
            
            expect(location.href).toEqual(newHref);
        });
    });    
});