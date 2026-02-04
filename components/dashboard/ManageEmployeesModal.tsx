'use client';

import { useState, useMemo } from 'react';
import { X, Plus, Trash2, Users, KeyRound } from 'lucide-react';
import type { Role } from '@/lib/constants';
import { getRoleOrder } from '@/lib/constants';

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  createdAtIST: string | null;
  createdAtET: string | null;
};

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  DEVELOPER: 'Developer',
  DIGITAL_MARKETER: 'Digital Marketer',
};

const roleBadgeClass: Record<string, string> = {
  SUPER_ADMIN: 'bg-slate-200 text-slate-800',
  ADMIN: 'bg-slate-200 text-slate-800',
  DEVELOPER: 'bg-slate-200 text-slate-800',
  DIGITAL_MARKETER: 'bg-slate-200 text-slate-800',
};

export default function ManageEmployeesModal({
  employees,
  allowedRoles,
  currentUserId,
  allowedRolesForPasswordChange,
  onAdd,
  onDelete,
  onChangePassword,
  onClose,
}: {
  employees: UserRow[];
  allowedRoles: Role[];
  currentUserId: string;
  /** Roles whose password the current user is allowed to change (e.g. Admin: Developer, Digital Marketer) */
  allowedRolesForPasswordChange?: Role[];
  onAdd: (data: { email: string; password: string; name?: string; role: Role }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onChangePassword?: (id: string, newPassword: string) => Promise<void>;
  onClose: () => void;
}) {
  const sortedAllowedRoles = useMemo(
    () => [...allowedRoles].sort((a, b) => getRoleOrder(a) - getRoleOrder(b)),
    [allowedRoles]
  );
  const sortedEmployees = useMemo(
    () =>
      [...employees].sort(
        (a, b) =>
          getRoleOrder(a.role) - getRoleOrder(b.role) ||
          (a.name || a.email).localeCompare(b.name || b.email)
      ),
    [employees]
  );

  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>(() => sortedAllowedRoles[0] ?? allowedRoles[0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [changePasswordUserId, setChangePasswordUserId] = useState<string | null>(null);
  const [changePasswordValue, setChangePasswordValue] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await onAdd({ email: email.trim().toLowerCase(), password, name: name.trim() || undefined, role });
      setShowForm(false);
      setEmail('');
      setPassword('');
      setName('');
      setRole(sortedAllowedRoles[0]);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (id === currentUserId) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } catch {
      // ignore
    }
    setDeletingId(null);
  }

  const canChangePasswordFor = useMemo(() => {
    if (!onChangePassword || !allowedRolesForPasswordChange?.length) return () => false;
    return (u: UserRow) =>
      u.id !== currentUserId && allowedRolesForPasswordChange.includes(u.role);
  }, [onChangePassword, allowedRolesForPasswordChange, currentUserId]);

  async function handleChangePasswordSubmit() {
    if (!changePasswordUserId || !onChangePassword || changePasswordValue.trim().length < 6) return;
    setMessage('');
    setChangePasswordLoading(true);
    try {
      await onChangePassword(changePasswordUserId, changePasswordValue.trim());
      setChangePasswordUserId(null);
      setChangePasswordValue('');
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Failed to update password');
    }
    setChangePasswordLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-slate-50 shrink-0">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Users size={24} className="text-slate-600" />
          Manage employees
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-600">{sortedEmployees.length} employee(s)</p>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 text-white text-sm font-medium hover:bg-slate-800 shadow-md transition-colors"
            >
              <Plus size={18} />
              Add employee
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 text-sm"
                    placeholder="employee@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name (optional)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 text-sm"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 text-sm"
                  >
                    {sortedAllowedRoles.map((r) => (
                      <option key={r} value={r}>{roleLabel[r] ?? r}</option>
                    ))}
                  </select>
                </div>
              </div>
              {message && <p className="text-sm text-slate-700">{message}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  {loading ? 'Adding…' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {changePasswordUserId && (() => {
            const target = sortedEmployees.find((e) => e.id === changePasswordUserId);
            return (
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3">
                <KeyRound size={20} className="text-slate-600 shrink-0" />
                <span className="text-sm text-slate-700">
                  New password for <strong>{target?.email ?? changePasswordUserId}</strong>
                </span>
                <input
                  type="password"
                  value={changePasswordValue}
                  onChange={(e) => setChangePasswordValue(e.target.value)}
                  placeholder="Min 6 characters"
                  minLength={6}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 text-sm w-48"
                />
                <button
                  type="button"
                  onClick={handleChangePasswordSubmit}
                  disabled={changePasswordLoading || changePasswordValue.trim().length < 6}
                  className="px-3 py-2 rounded-lg bg-slate-700 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  {changePasswordLoading ? 'Updating…' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => { setChangePasswordUserId(null); setChangePasswordValue(''); setMessage(''); }}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm"
                >
                  Cancel
                </button>
              </div>
            );
          })()}

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="text-left p-3 font-medium text-slate-700">Email</th>
                  <th className="text-left p-3 font-medium text-slate-700">Name</th>
                  <th className="text-left p-3 font-medium text-slate-700">Role</th>
                  <th className="text-left p-3 font-medium text-slate-700">Created</th>
                  <th className="text-right p-3 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-slate-500 text-center">
                      No employees yet. Click &quot;Add employee&quot; to create one.
                    </td>
                  </tr>
                ) : (
                  sortedEmployees.map((u) => (
                    <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                      <td className="p-3 text-slate-900">{u.email}</td>
                      <td className="p-3 text-slate-600">{u.name ?? '—'}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${roleBadgeClass[String(u.role)] ?? 'bg-slate-100 text-slate-700'}`}>
                          {roleLabel[String(u.role)] ?? String(u.role)}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 text-xs">
                        {u.createdAtIST && u.createdAtET ? (
                          <span title={u.createdAtET}>
                            {u.createdAtIST}
                            <br />
                            <span className="text-slate-500">{u.createdAtET}</span>
                          </span>
                        ) : u.createdAt ? (
                          new Date(u.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {u.id !== currentUserId ? (
                          <div className="flex items-center justify-end gap-1">
                            {canChangePasswordFor(u) && (
                              <button
                                type="button"
                                onClick={() => { setChangePasswordUserId(u.id); setChangePasswordValue(''); setMessage(''); }}
                                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                                title="Change password"
                              >
                                <KeyRound size={18} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDelete(u.id)}
                              disabled={deletingId === u.id}
                              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                              title="Delete employee"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">(you)</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
