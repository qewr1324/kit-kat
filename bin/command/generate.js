#!/usr/bin/env node

import { readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";

const DEFAULT_TYPES = ["css", "png", "html", "js", "jpg", "jpeg", "gif", "svg", "ico", "webp", "json"];
const DEFAULT_FOLDERS = ["wwwroot", "public", "static", "assets", "project", "app", "src", "server"];

function normalizePath(path)
{
    return path.replace(/\\/g, "/");
}

function findFoldersRecursively(rootDir, targetFolder, depth = 3, currentDepth = 0)
{
    if (currentDepth > depth) return [];

    const folders = [];
    try
    {
        const items = readdirSync(rootDir);

        for (const item of items)
        {
            const fullPath = join(rootDir, item);
            try
            {
                const stat = statSync(fullPath);

                if (stat.isDirectory())
                {
                    if (item.toLowerCase() === targetFolder.toLowerCase()) folders.push(fullPath);
                  
                    if (currentDepth < depth)
                    {
                        const subFolders = findFoldersRecursively(fullPath, targetFolder, depth, currentDepth + 1);
                        folders.push(...subFolders);
                    }
                }
            }
            catch (error)
            {
                console.warn(`\x1b[43m ⚠️ kytkat : \x1b[40m
                \x1b[41m|🇺🇸 Error accessing ${fullPath}: ${error.message} \x1b[40m
                \x1b[41m|🇮🇷 ﻪﺑ ﯽﺳﺮﺘﺳﺩ ﺭﺩ ﺎﻄﺧ ${fullPath}: ${error.message} \x1b[40m`);
            }
        }
    }
    catch (error)
    {
        console.warn(`\x1b[43m ⚠️ kytkat : \x1b[40m
        \x1b[41m|🇺🇸 Error reading contents ${rootDir}: ${error.message} \x1b[40m
        \x1b[41m|🇮🇷 ﯼﺍﻮﺘﺤﻣ ﻥﺪﻧﺍﻮﺧ ﺭﺩ ﺎﻄﺧ ${rootDir}: ${error.message} \x1b[40m`);
    }

    return folders;
}

function parseArgs(args)
{
    const result =
    {
        command: null,
        folderName: null,
        types: [...DEFAULT_TYPES],
        help: false,
        depth: 3
    };

    for (let i = 0; i < args.length; i++)
    {
        const arg = args[i];

        if (arg === "help" || arg === "--help" || arg === "-h")
        {
            result.help = true;
            continue;
        }
      
        if (arg === "generate")
        {
            result.command = "generate";
            continue;
        }
      
        if (arg === "-type" && i + 1 < args.length)
        {
            result.types = args[i + 1].split(" ").map(t => t.toLowerCase());
            i++;
            continue;
        }
      
        if (arg === "-depth" && i + 1 < args.length)
        {
            result.depth = parseInt(args[i + 1]) || 3;
            i++;
            continue;
        }
      
        if (!result.command && !result.help)
        {
            result.command = arg;
            continue;
        }
      
        if (result.command && !result.folderName && !arg.startsWith("-")) result.folderName = arg;
    }

    return result;
}

async function scanAndGenerateConfig(folderPath, fileTypes)
{
    try
    {
        const projectDir = process.cwd();
        const relativePath = relative(projectDir, folderPath);

        console.log(`\x1b[43m 🆕 kytkat : \x1b[40m
        \x1b[43m|🇺🇸 🔍 Start scanning the folder: ${relativePath} \x1b[40m
        \x1b[43m|🇺🇸 📌 Allowed file types: ${fileTypes.join(", ")} \x1b[40m

        \x1b[43m|🇮🇷 🔍 ﻪﺷﻮﭘ ﻦﮑﺳﺍ ﻉﻭﺮﺷ: ${relativePath} \x1b[40m
        \x1b[43m|🇮🇷 📌 ﺯﺎﺠﻣ ﯼﺎﻫﻞﯾﺎﻓ ﻉﻮﻧ: ${fileTypes.join(", ")} \x1b[40m`);

        const scanDir = (dir, fileList = []) =>
        {
            const files = readdirSync(dir);

            files.forEach(file =>
            {
                const filePath = join(dir, file);
                try
                {
                    const stat = statSync(filePath);
                  
                    if (stat.isDirectory())
                    {
                        scanDir(filePath, fileList);
                    }
                    else
                    {
                        const ext = extname(file).toLowerCase().slice(1);
                        if (fileTypes.includes(ext))
                        {
                            fileList.push(
                            {
                              name: file,
                              path: normalizePath(relative(folderPath, filePath)),
                              ext: ext,
                              size: stat.size,
                              modified: stat.mtime.toISOString()
                            });
                        }
                    }
                }
                catch (error)
                {
                    console.warn(`\x1b[43m ⚠️ kytkat : \x1b[40m
                    \x1b[43m|🇺🇸 Processing error ${filePath}: ${error.message} \x1b[40m
                    \x1b[43m|🇮🇷 ﺵﺯﺍﺩﺮﭘ ﺭﺩ ﺎﻄﺧ ${filePath}: ${error.message} \x1b[40m`);
                }
            });
            return fileList;
        };

        const files = scanDir(folderPath);

        if (files.length === 0)
        {
            console.warn(`\x1b[43m ⚠️ kytkat : \x1b[40m
            \x1b[43m|🇺🇸 No files with allowed extensions were found in this folder \x1b[40m
            \x1b[43m|🇮🇷 ﺪﺸﻧ ﺖﻓﺎﯾ ﻪﺷﻮﭘ ﻦﯾﺍ ﺭﺩ ﺯﺎﺠﻣ ﯼﺎﻫﺪﻧﻮﺴﭘ ﺎﺑ ﯼﺮﺒﺘﻌﻣ ﻞﯾﺎﻓ ﭻﯿﻫ \x1b[40m`);
            return null;
        }

        const configObject =
        {
            metadata:
            {
              sourceFolder: basename(folderPath),
              absolutePath: normalizePath(folderPath),
              fileTypes: [...new Set(files.map(f => f.ext))],
              totalFiles: files.length,
              totalSize: files.reduce((sum, file) => sum + file.size, 0)
            },
            files: {}
        };

        files.forEach(file =>
        {
            const fileName = basename(file.path, extname(file.path));
            configObject.files[fileName] = `./${normalizePath(join(relativePath, file.path))}`;
        });

        const jsonContent = JSON.stringify(configObject, null, 2);

        const configPath = join(projectDir, "kytkat.config.json");
        writeFileSync(configPath, jsonContent);

        console.log(`\x1b[43m ✅ kytkat : \x1b[40m
        \x1b[42m|🇺🇸 File kytkat.Config.json Created successfully \x1b[40m
        \x1b[42m|🇮🇷 ﻞﯾﺎﻓ kytkat.Config.json ﺪﺷ ﺩﺎﺠﯾﺍ ﺖﯿﻘﻓﻮﻣ ﺎﺑ! \x1b[40m`);
        console.log(`\x1b[43m 📁 kytkat : \x1b[40m
        \x1b[42m|🇺🇸 Number of files processed: ${files.length} \x1b[40m
        \x1b[42m|🇮🇷 ﻩﺪﺷ ﺵﺯﺍﺩﺮﭘ ﯼﺎﻫﻞﯾﺎﻓ ﺩﺍﺪﻌﺗ: ${files.length} \x1b[40m`);
        console.log(`\x1b[43m 📝 kytkat : \x1b[40m
        \x1b[42m|🇺🇸 File path: ${configPath} \x1b[40m
        \x1b[42m|🇮🇷 ﻞﯾﺎﻓ ﺮﯿﺴﻣ: ${configPath} \x1b[40m`);

        return configPath;
    }
    catch (error)
    {
        console.error(`\x1b[43m ❌ kytkat : \x1b[40m
        \x1b[41m|🇺🇸 Error processing folder ${folderPath}: ${error.message} \x1b[40m
        \x1b[41m|🇮🇷 ﻪﺷﻮﭘ ﺵﺯﺍﺩﺮﭘ ﺭﺩ ﺎﻄﺧ ${folderPath}: ${error.message} \x1b[40m`);
        return null;
    }
}

const args = process.argv.slice(2);
const { command, folderName, types, help, depth } = parseArgs(args);

if (help || !command)
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
    `);
} 
else if (command === "generate")
{
    try
    {
        const projectDir = process.cwd();
        console.log(`\x1b[43m 📂 kytkat : \x1b[40m
        \x1b[44m|🇺🇸 Current project path: ${projectDir} \x1b[40m
        \x1b[44m|🇮🇷 ﻩﮊﻭﺮﭘ ﯼﺭﺎﺟ ﺮﯿﺴﻣ: ${projectDir} \x1b[40m`);

        if (folderName)
        {
            const foundFolders = findFoldersRecursively(projectDir, folderName, depth);
          
            if (foundFolders.length === 0)
            {
                console.error(`\x1b[43m ❌ kytkat : \x1b[40m
                \x1b[41m|🇺🇸 No folder with the name '${folderName}' found \x1b[40m
                \x1b[41m|🇮🇷 !ﺪﺸﻧ ﺖﻓﺎﯾ '${folderName}' ﻡﺎﻧ ﺎﺑ ﯼﺍﻪﺷﻮﭘ ﭻﯿﻫ \x1b[40m`);
                console.log(`\x1b[43m 🔍 kytkat : \x1b[40m
                \x1b[44m|🇺🇸 Search to depth ${depth} folder done \x1b[40m
                \x1b[44m|🇮🇷 ﺪﺷ ﻡﺎﺠﻧﺍ ﻪﺷﻮﭘ ${depth} ﻖﻤﻋ ﺎﺗ ﻮﺠﺘﺴﺟ \x1b[40m`);
                process.exit(1);
            }
          
            await scanAndGenerateConfig(foundFolders[0], types);
        }
        else
        {
            const foundFolders = DEFAULT_FOLDERS
                .map(folder => join(projectDir, folder))
                .filter(folderPath => existsSync(folderPath));

            if (foundFolders.length === 0)
            {
                console.error(`\x1b[43m ❌ kytkat : \x1b[40m
                \x1b[41m|🇺🇸 None of the default folders were found \x1b[40m
                \x1b[41m|🇺🇸 Default folders: ${DEFAULT_FOLDERS.join(", ")} \x1b[40m

                \x1b[44m|🇮🇷 ﺪﺸﻧ ﺖﻓﺎﯾ ﺽﺮﻓﺶﯿﭘ ﯼﺎﻫﻪﺷﻮﭘ ﺯﺍ ﮏﯾ ﭻﯿﻫ! \x1b[40m
                \x1b[44m|🇮🇷 ﺽﺮﻓﺶﯿﭘ ﯼﺎﻫﻪﺷﻮﭘ: ${DEFAULT_FOLDERS.join(", ")} \x1b[40m`);
                process.exit(1);
            }

            await scanAndGenerateConfig(foundFolders[0], types);
        }
    }
    catch (error)
    {
        console.error(`\x1b[43m ❌ kytkat : \x1b[40m
        \x1b[44m|🇺🇸 General error: ${error.message} \x1b[40m
        \x1b[44m|🇮🇷 ﯽﻠﮐ ﯼﺎﻄﺧ: ${error.message} \x1b[40m`);
        process.exit(1);
    }
}
else
{
    console.error(`\x1b[43m ❌ kytkat : \x1b[40m
    \x1b[41m|🇺🇸 Irrelevant command \x1b[40m
    \x1b[44m To view the guide, use the following command: \x1b[40m
    \x1b[46m kytkat help \x1b[40m

    \x1b[41m|🇮🇷 ﺮﺒﺘﻌﻣﺎﻧ ﺭﻮﺘﺳﺩ! \x1b[40m
    \x1b[44m ﺪﯿﻨﮐ ﻩﺩﺎﻔﺘﺳﺍ ﺮﯾﺯ ﺭﻮﺘﺳﺩ ﺯﺍ ﺎﻤﻨﻫﺍﺭ ﻩﺪﻫﺎﺸﻣ ﯼﺍﺮﺑ: \x1b[40m
    \x1b[46m kytkat help \x1b[40m`);
    process.exit(1);
}
