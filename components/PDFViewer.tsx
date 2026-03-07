"use client"

import { Document, Page, pdfjs } from "react-pdf"
import { useState } from "react"

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

export default function PDFViewer({ file }: { file: string }) {
  const [numPages, setNumPages] = useState<number>(0)

  function onLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

    return (
      <div className="flex-1 h-full overflow-auto touch-pan-y">
        <Document
          file={file}
          onLoadSuccess={onLoadSuccess}
          loading="Cargando PDF..."
        >
          {Array.from(new Array(numPages), (_, i) => (
            <Page key={i} pageNumber={i + 1} width={700} />
          ))}
        </Document>
      </div>
    )
}