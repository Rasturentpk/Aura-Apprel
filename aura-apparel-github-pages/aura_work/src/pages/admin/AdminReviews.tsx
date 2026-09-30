import React from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { Star, Check, X, Trash2, Award } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const { reviews, updateReview, deleteReview } = useAdmin();

  const handleToggleApprove = async (id: string, current: boolean) => {
    await updateReview(id, { isApproved: !current });
  };

  const handleToggleFeature = async (id: string, current: boolean) => {
    await updateReview(id, { isFeatured: !current });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this customer review?')) {
      await deleteReview(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900 uppercase">
          Review Moderation
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Approve, feature on homepage, or reject customer feedback for transparency.
        </p>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-600 uppercase font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Review Content</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-neutral-900">
                    {r.customerName}
                    {r.customerEmail && (
                      <span className="block text-[10px] text-neutral-400 font-normal">{r.customerEmail}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-neutral-600">{r.productName || 'General Store'}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="font-semibold text-neutral-900">{r.title}</p>
                    <p className="text-neutral-600 line-clamp-2">{r.comment}</p>
                  </td>
                  <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold w-fit ${
                          r.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {r.isApproved ? 'Approved' : 'Pending'}
                      </span>
                      {r.isFeatured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 w-fit">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleApprove(r.id, r.isApproved)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                          r.isApproved
                            ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                            : 'bg-emerald-800 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {r.isApproved ? 'Hide' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleToggleFeature(r.id, r.isFeatured)}
                        className={`p-1 rounded ${
                          r.isFeatured ? 'text-amber-600' : 'text-neutral-400 hover:text-black'
                        }`}
                        title="Feature on Homepage"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1 text-neutral-400 hover:text-red-600"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
