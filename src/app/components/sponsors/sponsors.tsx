import Image from 'next/image'

export default function Sponsors() {
  return <div className='flex flex-col w-full justify-center md:flex-row bg-gray-900 px-4 md:px-8 py-28 gap-9 md:gap-9 items-center '>
    <div className="max-w-screen-xl gap-16 flex flex-col w-full">
      <h1 className="text-4xl md:text-5xl font-bold"> Howard County Hour of Code is made possible by:</h1>
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-3xl text-amber-500">Gold</h1>
        <div className="flex flex-row flex-wrap justify-start items-center gap-4">
          <a href="https://x-camp.academy/" target='_blank' rel="noopener noreferrer">
            <Image src="/sponsors/xcamp.png" alt="X-Camp - Computer science education partner" width={150} height={128} className='h-24 md:h-32 w-auto bg-slate-200 rounded-lg p-2' />
          </a>
          <a href="https://ctp-web.com/" target='_blank' rel="noopener noreferrer">
            <Image src="/sponsors/ctp.png" alt="Columbia Technology Partners - Supporting tech education" width={150} height={128} className='h-24 md:h-32 w-auto bg-slate-200 rounded-lg p-2' />
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-3xl text-amber-500">Bronze</h1>
        <div className="flex flex-row flex-wrap justify-start items-center gap-4">
          <a href="https://artofproblemsolving.com/" target='_blank' rel="noopener noreferrer">
            <Image src="/sponsors/aops.png" alt="Art of Problem Solving - Math and science programs" width={150} height={128} className='h-24 md:h-32 w-auto bg-slate-200 rounded-lg p-2' />
          </a>
          <a href="https://www.interviewcake.com/" target='_blank' rel="noopener noreferrer">
            <Image src="/sponsors/cake_logo_white_on_blue.png" alt="Interview Cake - Technical interview preparation" width={150} height={128} className='h-24 md:h-32 w-auto bg-slate-200 rounded-lg p-2' />
          </a>
        </div>
      </div>
    </div>
  </div>
}
