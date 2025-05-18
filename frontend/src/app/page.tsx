"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  const navigateToGame = () => {
    router.push("/game/start");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-blue-700 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider">アクロバスター</h1>
          <div className="hidden sm:block text-sm">IT用語パズルゲーム</div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <motion.div 
          className="max-w-4xl w-full mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-6 text-blue-800">GIGA.PE</h1>
          <p className="text-2xl mb-8 text-gray-700">
            IT知識を楽しく学べるパズルゲーム
          </p>

          <div className="bg-white p-8 rounded-xl shadow-lg mb-10 text-left">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">ゲーム概要</h2>
            <p className="mb-4 text-gray-700">
               &apos;アクロバスター.&apos; は、IT用語を探して学べる楽しいパズルゲームです。
              5×5のグリッドからIT用語を見つけ出し、制限時間内に多くの用語を完成させましょう。
              単語が長いほど高得点になり、連続正解でコンボボーナスも獲得できます！
            </p>
            <p className="text-gray-700">
              IT業界の専門用語を楽しみながら覚えて、知識を広げましょう。
            </p>
          </div>

          <motion.button
            className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-lg shadow-lg 
                      hover:bg-blue-700 transition-colors"
            onClick={navigateToGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ゲームを始める
          </motion.button>
        </motion.div>
      </main>

      <footer className="bg-gray-100 py-3 text-center text-gray-600 text-sm border-t border-gray-200">
        <p>© 2025 - アクロバスター. Acrobuster. - IT用語パズルゲーム</p>
      </footer>
    </div>
  );
}
