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

      {/* PDF PRINCIPAL */}
      <div className="flex-1 flex flex-col h-screen border-r" style={{ borderRight: "1px solid #ccc" }}>
        <div className="flex-none p-3">
          {/* controles de semana y tipos */}
        </div>
        <div className="flex-1 overflow-hidden">
          <PdfViewer url={`/pdfs/semana${semana}/leccion.pdf`} />
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div className="w-full md:w-1/2 p-5 overflow-auto h-screen">
        <h2>Semana</h2>
        <select
          value={semana}
          onChange={(e) => setSemana(Number(e.target.value))}
          className="border p-1 rounded"
        >
          {Array.from({ length: 13 }, (_, i) => (
            <option key={i} value={i + 1}>
              Semana {i + 1}
            </option>
          ))}
        </select>

        <div className="flex gap-2 my-2">
          <button onClick={() => setTipo("visual")} className="border px-3 py-1 rounded">Visual</button>
          <button onClick={() => setTipo("resumen")} className="border px-3 py-1 rounded">Resumen</button>
          <button onClick={() => setTipo("preguntas")} className="border px-3 py-1 rounded">Preguntas</button>
        </div>

        <div style={{ height: "300px", width: "100%" }}>
          <PdfViewer url={`/pdfs/semana${semana}/${tipo}.pdf`} />
        </div>

        <Biblia />

        <h3 className="mt-4">Comentarios</h3>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe tus comentarios aquí..."
          className="w-full h-36 p-2 border rounded mt-2"
        />
      </div>
    </div>
  )
}