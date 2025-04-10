export default function Loading() {
  return (
    <div className="flex items-center justify-center flex-col min-h-screen font-mono">
      <span className="loading loading-spinner loading-xl"></span>
      <p className="text-3xl mt-4 font-light">Please wait</p>
    </div>
  )
}