import path from "path";

let distUrl = "dist/";

export default {
    distUrl: distUrl,
    srcUrl: "es2015/",
    buildUrl: "js/",
    publish: [
        {
            from: "css/",
            to: path.join(distUrl, "css"),
            middleware: []
        }    
    ]
}