import base from "./base.json";
import ja from "./ja.json";
import {
  SlashCommandOption,
  UserOrMessageCommandOption,
} from "../../cloudcord";

const commands: Commands = {};
for (let [k, val] of Object.entries(base)) {
  if (k === "_") continue;
  let key = k as keyof typeof base;
  if ("description" in val && "description" in ja[key]) {
    const options: object[] = [];
    if ("options" in val && "options" in ja[key])
      for (let i in val.options) {
        let v = val.options[i] as Options;
        const j = ja[key] as Options;
        if ("options" in v) {
          for (let o in j.options[i].options!) {
            v.options![o] = {
              ...v.options![o],
              description_localizations: {
                ja: j.options[i].options![o].description,
              },
              name_localizations: {
                ja: j.options[i].options![o].name,
              },
            };
          }
        }
        options.push({
          ...v,
          name_localizations: {
            ja: j.options[i].name,
          },
          description_localizations: {
            ja: j.options[i].description,
          },
        });
      }
    commands[key] = {
      type: 1,
      description: val.description,
      description_localizations: {
        // @ts-ignore
        ja: ja[key].description,
      },
      // @ts-ignore
      options,
      // @ts-ignore
      default_member_permissions: val.default_member_permissions,
    };
  } else if ("name" in val && (val.type === 2 || val.type === 3)) {
    commands[key] = {
      type: val.type,
      name: val.name,
      name_localizations: {
        // @ts-ignore
        ja: ja[key].name,
      },
    };
  }
}

interface Commands {
  [key: string]: SlashCommandOption | UserOrMessageCommandOption;
}

export default commands;
export function format(...r: string[]): string {
  return r.reduce(
    (a, c, i) => a?.replace(new RegExp(`\\{${i}\\}`, "g"), c),
    r.shift()
  ) as string;
}

export const raw = {
  en: base,
  ja,
};

export type Options = {
  description: string;
  options: {
    description: string;
    name: string;
    description_localizations?: Record<string, string>;
    name_localizations?: Record<string, string>;
    options?: Options["options"];
  }[];
};
