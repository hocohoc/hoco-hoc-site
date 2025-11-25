import { ExtraProps, Options } from "react-markdown";
import { Profile } from "./userService";
import MultiCodeView from '../components/multi-code-view/MultiCodeView';
import { ClassAttributes, HTMLAttributes } from "react";

export function upperCaseFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.substring(1)
}

export const ALL_LANGUAGES = [
    "python",
    "java",
    "cpp",
    "blockly",
    "scratch"
]

export function truncate(text: string, chars: number): string {

    return text.length <= chars ? text : text.substring(0, chars) + "..."
}

export function mdCodeBlockParser(codeProps: (ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps), profile: Profile): JSX.Element {
    const { children, className, ...rest } = codeProps;
    let langs = className ? className.split('-')[1].split(',') : [];
    let examples = children ? (children as string).split('\n%%\n') : [];
    let out: string

    if (langs[langs.length - 1] == "out" && examples.length == langs.length) {
        langs.pop()
        out = examples.pop()
    }

    return (
        <MultiCodeView selected={profile ? profile.preferredLanguage : undefined} langs={langs} codeSamples={examples} output={out} />
    );
}
