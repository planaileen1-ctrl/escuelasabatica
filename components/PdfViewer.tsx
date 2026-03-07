"use client"
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

export default function PdfViewer({ url }: { url: string }) {
  return (
    <div 
      style={{ 
        height: '100%', 
        width: '100%', 
        overflow: 'auto', 
        WebkitOverflowScrolling: 'touch' // scroll suave en iPad
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={url} />
      </Worker>
    </div>
  );
}