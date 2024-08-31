// src/components/ui/switch.tsx
import React from 'react';

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange }) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
            />
            <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer ${checked ? 'peer-checked:after:translate-x-full peer-checked:bg-blue-600' : ''} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
        </label>
    );
};

export default Switch;