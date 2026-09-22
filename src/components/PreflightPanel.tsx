'use client';

import React from 'react';
import { useStore, ALBUM_SIZES } from '@/src/store/projectStore';
import { runPreflight } from '@/src/engine/preflight';
import { X, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { PreflightIssue } from '@/src/types';

export function PreflightPanel() {
  const open = useStore(s => s.ui.preflightOpen);
  const setUI = useStore(s => s.setUI);
  const project = useStore(s => s.history.present);
  const profiles = useStore(s => s.profiles);
  const goToPage = useStore(s => s.goToPage);
  const select = useStore(s => s.select);

  if (!open) return null;

  const size = ALBUM_SIZES[project.sizeId];
  const profile = profiles.find(p => p.id === project.printProfileId) ?? profiles[0];
  const issues = runPreflight(project, size, profile);

  const errors = issues.filter(i => i.level === 'error');
  const warnings = issues.filter(i => i.level === 'warning');
  const oks = issues.filter(i => i.level === 'ok');

  const jumpTo = (issue: PreflightIssue) => {
    if (issue.pageId) {
      const idx = project.pages.findIndex(p => p.id === issue.pageId);
      if (idx >= 0) goToPage(idx);
    }
    if (issue.slotId) select(issue.slotId, null);
    else if (issue.textId) select(null, issue.textId);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-8" onClick={() => setUI({ preflightOpen: false })}>
      <div
        className="bg-evr-panel border border-evr-border rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-evr-border">
          <div>
            <div className="font-semibold">Preflight</div>
            <div className="text-xs text-evr-muted">
              {size.label} · {profile.name} · {profile.dpi} DPI
            </div>
          </div>
          <button className="btn-ghost p-1" onClick={() => setUI({ preflightOpen: false })}>
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 p-3 border-b border-evr-border">
          <StatCard label="Errores" count={errors.length} color="#ef4444" />
          <StatCard label="Advertencias" count={warnings.length} color="#f59e0b" />
          <StatCard label="Correctos" count={oks.length} color="#22c55e" />
        </div>

        <div className="flex-1 overflow-y-auto scroll-thin p-3 space-y-2">
          {issues.map(issue => (
            <button
              key={issue.id}
              className="w-full text-left flex items-start gap-2 p-2 rounded hover:bg-evr-hover border border-evr-border"
              onClick={() => jumpTo(issue)}
            >
              <div className="mt-0.5">
                {issue.level === 'error' && <AlertCircle size={14} className="text-red-500" />}
                {issue.level === 'warning' && <AlertTriangle size={14} className="text-amber-500" />}
                {issue.level === 'ok' && <CheckCircle size={14} className="text-green-500" />}
              </div>
              <div className="flex-1">
                <div className="text-sm">{issue.message}</div>
                <div className="text-[10px] text-evr-muted mt-0.5">{issue.category}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="bg-evr-bg border border-evr-border rounded p-2 text-center">
      <div className="text-2xl font-semibold" style={{ color }}>{count}</div>
      <div className="text-[10px] text-evr-muted uppercase tracking-wide">{label}</div>
    </div>
  );
}
