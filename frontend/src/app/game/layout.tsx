export default function GameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="bg-blue-700 text-white py-4 px-6 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold tracking-wider">GIGA.PE</h1>
                    <div className="hidden sm:block text-sm">IT用語パズルゲーム</div>
                </div>
            </header>
            
            <main className="flex-grow">{children}</main>
            
            <footer className="bg-gray-100 py-3 text-center text-gray-600 text-sm border-t border-gray-200">
                <p>© 2025 GIGA.PE - IT用語パズルゲーム</p>
            </footer>
        </div>
    );
}
