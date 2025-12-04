import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import '../assets/css/PDFModal.css';

// Configurar el worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFModal = ({ isOpen, onClose, pdfUrl, titulo, onVisualizacionCompleta }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tiempoInicio] = useState(Date.now());

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error al cargar PDF:', error);
    setLoading(false);
  };

  const handleClose = () => {
    // Calcular tiempo de visualización en segundos
    const tiempoVisualizacion = Math.floor((Date.now() - tiempoInicio) / 1000);
    
    // Notificar al componente padre
    if (onVisualizacionCompleta) {
      onVisualizacionCompleta(tiempoVisualizacion);
    }
    
    // Reset
    setPageNumber(1);
    setNumPages(null);
    setLoading(true);
    onClose();
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="pdf-modal-overlay" onClick={handleClose}>
      <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-modal-header">
          <h2>{titulo}</h2>
          <button className="pdf-modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>
        
        <div className="pdf-modal-body">
          {loading && (
            <div className="pdf-modal-loading">
              <div className="spinner"></div>
              <p>Cargando documento...</p>
            </div>
          )}
          
          <div className="pdf-viewer-container" style={{ display: loading ? 'none' : 'flex' }}>
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="pdf-modal-loading">
                  <div className="spinner"></div>
                  <p>Cargando PDF...</p>
                </div>
              }
            >
              <Page 
                pageNumber={pageNumber} 
                width={800}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>

          {!loading && numPages && (
            <div className="pdf-navigation">
              <button 
                onClick={goToPrevPage} 
                disabled={pageNumber <= 1}
                className="pdf-nav-button"
              >
                ← Anterior
              </button>
              <span className="pdf-page-info">
                Página {pageNumber} de {numPages}
              </span>
              <button 
                onClick={goToNextPage} 
                disabled={pageNumber >= numPages}
                className="pdf-nav-button"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
        
        <div className="pdf-modal-footer">
          <p>📄 Lee el documento completo antes de continuar</p>
          <button className="pdf-modal-button" onClick={handleClose}>
            He leído el documento
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default PDFModal;
