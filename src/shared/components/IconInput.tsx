export const IconInput = ({ 
  icon: Icon, 
  label, 
  helpText,
  ...props 
}: { 
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  helpText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-slate-500" />
      <label className="font-medium text-sm">{label}</label>
    </div>
    <input
      {...props}
      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    />
    {helpText && (
      <div className="text-xs text-slate-500 pl-6">
        {helpText}
      </div>
    )}
  </div>
);