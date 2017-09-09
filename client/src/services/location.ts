export class LocationInfo {
    host: string;
    href: string;
    hash: string;
    pathname: string;
    protocol: string;
    search: string;
}

export interface ILocation {
    fromQuery<T>(): T;
    fromHash<T>(): T;
    getLocation(): LocationInfo;
    getHref(): string;
    getHash(): string;
    getSearch(): string;
    getSignInUri(returnUri: string): string;
    makeAbsolute(uri: string): string;
    setHref(uri: string): void;
}

export class Location implements ILocation {
    public constructor(private instance: Window = window) {
    }

    public fromHash<T>(): T {
        let source = this.getHash().substr(1);

        return this.fromSource<T>(source);
    }

    public fromQuery<T>(): T {
        let source = this.getSearch().substr(1);

        return this.fromSource<T>(source);
    }

    public getHref(): string {
        return this.instance.location.href;
    }

    public getHash(): string {
        return this.instance.location.hash;
    }

    public getLocation(): LocationInfo {
        return this.instance.location;
    }

    public getSearch(): string {
        return this.instance.location.search;
    }

    public getSignInUri(returnUri: string): string {
        let redirectUri = encodeURIComponent(returnUri);
        let signInUri = "/signin?redirectUri=" + redirectUri;

        return this.makeAbsolute(signInUri);
    }

    public makeAbsolute(uri: string): string {
        let expression = /^http(s)?:\/\/[^\/]+/i;

        if (uri.match(expression)) {
            // The uri is already rooted to an absolute address
            return uri;
        }

        let location = this.getLocation();

        // Determine the base url
        let baseUri = location.protocol + "//" + location.host;

        if (uri.substr(0, 1) !== "/") {
            uri = "/" + uri;
        }

        let absoluteUri = baseUri + uri;

        return absoluteUri;
    }

    public setHref(uri: string): void {
        this.instance.location.href = uri;
    }

    private fromSource<T>(source: string) {
        let values = {};
        let items = source.split("&");

        items.forEach(item  => {
            let parts = item.split("=");
            let key = parts[0];

            if (!key) {
                return;
            }

            let value = parts[1];

            if (!value) {
                return;
            }
            
            values[key] = decodeURIComponent(value);
        });

        return <T>values;
    }
}