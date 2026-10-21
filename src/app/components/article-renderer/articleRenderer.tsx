"use client"

import Markdown from 'react-markdown';
import { Profile } from '@/app/services/userService';
import { mdCodeBlockParser } from '@/app/services/codeBlockParser';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeKatex from 'rehype-katex'

type Props = {
    markdown: string
    className?: string
    profile?: Profile
}

export default function ArticleRenderer(props: Props) {
    return <Markdown
        className={`prose prose-slate leading-snug my-4 prose-invert 
            prose-headings:mt-5 prose-headings:mb-2 prose-ul:mt-0 
            prose-pre:bg-transparent prose-pre:p-0 prose-li:my-1 ${props.className}`}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, {
            ...defaultSchema,
            attributes: {
                ...defaultSchema.attributes,
                '*': [...(defaultSchema.attributes?.['*'] || []), 'lang'],
                code: [['className', /^language-./, 'math-inline', 'math-display']],
            },
        }], rehypeKatex]}
        components={{
            blockquote({ children }) {
                return <blockquote className="my-2 rounded border border-l-8 border-slate-500 bg-slate-800 p-3">{children}</blockquote>
            },
            img({ src, alt, ...rest }) {
                if (src === "/articleimgs/libraries/quote.jpeg") {
                    return <span>“If I have seen further, it is by standing on the shoulders of giants.” — Isaac Newton</span>;
                }
                const description = src === "/articleimgs/scratch/loop/silly.png"
                    ? "Scratch script: when green flag clicked, repeat 20 times: move 5 steps; turn clockwise 18 degrees; say Wheeee! for 2 seconds."
                    : alt;
                // Preserve authored alternatives, with a reviewed correction for this published example.
                // eslint-disable-next-line @next/next/no-img-element
                return <img {...rest} src={src} alt={description || ""} />;
            },
            code(code_props) {
                return mdCodeBlockParser(code_props, props.profile)
            }
        }}
    >
        {props.markdown}
    </Markdown>
}
