import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const version = "0.7.2";
const library = "kytkat js";

let roots = {};
let configCaches = {};

const types =
{
    // Images
    "png": "image/png",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "webp": "image/webp",
    "gif": "image/gif",
    "svg": "image/svg+xml",
    "ico": "image/x-icon",
    "bmp": "image/bmp",
    "tiff": "image/tiff",

    // Scripts
    "js": "application/javascript",
    "mjs": "application/javascript",
    "cjs": "application/javascript",
    "json": "application/json",
    "xml": "application/xml",

    // Fonts
    "woff": "font/woff",
    "woff2": "font/woff2",
    "ttf": "font/ttf",
    "otf": "font/otf",
    "eot": "application/vnd.ms-fontobject",

    // Styles
    "css": "text/css",
    "scss": "text/x-scss",
    "less": "text/x-less",

    // Documents
    "html": "text/html",
    "htm": "text/html",
    "xhtml": "application/xhtml+xml",
    "txt": "text/plain",
    "pdf": "application/pdf",
    "doc": "application/msword",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "xls": "application/vnd.ms-excel",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "ppt": "application/vnd.ms-powerpoint",
    "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // Archives
    "zip": "application/zip",
    "rar": "application/x-rar-compressed",
    "tar": "application/x-tar",
    "gz": "application/gzip",
    "7z": "application/x-7z-compressed",

    // Media
    "mp4": "video/mp4",
    "webm": "video/webm",
    "ogg": "video/ogg",
    "mp3": "audio/mpeg",
    "wav": "audio/wav",
    "flac": "audio/flac",
    "aac": "audio/aac",

    // Other
    "csv": "text/csv",
    "rtf": "application/rtf",
    "swf": "application/x-shockwave-flash",
    "apk": "application/vnd.android.package-archive",
    "exe": "application/x-msdownload",
    "dmg": "application/x-apple-diskimage",
    "iso": "application/x-iso9660-image"
};

/**
 * .سند *|`مسیر اصلی`|* را به صورت خودکار در سرور وارد می کند |`🇮🇷-`
 *
 * `-🇺🇸`| Dynamically *|`import`|* the file *|`RootCollection`|* into the server.
 *
 * @returns {String} `string`
 * @type `static`
 * @version 🔗 v0.19.12
 */

export async function Root()
{
    const rawPath = resolve(process.cwd(), "kytkat.config.js");
    const { href: purePath } = pathToFileURL(rawPath);
    const { default: { staticRoot, configCache } } = (await import(purePath));

    roots = staticRoot || {};
    configCaches = configCache || {};
}

/**
 * .*`کیت کت`|* یک کتابخانه برای توسعه دهندگان *|`وب پشتی`|* می باشد| |`🇮🇷-`
 * 
 * `-🇺🇸`| *|`kytkat`|* is a library for *|`back-end`|* web developers.
 * 
 * @author *`Amir Hussein Muhammadi Fard`*
 * @license *`MIT`*
 * @link [website](https://www.kytkatjs.com/)
 * @link [github](https://github.com/qewr1324)
 * @returns {String} `staticRender`
 * @version 🔗 v0.53.57
 */

export default class kitkat
{
    /**
     * .این تابع برای *|`صدا`|* زدن محتویات ایستا ای است که در *|`تارنما`|* ناوبری شده است `🇮🇷-`
     *
     * `-🇺🇸`| This function is for *|`calling`|* the static content that is routed in the *|`web`|* page.
     *
     * @param {URL} [url=URL] name "url"
     * @param {() => void} [resData=() => {}] return data for response
     * @returns {String} `return static content`
     * @returns {Headers} `cache files in browser with extension '~.js = 1 hour | ~.png = 1 year'`
     * @type `static`
     * @version 🔗 v0.22.22
     */

    static async staticRender(url = URL, resData = () => {})
    {
        const getContentType = (ext) =>
        {
            return types[ext] || "application/octet-stream";
        };

        const cacheHeaders = (name) =>
        {
            const ext = roots[name].split(".").pop().toLowerCase();
            
            const headers =
            {
                "Content-Type": getContentType(ext),
                "Vary": "Accept-Encoding"
            };

            for(const [type, config] of Object.entries(configCaches))
            {
                if(config.extensions?.includes(ext))
                {
                    headers["Cache-Control"] = config.policy;
                    return headers;
                }
            }
            headers["Cache-Control"] = "no-cache";
            return headers;
        }

        try
        {
            const word = url.toString().replace("/", "");
            const configheader = cacheHeaders(word);
            const rawPath = resolve(process.cwd(), roots[word]);

            const isTextType = [ "svg", "js", "css", "html", "htm" ]
                .includes(configheader["Content-Type"]
                .split("/")[1]);
            
            const file = await readFile(rawPath, isTextType ? "utf-8" : null);
            configheader["X-Library"] = library;
            configheader["X-Library-Version"] = version;

            const data = { data: file, header: configheader };
            return resData(data);
        }
        catch(err)
        {
            console.error("staticRender: " + err);
            return resData(false);
            // TODO notfound error----------
        }
    }
}
