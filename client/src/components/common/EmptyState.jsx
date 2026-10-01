import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = ShieldAlert,
  title = 'No Data Found',
  description = 'There are currently no records available to display.',
  actionText,
  actionLink,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center bg-[#111C2E] rounded-lg border border-dashed border-[#243247] ${className}`}
    >
      <div className="w-12 h-12 rounded-lg bg-[#0B1220] border border-[#243247] flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <p className="mt-1 text-xs text-slate-400 max-w-sm">{description}</p>
      
      {(actionText && (actionLink || onAction)) && (
        <div className="mt-5">
          {actionLink ? (
            <Link
              to={actionLink}
              className="vg-btn-primary"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="vg-btn-primary"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

