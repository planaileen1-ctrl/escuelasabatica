import { Worker, Viewer } from '@react-pdf-viewer/core';
import { scrollModePlugin } from '@react-pdf-viewer/scroll-mode';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/scroll-mode/lib/styles/index.css';

export default function PdfViewer({ url }: { url: string }) {
  const scrollModePluginInstance = scrollModePlugin();

  return (
    <div className="flex-1 h-full overflow-auto touch-pan-y">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.7.107/build/pdf.worker.min.js">
        <Viewer
          fileUrl={url}
          defaultScale={1.0}
          plugins={[scrollModePluginInstance]}
        />
      </Worker>
    </div>
  );
}