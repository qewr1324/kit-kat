// view.d.ts
declare module "kytkat" {
    import { URL } from "node:url";

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
     * @version 🔗 v0.52.56
     */ 
    export default class kitkat
    {

        /**
         * .این تابع برای *|`صدا`|* زدن محتویات ایستا ای است که در *|`تارنما`|* ناوبری شده است `🇮🇷-`
         *
         * `-🇺🇸`| This function is for *|`calling`|* the static content that is routed in the *|`web`|* page.
         *
         * @param {String} [url=String] name "url"
         * @param {() => void} [resData=() => {}] return data for response
         * @returns {String} `return static content`
         * @returns {Headers} `cache files in browser with extension '~.js = 1 hour | ~.png = 1 year'`
         * @type `static`
         * @version 🔗 v0.21.21
         */
        static staticRender(
            url: string,
            resData: (response: { data: string | Buffer; header: Record<string, string> } | false) => void
        ): Promise<void>;
    }
}
