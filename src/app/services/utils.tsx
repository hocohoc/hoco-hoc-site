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
