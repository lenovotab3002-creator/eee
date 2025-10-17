import React, { useRef, useEffect, useState } from 'react';

const COLORS = ['#000000', '#EF4444', '#3B82F6', '#22C55E', '#F59E0B'];
const SIZES = [
    { value: 2, visual: 'h-0.5' },
    { value: 5, visual: 'h-1' },
    { value: 12, visual: 'h-1.5' },
    { value: 25, visual: 'h-2.5' },
];

const Whiteboard: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const sizeDropdownRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState(COLORS[0]);
    const [lineWidth, setLineWidth] = useState(5);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
        }

        const context = canvas.getContext('2d');
        if (!context) return;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.globalAlpha = 1;
        contextRef.current = context;
    }, []);
    
    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = lineWidth;
            contextRef.current.globalCompositeOperation = tool === 'pen' ? 'source-over' : 'destination-out';
        }
    }, [color, lineWidth, tool]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target as Node)) {
                setIsSizeDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getCoords = (e: React.MouseEvent | React.TouchEvent): { x: number, y: number } => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        
        let clientX, clientY;
        if (e.nativeEvent instanceof MouseEvent) {
            clientX = e.nativeEvent.clientX;
            clientY = e.nativeEvent.clientY;
        } else if (e.nativeEvent instanceof TouchEvent) {
            clientX = e.nativeEvent.touches[0].clientX;
            clientY = e.nativeEvent.touches[0].clientY;
        } else {
            return { x: 0, y: 0 };
        }
        
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const context = contextRef.current;
        if (!context) return;
        const { x, y } = getCoords(e);
        context.beginPath();
        context.moveTo(x, y);
        setIsDrawing(true);
    };

    const stopDrawing = () => {
        const context = contextRef.current;
        if (!context) return;
        context.closePath();
        setIsDrawing(false);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const context = contextRef.current;
        if (!context) return;
        const { x, y } = getCoords(e);
        context.lineTo(x, y);
        context.stroke();
    };
    
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    };
    
    const handleColorClick = (newColor: string) => {
        setColor(newColor);
        setTool('pen');
    };

    const handleEraserClick = () => {
        setTool('eraser');
    };

    return (
        <div className="w-full h-96 bg-white border border-slate-300 rounded-lg flex flex-col">
            <div className="p-2 border-b bg-slate-50 rounded-t-lg flex flex-wrap items-center gap-4">
                {/* Color Palette */}
                <div className="flex items-center gap-2">
                    {COLORS.map((c) => (
                        <button
                            key={c}
                            onClick={() => handleColorClick(c)}
                            className={`w-7 h-7 rounded-full transition-transform transform hover:scale-110 focus:outline-none ring-offset-2 ring-blue-500 ${tool === 'pen' && color === c ? 'ring-2' : ''}`}
                            style={{ backgroundColor: c }}
                            aria-label={`Color ${c}`}
                        />
                    ))}
                </div>
                
                <div className="h-6 w-px bg-slate-300" />
                
                {/* Brush Size Dropdown */}
                <div ref={sizeDropdownRef} className="relative flex items-center">
                    <button
                        onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                        className="p-1.5 rounded-md transition-colors hover:bg-slate-200 text-slate-600"
                        aria-label="Brush size"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div 
                        className={`absolute bottom-full mb-2 w-40 p-2 origin-bottom bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ease-out z-10
                        ${isSizeDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                    >
                        <div className="space-y-1">
                            {SIZES.map((size) => (
                                <button
                                    key={size.value}
                                    onClick={() => {
                                        setLineWidth(size.value);
                                        setIsSizeDropdownOpen(false);
                                        setTool('pen');
                                    }}
                                    className={`w-full flex items-center justify-between p-2 rounded-md text-left text-sm transition-colors ${lineWidth === size.value && tool === 'pen' ? 'bg-blue-100 text-blue-800' : 'text-slate-700 hover:bg-slate-100'}`}
                                >
                                    <span>{size.value}px</span>
                                    <div className="w-20 h-4 flex items-center">
                                        <div className={`bg-slate-800 rounded-full w-full ${size.visual}`}></div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="h-6 w-px bg-slate-300" />
                
                {/* Tools */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleEraserClick}
                        className={`p-1.5 rounded-md transition-colors ${tool === 'eraser' ? 'bg-blue-200 text-blue-800' : 'hover:bg-slate-200 text-slate-600'}`}
                        aria-label="Eraser"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-1 1v1H4a1 1 0 000 2h1v1a1 1 0 001 1h1v1a1 1 0 001 1h1v1a1 1 0 001 1h1v1a1 1 0 001 1H3a1 1 0 000-2h1V9H3a1 1 0 000-2h1V6H3a1 1 0 100-2h1V3a1 1 0 00-1-1H9zM15 1.5a1.5 1.5 0 00-3 0V3h3V1.5zM15 5H3l-1 1v11l1 1h12l1-1V6l-1-1zM9 15a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd"/>
                        </svg>
                    </button>
                    <button
                        onClick={clearCanvas}
                        className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label="Clear canvas"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex-grow w-full h-full">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full drawing-canvas"
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                />
            </div>
        </div>
    );
};

export default Whiteboard;
