import { FileSpreadsheet, Table2, Calculator, FileX2, Trash2 } from "lucide-react";

export const TrashBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] via-[#f1f3f4] to-[#e8ebee]" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(#1a1a1a 1px, transparent 1px),
            linear-gradient(90deg, #1a1a1a 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Trash can illustrations - distributed across the background */}
      
      {/* Top left trash with spreadsheets */}
      <div className="absolute top-[8%] left-[5%] transform rotate-[-8deg] opacity-20">
        <div className="relative">
          <Trash2 className="w-32 h-32 text-gray-600" strokeWidth={1} />
          <FileSpreadsheet className="absolute -top-4 -right-2 w-12 h-12 text-green-600 transform rotate-[25deg]" />
          <Table2 className="absolute -top-6 left-4 w-10 h-10 text-blue-600 transform rotate-[-15deg]" />
        </div>
      </div>

      {/* Top right trash */}
      <div className="absolute top-[12%] right-[8%] transform rotate-[12deg] opacity-15">
        <div className="relative">
          <Trash2 className="w-28 h-28 text-gray-500" strokeWidth={1} />
          <Calculator className="absolute -top-5 -left-2 w-10 h-10 text-orange-600 transform rotate-[-20deg]" />
          <FileX2 className="absolute -top-3 right-2 w-8 h-8 text-red-500 transform rotate-[30deg]" />
        </div>
      </div>

      {/* Middle left trash */}
      <div className="absolute top-[40%] left-[3%] transform rotate-[5deg] opacity-15">
        <div className="relative">
          <Trash2 className="w-24 h-24 text-gray-500" strokeWidth={1} />
          <FileSpreadsheet className="absolute -top-4 right-0 w-9 h-9 text-green-500 transform rotate-[15deg]" />
        </div>
      </div>

      {/* Middle right trash - larger */}
      <div className="absolute top-[35%] right-[3%] transform rotate-[-10deg] opacity-20">
        <div className="relative">
          <Trash2 className="w-36 h-36 text-gray-600" strokeWidth={1} />
          <Table2 className="absolute -top-6 left-2 w-14 h-14 text-blue-500 transform rotate-[-25deg]" />
          <FileSpreadsheet className="absolute -top-8 right-4 w-11 h-11 text-green-600 transform rotate-[20deg]" />
          <Calculator className="absolute -top-2 -right-2 w-8 h-8 text-orange-500 transform rotate-[35deg]" />
        </div>
      </div>

      {/* Bottom left trash */}
      <div className="absolute bottom-[15%] left-[8%] transform rotate-[-5deg] opacity-18">
        <div className="relative">
          <Trash2 className="w-30 h-30 text-gray-500" strokeWidth={1} />
          <FileX2 className="absolute -top-4 left-1 w-10 h-10 text-red-400 transform rotate-[-10deg]" />
          <Table2 className="absolute -top-5 right-2 w-9 h-9 text-blue-400 transform rotate-[25deg]" />
        </div>
      </div>

      {/* Bottom right trash */}
      <div className="absolute bottom-[10%] right-[10%] transform rotate-[8deg] opacity-15">
        <div className="relative">
          <Trash2 className="w-26 h-26 text-gray-600" strokeWidth={1} />
          <FileSpreadsheet className="absolute -top-5 -left-1 w-11 h-11 text-green-500 transform rotate-[-20deg]" />
          <Calculator className="absolute -top-3 right-1 w-8 h-8 text-orange-400 transform rotate-[15deg]" />
        </div>
      </div>

      {/* Extra floating papers */}
      <div className="absolute top-[25%] left-[20%] opacity-10 transform rotate-[45deg]">
        <FileSpreadsheet className="w-16 h-16 text-green-600" />
      </div>
      
      <div className="absolute top-[60%] right-[20%] opacity-10 transform rotate-[-30deg]">
        <Table2 className="w-14 h-14 text-blue-600" />
      </div>

      <div className="absolute bottom-[30%] left-[25%] opacity-8 transform rotate-[20deg]">
        <Calculator className="w-12 h-12 text-orange-500" />
      </div>

      <div className="absolute top-[70%] left-[15%] opacity-10 transform rotate-[-15deg]">
        <FileX2 className="w-10 h-10 text-red-400" />
      </div>

      <div className="absolute bottom-[40%] right-[15%] opacity-8 transform rotate-[35deg]">
        <FileSpreadsheet className="w-14 h-14 text-green-500" />
      </div>
    </div>
  );
};
