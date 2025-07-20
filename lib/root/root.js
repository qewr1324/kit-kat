import { Root } from "../view/view.js";

Root();

/**
 * .*`مجموعه اصلی`|* یک کلاس برای مسیرها و تنظیمات مربوط به تارنما در کتابخانه اصلی است| |`🇮🇷-`
 *
 * `-🇺🇸`| The *|`RootCollection`|* is a class for *|`kytkat`|* library related settings,
 *
 * which define important paths for the website.
 *
 * @param {Function} config object
 * @returns {Object} `object`
 * @example 🔑 export default new RootCollection (() => {
 * .     return
 * .     {
 * .        "sitemap.xml": "./src/views/~~.js",
 * .        "setting.js": "./src/views/~~.js",
 * .        "icon.ico": "./src/views/~~.js",
 * .     }
 * .  });
 * @version 🔗 v0.10.10
 */

export default class RootCollection
{
	/**
	 *
	 * @param {Function} config object
	 * @returns {Object} object
	 */

	constructor(config = () => {})
    {
		return config();
	}
}
