import React from 'react';

export default function Prizes() {
  return (
    <div>
      <div className="p-8 flex flex-col items-center bg-slate-950 md:py-32 py-20">
        <div className="flex flex-col max-w-screen-xl items-start w-full">
          <div className="w-full gap-12 flex flex-col max-w-3xl">
            <div className="flex-1">
              <h1 className="font-mono leading-tight text-5xl md:text-6xl pb-4 text-sky-300 font-bold bg-gradient-to-b from-gray-300 to-gray-400 text-transparent bg-clip-text"> Prizes </h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col max-w-screen-xl items-start w-full">
          <div className="w-full gap-12 flex flex-col lg:flex-row ">
            <div className="flex-1 pt-8">
              <h2 className="text-white text-3xl font-mono bg-slate-900 rounded-t border border-slate-700 p-4">Individual Prizes</h2>
              <ul className="rounded-b bg-slate-800 p-4 pl-8 list-disc border text-lg border-slate-700">
                <li>4x $25 Art of Problem Solving Gift Cards</li>
                <li>3x $200 X-Camp Class Coupons</li>
                <li>3x $150 X-Camp Class Coupons</li>
                <li>3x $100 X-Camp Class Coupons</li>
                <li>2x JBL Go Essential Waterproof IPX7 Portable Bluetooth Speaker</li>
                <li>2x Belkin SoundForm Mini Wireless Bluetooth Headphones for Kids</li>
                <li>1x Razer - Huntsman V2 TKL Wired Gaming Keyboard</li>
                <li>1x Sony - WH-CH520 Wireless Headphone</li>
                <li>$50 X-Camp Class Coupons for EVERYONE</li>
              </ul>
            </div>
            <div className="flex-1 pt-8">
              <h2 className="text-white text-3xl font-mono bg-slate-900 rounded-t border border-slate-700 p-4">School Prizes</h2>
              <ul className="rounded-b bg-slate-800 p-4 pl-8 list-disc text-lg border border-slate-700">
                <li>Website banner</li>
                <li>$300 donation to computer science department</li>
                <br />
                <br />
                <br />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
