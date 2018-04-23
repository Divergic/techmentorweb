export interface IJsonDownloader {
    download(name: string, value: any): void;
}

export class JsonDownloader implements IJsonDownloader {
    public download(name: string, value: any): void {
        let convertedData = JSON.stringify(value);
        let data = "text/json;charset=utf-8," + encodeURIComponent(convertedData);
        let a = document.createElement("a");
        a.href = "data:" + data;
        a.download = name;
        a.innerHTML = "Export profile";
        
        document.body.appendChild(a);

        a.click();            
        a.remove();
    }
}