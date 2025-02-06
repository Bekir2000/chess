import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-black">Welcome to NextChess</h1>
      <p className="text-lg mb-8 text-black">Play chess with friends or challenge players from around the world!</p>
      <div className="flex space-x-4">
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Play Now
        </button>
        <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
          Join a Game
        </button>
      </div>
    </div>
  );
}
