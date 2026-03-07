"use client"


import { useState, useEffect } from "react"
import Biblia from "@/components/Biblia"
import dynamic from "next/dynamic"
const PdfViewer = dynamic(() => import("@/components/PdfViewer"), { ssr: false })

export default function Home() {

  const [semana, setSemana] = useState(1)
  const [tipo, setTipo] = useState("visual")
  const [comentario, setComentario] = useState("")

  function agregarVersiculo(v: string) {
    setComentario(prev => prev + "\n" + v)
  }

  useEffect(() => {
    const saved = localStorage.getItem("comentario")
    if (saved) setComentario(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem("comentario", comentario)
  }, [comentario])

  return (
    <div className="flex flex-col md:flex-row h-screen">

      {/* PDF principal */}
      <div className="flex-1 border-r overflow-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <PdfViewer url={`/pdfs/semana${semana}/leccion.pdf`} />
      </div>

      {/* Panel derecho */}
      <div className="flex-1 p-5 flex flex-col">

        {/* Controles */}
        <select value={semana} onChange={(e) => setSemana(Number(e.target.value))}>
          {Array.from({ length: 13 }, (_, i) => (
            <option key={i} value={i+1}>Semana {i+1}</option>
          ))}
        </select>

        <div className="my-2 flex gap-2">
          <button onClick={() => setTipo("visual")}>Visual</button>
          <button onClick={() => setTipo("resumen")}>Resumen</button>
          <button onClick={() => setTipo("preguntas")}>Preguntas</button>
        </div>

        {/* PDF secundario con altura fija */}
        <div style={{ height: '300px', width: '100%', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <PdfViewer url={`/pdfs/semana${semana}/${tipo}.pdf`} />
        </div>

        <Biblia />

        {/* Comentarios */}
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe tus comentarios aquí..."
          style={{ width: '100%', height: '150px', padding: '10px', marginTop: '10px' }}
        />
      </div>
    </div>
  )
}