export default function NotFound() {
  return <div className="w-full h-[calc(100vh-3.5rem-4rem)] bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col items-center justify-center p-4">
    <div className="flex items-center justify-center flex-col">
      <h1 className="font-mono font-extrabold text-6xl md:text-8xl mb-4"> 404 Not Found </h1>
      <p className="text-slate-400"> The page you are looking for does not exist. If you think this is a mistake, contact us. </p>
    </div>
  </div>
}
