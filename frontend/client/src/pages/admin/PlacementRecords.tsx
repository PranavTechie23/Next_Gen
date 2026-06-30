import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { toast } from "sonner";

const PLACEMENTS_PER_PAGE = 12;

export default function PlacementRecords() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [placements, setPlacements] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getApplications({
        page,
        limit: PLACEMENTS_PER_PAGE,
        search,
        status,
      });

      setPlacements(response.applications || []);
      setTotalPages(response.pagination?.totalPages || Math.max(1, Math.ceil((response.count || response.applications?.length || 0) / PLACEMENTS_PER_PAGE)));
    } catch (error) {
      console.error("Failed to load placement records", error);
      toast.error("Could not load placement records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPlacements();
  }, [page, search, status]);

  return (
    <div className="min-h-dvh bg-background transition-colors duration-300">
      <div className="container py-6 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => navigate("/admin/dashboard")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-black text-foreground">Placement Records</h1>
                <p className="text-sm text-muted-foreground">Browse historic placements with search, filters, and paging.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by student, company, role..."
                className="pl-10"
              />
            </div>
            <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
              <SelectTrigger className="w-full h-14 border border-border bg-background text-foreground rounded-xl text-base focus:ring-2 focus:ring-primary font-medium">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="placed">Placed</SelectItem>
                <SelectItem value="unplaced">Unplaced</SelectItem>
                <SelectItem value="at_risk">At Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">Page {page} of {totalPages}</Badge>
            <Badge variant="secondary">Page size {PLACEMENTS_PER_PAGE}</Badge>
            {loading && <Badge variant="secondary">Loading...</Badge>}
          </div>
        </div>

        <Card className="shadow-lg border border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-muted-foreground">
                <thead className="bg-background/90">
                  <tr>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.18em] text-[11px]">Student</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.18em] text-[11px]">Company</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.18em] text-[11px]">Role</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.18em] text-[11px]">Package (LPA)</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.18em] text-[11px]">Date</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.18em] text-[11px]">Branch</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.18em] text-[11px]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {placements.length > 0 ? (
                    placements.map((placement, idx) => (
                      <tr key={idx} className="border-t border-border/10 hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground">{placement.student}</td>
                        <td className="px-6 py-4 text-foreground">{placement.company}</td>
                        <td className="px-6 py-4 text-foreground">{placement.role || placement.designation || "N/A"}</td>
                        <td className="px-6 py-4 font-black text-primary">{placement.package || placement.ctc || "—"}</td>
                        <td className="px-6 py-4 text-muted-foreground">{placement.date || placement.placed_at || "—"}</td>
                        <td className="px-6 py-4 text-muted-foreground">{placement.branch}</td>
                        <td className="px-6 py-4">
                          <Badge variant={placement.status?.toLowerCase() === "placed" ? "outline" : "secondary"}>
                            {placement.status || "Placed"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-muted-foreground">
                        {loading ? "Loading placement records..." : "No placement records found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">Showing up to {PLACEMENTS_PER_PAGE} records per page</div>
        </div>
      </div>
    </div>
  );
}
