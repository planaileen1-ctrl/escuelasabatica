"use client"

import { useState, useEffect } from "react"
import Biblia from "@/components/Biblia"
import dynamic from "next/dynamic"
const PdfViewer = dynamic(() => import("@/components/PdfViewer"), { ssr: false })

export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const [editFecha, setEditFecha] = useState<string | null>(null);
    const [editTexto, setEditTexto] = useState("");
  function formatDateDMY(dateStr: string) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }
  const [semana, setSemana] = useState(1);
  const [tipo, setTipo] = useState("visual");
  const [comentariosPorFecha, setComentariosPorFecha] = useState<{ [fecha: string]: string }>({});
  const [comentario, setComentario] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showInput, setShowInput] = useState(false);

  function agregarVersiculo(v: string) {
    setComentario(prev => prev + "\n" + v);
  }

  useEffect(() => {
    const saved = localStorage.getItem("comentariosPorFecha");
    if (saved) setComentariosPorFecha(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("comentariosPorFecha", JSON.stringify(comentariosPorFecha));
  }, [comentariosPorFecha]);
  // Guardar comentario en base de datos (ejemplo)
  async function guardarComentario(fecha: string, texto: string) {
    // Aquí iría la lógica para guardar en Supabase
    // await supabase.from('comentarios').insert([{ fecha, texto }])
  }

  return (
    <div className="flex flex-row h-screen w-full">
      {/* PDF PRINCIPAL 70% */}
      <div className="flex-[7] border-r flex flex-col">
        {/* ...comentarios eliminados del lado izquierdo... */}
        {/* Contenedor con scroll independiente */}
        <div className="flex-1 h-0 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <PdfViewer url={`/pdfs/semana${semana}/${tipo === "leccion" ? "leccion" : tipo}.pdf`} />
        </div>
      </div>

      {/* PANEL DERECHO 30% */}
      <div className="flex-[2] p-3 flex flex-col gap-2">
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
          <button onClick={() => setTipo("leccion")} className="border px-3 py-1 rounded flex-1">Lección</button>
        </div>

        {/* Caja de comentarios guardados */}
        <div className="h-[300px] w-full overflow-y-auto border mb-2 bg-white p-2">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Comentarios guardados</span>
            <button className="border rounded px-2 py-1 text-xs bg-blue-500 text-white" onClick={() => setShowModal(true)}>
              Ver todos
            </button>
          </div>
          {Object.keys(comentariosPorFecha).length === 0 && (
            <div className="text-gray-500">No hay comentarios guardados.</div>
          )}
          {Object.entries(comentariosPorFecha)
            .filter(([fecha]) => !selectedDate || fecha === selectedDate)
            .map(([fecha, texto]) => (
              <div key={fecha} className="mb-4 border-b pb-2">
                <div>
                  <div className="text-xs text-gray-500 mb-1">{formatDateDMY(fecha)}</div>
                  <div className="text-base text-gray-800 whitespace-pre-line">{texto}</div>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <button className="text-xs px-2 py-1 border rounded bg-yellow-200 hover:bg-yellow-300" onClick={() => { setEditFecha(fecha); setEditTexto(texto); }}>Editar</button>
                  <button className="text-xs px-2 py-1 border rounded bg-red-200 hover:bg-red-300" onClick={() => {
                    setComentariosPorFecha(prev => {
                      const nuevo = { ...prev };
                      delete nuevo[fecha];
                      localStorage.setItem("comentariosPorFecha", JSON.stringify(nuevo));
                      return nuevo;
                    });
                  }}>Eliminar</button>
                </div>
                {editFecha === fecha && (
                  <div className="mt-2">
                    <textarea
                      value={editTexto}
                      onChange={e => setEditTexto(e.target.value)}
                      className="w-full h-[80px] p-2 border rounded resize-none mb-2"
                    />
                    <button className="border rounded p-2 bg-blue-600 text-white mr-2" onClick={() => {
                      setComentariosPorFecha(prev => {
                        const nuevo = { ...prev, [fecha]: editTexto };
                        localStorage.setItem("comentariosPorFecha", JSON.stringify(nuevo));
                        return nuevo;
                      });
                      setEditFecha(null);
                    }}>Guardar</button>
                    <button className="border rounded p-2 bg-gray-300 text-black" onClick={() => setEditFecha(null)}>Cancelar</button>
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Modal flotante para ver todos los comentarios */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 w-[400px] max-h-[80vh] overflow-y-auto relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setShowModal(false)}>
                ×
              </button>
              <div className="font-bold mb-4">Todos los comentarios</div>
              {Object.keys(comentariosPorFecha).length === 0 && (
                <div className="text-gray-500">No hay comentarios guardados.</div>
              )}
              {Object.entries(comentariosPorFecha)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([fecha, texto]) => (
                  <div key={fecha} className="mb-4 border-b pb-2">
                    <div className="text-xs text-gray-500 mb-1">{formatDateDMY(fecha)}</div>
                    <div className="text-base text-gray-800 whitespace-pre-line">{texto}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Biblia con scroll independiente */}
        <div className="h-[200px] overflow-y-auto border mb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
          <Biblia />
        </div>

        {/* Comentarios */}
        {/* Calendario y comentarios por fecha */}
        <div className="w-full mt-2">
          <input
            type="date"
            value={selectedDate}
            onChange={e => {
              setSelectedDate(e.target.value)
              setShowInput(true)
            }}
            className="border rounded p-2 w-full mb-2"
          />
          {showInput && selectedDate && (
            <div className="flex flex-col gap-2">
              <textarea
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                placeholder={`Comentario para ${selectedDate}`}
                className="w-full h-[100px] p-2 border rounded resize-none"
              />
              <button
                className="border rounded p-2 bg-blue-600 text-white"
                onClick={async () => {
                  setComentariosPorFecha(prev => {
                    const nuevo = { ...prev, [selectedDate]: comentario }
                    localStorage.setItem("comentariosPorFecha", JSON.stringify(nuevo))
                    return nuevo
                  })
                  alert("Comentario guardado")
                }}
              >Guardar comentario</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}