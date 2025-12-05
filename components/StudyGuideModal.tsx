
import React, { useRef } from 'react';
import { X, Printer, BookOpen } from 'lucide-react';
import { GAME_TERMS } from '../constants';

interface StudyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudyGuideModal: React.FC<StudyGuideModalProps> = ({ isOpen, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    // Create a hidden iframe to print only the content we want
    const content = contentRef.current;
    if (!content) return;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Guía de Clasificación Contable</title>');
      printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
      printWindow.document.write(`
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap');
          body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .mono { font-family: 'JetBrains Mono', monospace; }
        </style>
      `);
      printWindow.document.write('</head><body >');
      printWindow.document.write(content.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      // Wait for styles/images to load slightly
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  // Group terms by classification
  const activos = GAME_TERMS.filter(t => t.classification === 'Activo');
  const pasivos = GAME_TERMS.filter(t => t.classification === 'Pasivo');
  const patrimonio = GAME_TERMS.filter(t => t.classification === 'Patrimonio');
  const ingresos = GAME_TERMS.filter(t => t.classification === 'Ingresos');
  const egresos = GAME_TERMS.filter(t => t.classification === 'Egresos');

  const Section = ({ title, items, colorClass, borderClass, bgClass }: any) => (
    <div className={`mb-6 rounded-lg border-2 ${borderClass} overflow-hidden break-inside-avoid shadow-sm`}>
      <div className={`${bgClass} p-2 border-b-2 ${borderClass}`}>
        <h3 className={`font-black text-center uppercase tracking-widest ${colorClass} text-sm md:text-base`}>{title}</h3>
      </div>
      <div className="p-3 bg-white">
        {/* Render as a compact grid of names only */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
          {items.map((term: any, idx: number) => (
            <li key={idx} className="flex items-center gap-1.5">
               <div className={`w-1.5 h-1.5 rounded-full bg-current ${colorClass} opacity-60`}></div>
               <span className="font-bold text-gray-700 mono text-xs leading-snug">{term.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ledger-900/80 backdrop-blur-sm">
      <div className="bg-gray-100 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header Controls */}
        <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-2 text-ledger-900">
            <BookOpen className="w-6 h-6 text-gold-500" />
            <h2 className="text-xl font-bold">Cuadro de Clasificación</h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-ledger-100 text-ledger-800 rounded-lg hover:bg-ledger-200 font-bold transition-colors"
            >
              <Printer className="w-4 h-4" /> Imprimir
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Scrollable Content (The "Paper") */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-500/10">
          
          {/* Printable Area Ref */}
          <div ref={contentRef} className="bg-white mx-auto shadow-2xl max-w-[1100px] p-6 md:p-10 aspect-[4/3] relative text-gray-800">
            
            {/* Watermark / Background decoration */}
            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center overflow-hidden">
               <div className="text-[200px] font-black transform -rotate-45 select-none">CUENTAS</div>
            </div>

            {/* Header of the Brochure */}
            <div className="text-center mb-6 border-b-4 border-ledger-900 pb-4">
              <h1 className="text-3xl md:text-4xl font-black text-ledger-900 tracking-tight mb-1">CUENTAS CONTABLES</h1>
              <p className="text-gold-600 font-bold tracking-widest uppercase text-sm">Estructura de Clasificación Financiera</p>
            </div>

            {/* Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              
              {/* Column 1: Activos (Usually the longest list) */}
              <div>
                 <Section 
                    title="Activo (Bienes y Derechos)" 
                    items={activos} 
                    colorClass="text-blue-800" 
                    borderClass="border-blue-200" 
                    bgClass="bg-blue-50" 
                 />
              </div>

              {/* Column 2: Pasivos + Capital + Resultados */}
              <div className="flex flex-col gap-6">
                <Section 
                    title="Pasivo (Deudas y Obligaciones)" 
                    items={pasivos} 
                    colorClass="text-red-800" 
                    borderClass="border-red-200" 
                    bgClass="bg-red-50" 
                 />

                 <Section 
                    title="Patrimonio / Capital" 
                    items={patrimonio} 
                    colorClass="text-purple-800" 
                    borderClass="border-purple-200" 
                    bgClass="bg-purple-50" 
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Section 
                        title="Ingresos" 
                        items={ingresos} 
                        colorClass="text-green-800" 
                        borderClass="border-green-200" 
                        bgClass="bg-green-50" 
                    />
                    <Section 
                        title="Egresos" 
                        items={egresos} 
                        colorClass="text-orange-800" 
                        borderClass="border-orange-200" 
                        bgClass="bg-orange-50" 
                    />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-400">
               <span>Un Contador en Apuros</span>
               <span>Hoja de Referencia</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudyGuideModal;
