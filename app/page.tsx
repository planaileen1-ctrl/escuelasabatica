"use client"


import { useState, useEffect } from "react"
import Biblia from "@/components/Biblia"

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
    <div className="flex flex-col md:flex-row flex-1 h-screen overflow-hidden">

      {/* PDF PRINCIPAL */}
      <div className="flex-1 border-r overflow-auto" style={{ borderRight: "1px solid #ccc" }}>
        <iframe
          src={`/pdfs/semana${semana}/leccion.pdf`}
          width="100%"
          height="100%"
        />
      </div>

      {/* PANEL DERECHO */}
      <div className="flex-1 p-5 overflow-auto">

        <h2>Semana</h2>

        <select
          value={semana}
          onChange={(e) => setSemana(Number(e.target.value))}
        >
          {Array.from({ length: 13 }, (_, i) => (
            <option key={i} value={i + 1}>
              Semana {i + 1}
            </option>
          ))}
        </select>

        <hr />

        <button onClick={() => setTipo("visual")}>Visual</button>
        <br /><br />

        <button onClick={() => setTipo("resumen")}>Resumen</button>
        <br /><br />

        <button onClick={() => setTipo("preguntas")}>Preguntas</button>

        <hr />


        <iframe
          src={`/pdfs/semana${semana}/${tipo}.pdf`}
          width="100%"
          height="300"
        />

        <Biblia />

        <h3>Comentarios</h3>

        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe tus comentarios aquí..."
          style={{
            width: "100%",
            height: "150px",
            padding: "10px"
          }}
        />

      </div>

    </div>
  )
}