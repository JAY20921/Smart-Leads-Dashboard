import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Star, UserX, TrendingUp, Globe, Share2, Plus } from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { Topbar } from '../../components/layout/Topbar';
import { StatCard } from '../../components/dashboard/StatCard';
import { RecentLeads } from '../../components/dashboard/RecentLeads';
import { StatsRowSkeleton, SkeletonBlock } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/States';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/format';

// Instagram SVG inline (not exported by lucide-react in this version)
const InstagramIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useLeads({ limit: 100, page: 1, sort: 'latest' });

  const leads = data?.data ?? [];
  const stats = useMemo(() => ({
    total:     leads.length,
    new:       leads.filter((l) => l.status === 'New').length,
    qualified: leads.filter((l) => l.status === 'Qualified').length,
    lost:      leads.filter((l) => l.status === 'Lost').length,
    website:   leads.filter((l) => l.source === 'Website').length,
    instagram: leads.filter((l) => l.source === 'Instagram').length,
    referral:  leads.filter((l) => l.source === 'Referral').length,
  }), [leads]);

  const recentLeads = leads.slice(0, 8);
  const today = formatDate(new Date().toISOString());

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <Topbar title="Dashboard" subtitle={`${today} · Welcome back, ${user?.name?.split(' ')[0]}!`} />

      <div className="px-6 py-6 lg:px-8 space-y-6">
        {/* Stats */}
        {isLoading ? (
          <StatsRowSkeleton />
        ) : isError ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Leads"
              value={stats.total}
              subtitle="All time"
              icon={<Users size={20} />}
              color="brand"
            />
            <StatCard
              title="New"
              value={stats.new}
              subtitle="Awaiting action"
              icon={<TrendingUp size={20} />}
              color="blue"
              trend="up"
              trendValue={`${stats.total ? Math.round((stats.new / stats.total) * 100) : 0}% of total`}
            />
            <StatCard
              title="Qualified"
              value={stats.qualified}
              subtitle="Ready to close"
              icon={<Star size={20} />}
              color="green"
            />
            <StatCard
              title="Lost"
              value={stats.lost}
              subtitle="Closed - lost"
              icon={<UserX size={20} />}
              color="red"
            />
          </div>
        )}

        {/* Sources + Recent leads */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Source breakdown */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Lead Sources</h2>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <SkeletonBlock key={i} className="h-12" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Website',   value: stats.website,   icon: <Globe size={16} />,           color: 'bg-purple-500' },
                  { label: 'Instagram', value: stats.instagram, icon: <InstagramIcon size={16} />,   color: 'bg-pink-500'   },
                  { label: 'Referral',  value: stats.referral,  icon: <Share2 size={16} />,          color: 'bg-teal-500'   },
                ].map(({ label, value, icon, color }) => {
                  const pct = stats.total ? Math.round((value / stats.total) * 100) : 0;
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          {icon}
                          <span>{label}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {value} <span className="text-xs text-gray-400">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent leads */}
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Leads</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>
                View all →
              </Button>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3,4,5].map(i => <SkeletonBlock key={i} className="h-10" />)}
              </div>
            ) : (
              <RecentLeads leads={recentLeads} />
            )}
          </div>
        </div>

        {/* Quick action */}
        <div className="card p-5 bg-gradient-to-r from-brand-600 to-brand-700 border-brand-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Add a New Lead</h2>
              <p className="text-sm text-brand-200 mt-0.5">Capture and track your next opportunity</p>
            </div>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/leads?create=1')}
              leftIcon={<Plus size={16} />}
              className="flex-shrink-0 bg-white text-brand-700 hover:bg-brand-50 border-white"
            >
              New Lead
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
