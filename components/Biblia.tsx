"use client"

import { useState, useEffect } from "react"

export default function Biblia() {

  const [biblia, setBiblia] = useState<any>({})
  const [libro, setLibro] = useState("")
  const [capitulo, setCapitulo] = useState("")

  useEffect(() => {
    fetch("/biblia/rvr1909.json")
      .then(r => r.json())
      .then(data => {
        console.log("BIBLIA DATA:", data)
        const estructura: any = {}
        data.verses.forEach((v: any) => {
          const libro = v.book_name
          const cap = String(v.chapter)
          const vers = String(v.verse)
          if (!estructura[libro]) estructura[libro] = {}
          if (!estructura[libro][cap]) estructura[libro][cap] = {}
          estructura[libro][cap][vers] = v.text
        })
        setBiblia(estructura)
      })
  }, [])

  const libros = Object.keys(biblia)
  const capitulos = libro ? Object.keys(biblia[libro]) : []

  return (
    <div>

      <h2>Biblia</h2>

      {/* selector libro */}
      <select
        value={libro}
        onChange={(e) => {
          setLibro(e.target.value)
          setCapitulo("")
        }}
      >
        <option value="">Seleccione libro</option>

        {libros.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}

      </select>


      {/* selector capitulo */}
      {libro && (
        <select
          value={capitulo}
          onChange={(e) => setCapitulo(e.target.value)}
        >
          <option value="">Capítulo</option>

          {capitulos.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}

        </select>
      )}


      {/* versiculos */}
      {libro && capitulo && (

        <div>

          {Object.keys(biblia[libro][capitulo]).map((v) => (

            <p key={v}>
              <b>{v}</b> {biblia[libro][capitulo][v]}
            </p>

          ))}

        </div>

      )}

    </div>
  )
}