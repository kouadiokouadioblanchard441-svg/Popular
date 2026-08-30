import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { getCountryByCode } from "@/lib/countries";
import { getContent } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { ChevronLeft, Loader2, Trophy, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import type { Task } from "@shared/schema";
const tgoodLogo = "/tgood-logo.gif";
import taskPromoBanner from "@assets/generated_images/tgood-task-center-promo.jpg";
import iconBronze from "@assets/344464_1773318022355.png";
import iconArgent from "@assets/817729_1773318022328.png";
import iconOr from "@assets/sac-argent-gros-tas-illustration-icone-argent-comptant-icone-p_1773318022388.jpg";
import iconPlatine from "@assets/1751761_1773318022264.png";
import iconDiamant from "@assets/3275655_1773318022415.png";

interface TaskWithStatus extends Task {
  isCompleted: boolean;
  canClaim: boolean;
  currentInvites: number;
}

const TIER_COLORS = [
  { bg: "from-[#064b36] via-[#087a38] to-[#00a651]", surface: "bg-[#f1faf5]", border: "border-[#cbeada]" },
  { bg: "from-[#07586a] to-[#87ceeb]", surface: "bg-[#f0fbff]", border: "border-[#ccebf2]" },
  { bg: "from-[#8a4a12] to-[#f6a420]", surface: "bg-[#fff9ed]", border: "border-[#f8dfae]" },
  { bg: "from-[#0a6f58] to-[#52c7bc]", surface: "bg-[#effaf8]", border: "border-[#c6ebe5]" },
  { bg: "from-[#063d2b] via-[#087a38] to-[#2dbc74]", surface: "bg-[#f2faf6]", border: "border-[#c7e8d5]" },
  { bg: "from-[#315746] to-[#92c95a]", surface: "bg-[#f7fbf0]", border: "border-[#dcecc8]" },
];

const TIER_ICONS = [iconBronze, iconArgent, iconOr, iconPlatine, iconDiamant, iconBronze];

export default function TasksPage() {
  const { user, refreshUser } = useAuth();
  const { t } = useI18n();
  const { toast } = useToast();

  const { data: tasks, isLoading } = useQuery<TaskWithStatus[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });

  const TIER_LABELS = [
    t.taskTierBronze,
    t.taskTierSilver,
    t.taskTierGold,
    t.taskTierPlatinum,
    t.taskTierDiamond,
    t.taskTierElite,
  ];

  const claimMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await apiRequest("POST", `/api/tasks/${taskId}/claim`, {});
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      refreshUser();
      toast({ title: t.tasksRewardClaimed, description: t.tasksRewardClaimedDesc });
    },
    onError: (error: any) => {
      toast({ title: error.message || t.errorOccurred, variant: "destructive" });
    },
  });

  if (!user) return null;

  const countryInfo = getCountryByCode(user.country);
  const currency = "USDT";
  const totalTaskRewards = tasks?.filter(tk => tk.isCompleted).reduce((sum, tk) => sum + tk.reward, 0) || 0;
  const completedCount = tasks?.filter(tk => tk.isCompleted).length || 0;
  const claimableCount = tasks?.filter(tk => tk.canClaim && !tk.isCompleted).length || 0;

  const headerTitle = getContent(settings, "content_tasks_headerTitle", t.taskTierBronze ? t.team : "Programme de parrainage");
  const headerSubtitle = getContent(settings, "content_tasks_headerSubtitle", t.taskTierBronze ? t.salaryInviteDesc.replace("{0}", "") : "Invitez des amis et gagnez des récompenses");
  const tiersTitle = getContent(settings, "content_tasks_tiersTitle", t.taskTierBronze ? t.taskTierBronze.split(" ")[0] : "Niveaux de parrainage");
  const claimAllButton = getContent(settings, "content_tasks_claimAllButton", t.taskClaim);

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f8f5]">

      {/* Promotional TGOOD banner */}
      <div className="relative h-[276px] overflow-hidden">
        <img
          src={taskPromoBanner}
          alt="TGOOD electric mobility"
          className="h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(2,45,37,.96) 0%, rgba(2,45,37,.76) 41%, rgba(2,45,37,.13) 78%), linear-gradient(0deg, rgba(2,45,37,.76) 0%, transparent 58%)" }}
        />

        {/* Header nav */}
        <div className="absolute left-0 right-0 top-0 flex items-center px-4 pt-4">
          <Link href="/">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-sm"
              data-testid="button-back"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          </Link>
          <div className="flex-1 flex justify-center">
            <img src={tgoodLogo} alt="TGOOD" className="h-10 object-contain rounded" />
          </div>
          <div className="w-9" />
        </div>

        <div className="absolute bottom-[66px] left-5 right-24">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#87CEEB]/50 bg-[#022d25]/55 px-2.5 py-1 text-[9px] font-bold tracking-[.16em] text-[#d9f7ff] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f6a420]" />
            TGOOD
          </div>
          <h1 className="text-xl font-bold leading-tight text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            {headerTitle}
          </h1>
          <p className="mt-1 text-xs text-white/90" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
            {headerSubtitle}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mx-4 -mt-10 z-10 relative">
        <div className="flex items-center justify-between rounded-2xl border border-[#d8ece0] bg-white p-3 shadow-[0_10px_24px_rgba(5,84,57,.12)]">
          <div className="flex-1 border-r border-[#e4f0e9] text-center">
            <p className="text-lg font-bold text-[#087a38]" data-testid="text-total-rewards">
              {totalTaskRewards.toLocaleString()}
            </p>
            <p className="mt-0.5 text-[11px] text-[#5f7468]">{t.taskEarned} ({currency})</p>
          </div>
          <div className="flex-1 border-r border-[#e4f0e9] text-center">
            <p className="text-lg font-bold text-[#087a38]">{completedCount}</p>
            <p className="mt-0.5 text-[11px] text-[#5f7468]">{t.taskCompleted}</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-[#e88917]">{claimableCount}</p>
            <p className="mt-0.5 text-[11px] text-[#5f7468]">{t.taskClaimable}</p>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="mx-4 mt-4 mb-16">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[#087a38]" />
            <h2 className="text-sm font-bold text-[#173d2e]">{tiersTitle}</h2>
          </div>
          {claimableCount > 0 && (
            <button
              onClick={async () => {
                const claimable = tasks?.filter(tk => tk.canClaim && !tk.isCompleted) || [];
                for (const task of claimable) {
                  try { await claimMutation.mutateAsync(task.id); } catch {}
                }
              }}
              disabled={claimMutation.isPending}
              className="rounded-full bg-[#087a38] px-3 py-1.5 text-xs font-semibold text-white shadow-sm active:scale-95"
              data-testid="button-claim-rewards"
            >
              {claimAllButton} ({claimableCount})
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : tasks && tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map((task, index) => {
              const tier = TIER_COLORS[index] || TIER_COLORS[0];
              const label = TIER_LABELS[index] || `${t.tasksTierFallback} ${index + 1}`;
              const icon = TIER_ICONS[index] || TIER_ICONS[0];
              const progress = Math.min(
                (task.currentInvites / Math.max(task.requiredInvites, 1)) * 100,
                100,
              );
              const progressComplete = task.currentInvites >= task.requiredInvites;

              return (
                <div
                  key={task.id}
                  className={`flex flex-row overflow-hidden rounded-2xl border ${tier.border} ${tier.surface} shadow-[0_5px_14px_rgba(8,88,56,.08)]`}
                  data-testid={`task-item-${task.id}`}
                >
                  {/* Icon area — same width as product image */}
                  <div className={`shrink-0 w-20 flex items-center justify-center bg-gradient-to-br ${tier.bg}`} style={{ minHeight: 90 }}>
                    <img src={icon} alt={label} className="w-12 h-12 object-contain drop-shadow" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 px-3 py-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${tier.bg}`}>
                          {label}
                        </span>
                        {task.isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-[#087a38]" />}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[#688176]">{t.taskInviteDesc.replace("{0}", String(task.requiredInvites))}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[#688176]">{t.taskEarned}</span>
                          <span className="text-xs font-bold text-[#e88917]">+{task.reward.toLocaleString()} {currency}</span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/80">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${progressComplete ? "bg-[#00a651]" : "bg-[#087a38]"}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-[10px] text-[#688176]">{task.currentInvites}/{task.requiredInvites}</span>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="mt-2">
                      {task.isCompleted ? (
                        <span className="block rounded-lg bg-[#dff4e7] px-3 py-1 text-center text-[10px] font-semibold text-[#087a38]">
                          {t.taskDone}
                        </span>
                      ) : task.canClaim ? (
                        <button
                          onClick={() => !claimMutation.isPending && claimMutation.mutate(task.id)}
                          disabled={claimMutation.isPending}
                          className="flex w-full items-center justify-center gap-1 rounded-lg bg-[#087a38] py-1.5 text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
                          data-testid={`button-claim-${task.id}`}
                        >
                          {claimMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : t.taskClaim}
                        </button>
                      ) : (
                        <span className="block rounded-lg bg-white/70 px-3 py-1 text-center text-[10px] font-semibold text-[#7b9187]">
                          {t.taskWaiting}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-white/40 mx-auto mb-3" />
            <p className="text-white/70">{t.taskNone}</p>
          </div>
        )}
      </div>
    </div>
  );
}
