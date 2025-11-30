"use client"

import Markdown from 'react-markdown';
import { Profile } from '@/app/services/userService';
import { ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/solid"
import { mdCodeBlockParser } from '@/app/services/utils';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from "rehype-raw";

type Props = {
    markdown: string
    className?: string
    profile?: Profile
}

export default function ArticleRenderer(props: Props) {
    function blockStyles(type: string): string {
        if (type == "warn") {
            return "border-amber-500 bg-amber-600/30"
        } else if (type == "note") {
            return "border-sky-300 bg-sky-300/30"
        } else {
            return "border-slate-700 bg-slate-800"
        }
    }

    return <Markdown
        className={`prose prose-slate leading-snug my-4 prose-invert 
            prose-headings:mt-5 prose-headings:mb-2 prose-ul:mt-0 
            prose-pre:bg-transparent prose-pre:p-0 prose-li:my-1 ${props.className}`}
        remarkPlugins={[remarkParse, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
            blockquote(quote_props) {
                const { children, className, node, ...rest } = quote_props;
                let type: string;

                let content = children[1] ? children[1].props.children as string : ""

                if (content) {
                    if (content.trim().toLowerCase().startsWith(":note:")) {
                        type = "note"
                        content = content.replace(":note:", "")
                    } else if (content.trim().toLowerCase().startsWith(":warn:")) {
                        type = "warn"
                        content = content.replace(":warn:", "")
                    } else {
                        type = "block"
                    }
                }

                const Icon = () => {
                    if (type == "note") return <InformationCircleIcon className='w-7 h-7' />
                    else if (type == "warn") return <ExclamationTriangleIcon className='w-7 h-7' />
                    else return ""
                }

                return <div className={`my-2 flex flex-row items-center gap-2 border rounded border-l-8 p-2 ${blockStyles(type)}`}>
                    <div className='self-start'>{Icon()}</div>
                    <p className='m-0'>{content}</p>
                </div>
            },
            code(code_props) {
                return mdCodeBlockParser(code_props, props.profile)
            }
        }}
    >
        {props.markdown}
    </Markdown>
}
