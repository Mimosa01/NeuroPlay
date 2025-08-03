export function getWeightColors(weight: number | string): { 
  line: string; 
  text: string; 
  arrow: string 
} {
  const weightValue = parseFloat(weight.toString()) || 0;
  
  if (weightValue > 0) {
    return {
      line: '#10b981',    // green-500
      text: '#059669',    // emerald-600
      arrow: '#10b981'
    };
  }
  
  if (weightValue < 0) {
    return {
      line: '#ef4444',    // red-500
      text: '#dc2626',    // rose-600
      arrow: '#ef4444'
    };
  }
  
  return {
    line: '#94a3b8',      // slate-400
    text: '#64748b',      // slate-500
    arrow: '#94a3b8'
  };
}

export function getLineWidth(weight: number | string): number {
  const weightValue = Math.abs(parseFloat(weight.toString()) || 0);
  return Math.min(3, 1 + weightValue * 1.5); // от 1 до 3px
}