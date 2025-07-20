#!/usr/bin/env node

import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONFIG_TEMPLATE = `import RootCollection from "kytkat/root";

export default new RootCollection(() => {
    return {
        configCache: {
            images: {
                extensions: ["png", "jpg", "jpeg", "webp", "avif", "gif"],
                policy: "public, max-age=31536000, immutable",
            },
            scripts: {
                extensions: ["js", "mjs", "cjs"],
                policy: "public, max-age=3600",
            },
            fonts: {
                extensions: ["woff", "woff2", "ttf", "otf"],
                policy: "public, max-age=31536000, immutable",
            },
            styles: {
                extensions: ["css"],
                policy: "public, max-age=604800",
            },
            svg: {
                extensions: ["svg"],
                policy: "public, max-age=2592000",
            },
            html: {
                extensions: ["html", "htm"],
                policy: "no-cache",
            },
        },
        staticRoot: {},
    };
});
`;

async function createConfigFile()
{
    const projectDir = process.cwd();
    
    const configFiles =
    [
        "kytkat.config.js",
        "kytkat.config.v2.js",
        "kytkat.config.v3.js"
    ];

    let newConfigFile = "kytkat.config.js";
    let version = 1;

    for (const file of configFiles)
    {
        if (!existsSync(join(projectDir, file)))
        {
            newConfigFile = file;
            version = file.includes(".v") ? parseInt(file.split(".v")[1].split(".")[0]) : 1;
            break;
        }
    }

    if (existsSync(join(projectDir, newConfigFile)))
    {
        const highestVersion = configFiles.reduce((max, file) =>
        {
            const v = file.includes(".v") ? parseInt(file.split(".v")[1].split(".")[0]) : 1;
            return v > max ? v : max;
        }, 0);

        newConfigFile = `kytkat.config.v${highestVersion + 1}.js`;
        version = highestVersion + 1;
    }

    const configPath = join(projectDir, newConfigFile);
    writeFileSync(configPath, CONFIG_TEMPLATE);

    console.log(`\x1b[43m ✅ kytkat : \x1b[40m
    \x1b[42m|🇺🇸 Configuration file ${newConfigFile} created successfully \x1b[40m
    \x1b[42m|🇮🇷 !ﺪﺷ ﺩﺎﺠﯾﺍ ﺖﯿﻘﻓﻮﻣ ﺎﺑ ${newConfigFile} ﯼﺪﻨﺑﺮﮑﯿﭘ ﻞﯾﺎﻓ \x1b[40m`);
    console.log(`\x1b[43m ✅ LOG : \x1b[40m
    \x1b[44m 📝 root: ${configPath} \x1b[40m
    \x1b[44m 🔄 version: ${version} \x1b[40m`);
}

const args = process.argv.slice(2);
const command = args[0];

if (command === "config")
{
    try
    {
        await createConfigFile();
    }
    catch (error)
    {
        console.error(`\x1b[43m ❌ kytkat : \x1b[40m
        \x1b[41m|🇺🇸 Error creating configuration file: ${error.message} \x1b[40m
        \x1b[41m|🇮🇷 ﯼﺪﻨﺑﺮﮑﯿﭘ ﻞﯾﺎﻓ ﺩﺎﺠﯾﺍ ﺭﺩ ﺎﻄﺧ: ${error.message} \x1b[40m`);
        process.exit(1);
    }
} else {
    console.error(`\x1b[43m ❌ kytkat : \x1b[40m
    \x1b[41m|🇺🇸 Invalid command \x1b[40m
    \x1b[41m|🇮🇷 !ﺮﺒﺘﻌﻣﺎﻧ ﺭﻮﺘﺳﺩ \x1b[40m
    
    \x1b[41m|🇺🇸 Use the zid command to create the configuration file: \x1b[40m
    \x1b[41m kytkat config \x1b[40m
    
    \x1b[41m|🇮🇷 ﺪﯿﻨﮐ ﻩﺩﺎﻔﺘﺳﺍ ﺮﯾﺯ ﺭﻮﺘﺳﺩ ﺯﺍ ﯼﺪﻨﺑﺮﮑﯿﭘ ﻞﯾﺎﻓ ﺩﺎﺠﯾﺍ ﯼﺍﺮﺑ: \x1b[40m
    \x1b[41m kytkat config \x1b[40m`);
    process.exit(1);
}
