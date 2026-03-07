import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <html lang="es">
          <body style={{margin:0, padding:0}}>
            <div className="flex flex-col min-h-screen" style={{minHeight:'100vh'}}>
              <header className="bg-blue-900 text-white p-4">
                <h1 className="text-2xl font-bold">📖 Escuela Sabática</h1>
                <p className="text-sm opacity-80">Lección del trimestre | Estudio Bíblico Diario</p>
              </header>
              <div className="flex flex-1 overflow-hidden">
                {children}
              </div>
            </div>
          </body>
        </html>
  )
}