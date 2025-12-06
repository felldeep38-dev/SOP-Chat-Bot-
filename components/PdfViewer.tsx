import React from 'react';

interface PdfViewerProps {
  url: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  return (
    <div className="w-full h-full bg-[#1e1e1e] flex flex-col">
       <div className="flex-1 w-full h-full relative">
          <iframe
            src={`${url}#toolbar=0&navpanes=0`}
            type="application/pdf"
            className="w-full h-full block border-none"
            title="SOP Document Viewer"
            style={{ width: '100%', height: '100%' }}
          />
       </div>
    </div>
  );
};

export default PdfViewer;