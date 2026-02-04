'use client';

import { useState } from 'react';
import { Trash2, Cloud, RefreshCw, Save, Power } from 'lucide-react';

const actions = [
  { id: 'cache', label: 'Clear Cache', icon: Trash2 },
  { id: 'cdn', label: 'Purge CDN', icon: Cloud },
  { id: 'rebuild', label: 'Rebuild Site', icon: RefreshCw },
  { id: 'backup', label: 'Backup Trigger', icon: Save },
  { id: 'maintenance', label: 'Maintenance Mode', icon: Power },
] as const;

export default function DeveloperDashboardTools() {
  const [maintenanceOn, setMaintenanceOn] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleAction = (id: string, label: string) => {
    if (id === 'maintenance') {
      setMaintenanceOn((v) => !v);
      setLastAction(`${label}: ${maintenanceOn ? 'Off' : 'On'}`);
    } else {
      setLastAction(`${label} triggered (mock)`);
    }
    setTimeout(() => setLastAction(null), 3000);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleAction(id, label)}
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
            id === 'maintenance' && maintenanceOn
              ? 'border-slate-400 bg-slate-100 text-slate-800'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Icon className="h-4 w-4" />
          {id === 'maintenance' && maintenanceOn ? 'Maintenance On' : label}
        </button>
      ))}
      {lastAction != null && (
        <p className="w-full text-sm text-slate-500">{lastAction}</p>
      )}
    </div>
  );
}
