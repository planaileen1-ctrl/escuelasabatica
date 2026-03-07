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
    <div className="flex flex-row h-screen">

      {/* PDF PRINCIPAL */}
      <div className="flex-1 border-r overflow-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <PdfViewer url={`/pdfs/semana${semana}/leccion.pdf`} />
      </div>

      {/* PANEL DERECHO */}
      <div className="flex-1 p-5 flex flex-col overflow-auto">

        {/* Controles */}
        <select
          value={semana}
          onChange={(e) => setSemana(Number(e.target.value))}
          className="border p-1 rounded mb-2"
        >
          {Array.from({ length: 13 }, (_, i) => (
            <option key={i} value={i + 1}>Semana {i + 1}</option>
          ))}
        </select>

        <div className="flex gap-2 mb-2">
          <button onClick={() => setTipo("visual")} className="border px-3 py-1 rounded">Visual</button>
          <button onClick={() => setTipo("resumen")} className="border px-3 py-1 rounded">Resumen</button>
          <button onClick={() => setTipo("preguntas")} className="border px-3 py-1 rounded">Preguntas</button>
        </div>

        {/* PDF SECUNDARIO con altura fija */}
        <div style={{ height: '300px', width: '100%', overflow: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid #ccc', marginBottom: '10px' }}>
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