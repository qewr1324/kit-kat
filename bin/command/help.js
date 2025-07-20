import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_FOLDERS = ["wwwroot", "public", "static", "assets", "project", "app", "src", "server"];

export default async function help()
{
  try
  {
    const helpText = await readFile(resolve(__dirname, "../../docs/help.txt"), "utf8");
    console.log(helpText);
  }
  catch
  {
    console.log(`
    \x1b[43m 📚 ﺕﺍﺭﻮﺘﺳﺩ ﯼﺎﻤﻨﻫﺍﺭ kytkat-cli: \x1b[40m

    \x1b[44m kytkat help                           ﺎﻤﻨﻫﺍﺭ ﻦﯾﺍ ﺶﯾﺎﻤﻧ \x1b[40m
    \x1b[44m kytkat generate                       ﺽﺮﻓﺶﯿﭘ ﯼﺎﻫﻪﺷﻮﭘ ﺭﺩ ﻮﺠﺘﺴﺟ (${DEFAULT_FOLDERS.join(", ")}) \x1b[40m
    \x1b[44m kytkat generate <ﻡﺎﻧ-ﻪﺷﻮﭘ>            ﻩﺍﻮﺨﻟﺩ ﻪﺷﻮﭘ ﻦﮑﺳﺍ \x1b[40m
    \x1b[44m kytkat generate <ﻡﺎﻧ-ﻪﺷﻮﭘ> -type <ﺖﺴﯿﻟ> ﻩﺪﺷ ﺺﺨﺸﻣ ﯼﺎﻫﻞﯾﺎﻓ ﻉﻮﻧ ﺎﺑ ﻦﮑﺳﺍ \x1b[40m
    \x1b[44m kytkat generate <ﻡﺎﻧ-ﻪﺷﻮﭘ> -depth <ﺩﺪﻋ> ﻮﺠﺘﺴﺟ ﻖﻤﻋ ﻦﯿﯿﻌﺗ (ﺽﺮﻓﺶﯿﭘ: 3) \x1b[40m

    \x1b[44m ﺎﻫﻝﺎﺜﻣ: \x1b[40m
    \x1b[44m kytkat generate                      (ﺽﺮﻓﺶﯿﭘ ﯼﺎﻫﻪﺷﻮﭘ ﺭﺩ ﺭﺎﮐﺩﻮﺧ ﯼﻮﺠﺘﺴﺟ) \x1b[40m
    \x1b[44m kytkat generate assets               (ﻪﺷﻮﭘ ﻦﮑﺳﺍ assets) \x1b[40m
    \x1b[44m kytkat generate static -type png jpg (ﻩﺪﺷ ﺺﺨﺸﻣ ﯼﺎﻫﻞﯾﺎﻓ ﻉﻮﻧ ﺎﺑ ﻦﮑﺳﺍ) \x1b[40m
    \x1b[44m kytkat generate src -depth 5         (ﻪﺷﻮﭘ ۵ ﻖﻤﻋ ﺎﺗ ﻮﺠﺘﺴﺟ) \x1b[40m
`);}
}
