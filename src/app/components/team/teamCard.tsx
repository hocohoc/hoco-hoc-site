import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

type TeamMember = {
    name: string;
    position: string;
    image: string;
    github?: string;
};

type TeamProps = {
    member: TeamMember;
};

export default function TeamCard(props: TeamProps) {
    const { member } = props;

    return (
        <div className="w-full h-full">
            <div className="w-full h-full bg-gray-900 p-4 rounded-md flex items-center sm:items-stretch border border-gray-800 drop-shadow-2xl justify-center">
                <div className='flex items-center justify-center'>
                    <Image src={member.image} alt={member.name} width={80} height={80} className="w-20 h-20 object-cover rounded-full" />
                </div>
                <div className="ml-4 flex flex-1 flex-col justify-center flex-grow">
                    <div className="text-base md:text-lg lg:text-lg font-semibold text-white mb-1">{member.name}</div>
                    <div className="text-base md:text-[0.8rem] lg:text-base text-slate-400 leading-snug mb-1">{member.position}</div>
                    {member.github && <Link href={member.github}>
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-slate-400"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"></path></svg>
                    </Link>}
                </div>
            </div>
        </div>
    );
}
