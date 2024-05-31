import { readdir } from "fs/promises";
import process from "process";
import {
  execFromRoot,
  resolvePathFromRoot
} from "scripts/tools/root.ts";

export default async function postversion(): Promise<void> {
  execFromRoot("git push");
  execFromRoot("git push --tags");

  const newVersion = process.env["npm_package_version"];

  const buildDir = resolvePathFromRoot("dist/build");
  const fileNames = await readdir(buildDir);
  const filePaths = fileNames.map(fileName => `${buildDir}/${fileName}`);
  const filePathsStr = filePaths.map(filePath => `"${filePath}"`).join(" ");

  execFromRoot(`gh release create "${newVersion}" ${filePathsStr} --title "v${newVersion}" --generate-notes`);
}
