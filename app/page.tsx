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
    <div className="flex flex-row h-screen w-full">
      {/* PDF PRINCIPAL 70% */}
      <div className="flex-[7] border-r flex flex-col">
        {/* Contenedor con scroll independiente */}
        <div className="flex-1 h-0 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <PdfViewer url={`/pdfs/semana${semana}/leccion.pdf`} />
        </div>
      </div>

      {/* PANEL DERECHO 30% */}
      <div className="flex-[3] p-5 flex flex-col gap-2">
        {/* Selección de semana */}
        <select
          value={semana}
          onChange={(e) => setSemana(Number(e.target.value))}
          className="border p-2 rounded mb-2 w-full"
        >
          {Array.from({ length: 13 }, (_, i) => (
            <option key={i} value={i + 1}>Semana {i + 1}</option>
          ))}
        </select>

        {/* Botones tipo */}
        <div className="flex gap-2 mb-2">
          <button onClick={() => setTipo("visual")} className="border px-3 py-1 rounded flex-1">Visual</button>
          <button onClick={() => setTipo("resumen")} className="border px-3 py-1 rounded flex-1">Resumen</button>
          <button onClick={() => setTipo("preguntas")} className="border px-3 py-1 rounded flex-1">Preguntas</button>
        </div>

        {/* PDF secundario */}
        <div className="h-[300px] w-full overflow-y-auto border mb-2">
          <PdfViewer url={`/pdfs/semana${semana}/${tipo}.pdf`} />
        </div>

        {/* Biblia con scroll independiente */}
        <div className="h-[200px] overflow-y-auto border mb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
          <Biblia />
        </div>

        {/* Comentarios */}
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe tus comentarios aquí..."
          className="w-full h-[150px] p-2 mt-2 border rounded resize-none"
        />
      </div>
    </div>
  )
}