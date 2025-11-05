import Link from 'next/link';
import React from "react"
import Image from "next/image"

type Member = {
    name: string
    position: string
    image: string
}

export default function TeamCard(props: { member: Member }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="rounded-full overflow-hidden">
                <Image src={props.member.image} alt={`${props.member.name}, ${props.member.position}`} width={80} height={80} className="w-20 h-20 object-cover" />
            </div>
            <div className="text-center">
                <p className="text-md font-bold">{props.member.name}</p>
                <p className="text-sm text-slate-400">{props.member.position}</p>
            </div>
        </div>
    )
}
