import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, ExternalLink, ImageIcon, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ShareReport } from "@shared/schema";

interface ShareReportWithUser extends ShareReport {
  user: {
    id: number;
    fullName: string;
    phone: string;
    country: string;
  };
}

function getSafeShareLink(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

export default function AdminShareReports() {
  const { toast } = useToast();
  const [imageModal, setImageModal] = useState<string | null>(null);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const { data: reports = [], isLoading } = useQuery<ShareReportWithUser[]>({
    queryKey: ["/api/admin/share-reports", status],
    queryFn: async () => {
      const response = await fetch(`/api/admin/share-reports?status=${status}`, { credentials: "include" });
      if (!response.ok) throw new Error("Unable to load share reports");
      return response.json();
    },
  });

  const processReport = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: "approve" | "reject" }) => {
      const response = await apiRequest("POST", `/api/admin/share-reports/${id}/${action}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Unable to process this report");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/share-reports"] });
      toast({ title: "Rapport traité" });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {(["pending", "approved", "rejected", "all"] as const).map((item) => (
          <Button
            key={item}
            size="sm"
            variant={status === item ? "default" : "outline"}
            onClick={() => setStatus(item)}
            className="whitespace-nowrap"
            data-testid={`button-filter-share-report-${item}`}
          >
            {item === "pending" ? "En attente" : item === "approved" ? "Approuvés" : item === "rejected" ? "Rejetés" : "Tous"}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Chargement des rapports…</p>
      ) : reports.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Aucun rapport de partage.</p>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id} className={report.status === "pending" ? "border-yellow-400/50" : ""}>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{report.user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{report.user.phone} · {report.user.country}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={report.status === "pending" ? "secondary" : report.status === "approved" ? "default" : "destructive"}>
                    {report.status === "pending" ? "En attente" : report.status === "approved" ? "Approuvé" : "Rejeté"}
                  </Badge>
                </div>

                {getSafeShareLink(report.shareLink) ? (
                  <a
                    href={getSafeShareLink(report.shareLink)!}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 break-all text-sm text-primary underline"
                    data-testid={`link-share-report-${report.id}`}
                  >
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    {report.shareLink}
                  </a>
                ) : (
                  <p className="text-sm text-destructive" data-testid={`text-unsafe-share-report-link-${report.id}`}>
                    Lien de partage non sécurisé
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setImageModal(report.proofImage)}
                  className="w-full overflow-hidden rounded-xl border border-border hover:border-primary"
                  data-testid={`button-share-report-proof-${report.id}`}
                >
                  <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    Ouvrir la preuve de partage
                  </div>
                  <img src={report.proofImage} alt={`Preuve de partage de ${report.user.fullName}`} className="max-h-40 w-full object-contain" />
                </button>

                {report.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 text-white hover:bg-green-700"
                      disabled={processReport.isPending}
                      onClick={() => processReport.mutate({ id: report.id, action: "approve" })}
                      data-testid={`button-approve-share-report-${report.id}`}
                    >
                      {processReport.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="mr-1 h-4 w-4" />Approuver</>}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={processReport.isPending}
                      onClick={() => processReport.mutate({ id: report.id, action: "reject" })}
                      data-testid={`button-reject-share-report-${report.id}`}
                    >
                      <X className="mr-1 h-4 w-4" />Rejeter
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!imageModal} onOpenChange={() => setImageModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Preuve de partage</DialogTitle>
          </DialogHeader>
          {imageModal && <img src={imageModal} alt="Preuve de partage" className="max-h-[70vh] w-full rounded-xl object-contain" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}