import { useState, useEffect } from "react";
import { PlacementHero } from "./components/PlacementHero";
import { ReadinessSection } from "./components/ReadinessSection";
import { OpportunitiesSection } from "./components/OpportunitiesSection";
import { PipelineSection } from "./components/PipelineSection";
import { JobDrawer } from "./components/JobDrawer";
import { Loader2 } from "lucide-react";
import { useStudentPlacementsStore } from "../../../store/useStudentPlacementsStore.js";

const STAGES = ["Applied", "Screening", "Interview", "Offer"];

function PlacementsPage() {
  const { profile, jobs, applications, loading, fetchData } = useStudentPlacementsStore();
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-blue-deep)]" />
      </div>
    );
  }

  // Calculate readiness items from profile
  const READINESS = [
    { label: "Resume reviewed", done: profile?.resumeReviewed || false },
    { label: "Portfolio live", done: profile?.portfolioLive || false },
    { label: "Mock interviews (target: 3)", done: (profile?.mockInterviewsCompleted || 0) >= 3, progress: `${profile?.mockInterviewsCompleted || 0}/3` },
    { label: "Applications sent (target: 10)", done: (profile?.applicationsSent || 0) >= 10, progress: `${profile?.applicationsSent || 0}/10` }
  ];

  const readinessScore = Math.round((READINESS.filter((r) => r.done).length / READINESS.length) * 100);

  return (
    <div className="space-y-8">
      <PlacementHero readinessScore={readinessScore} jobsCount={jobs.length} applicationsCount={applications.length} />
      <ReadinessSection readinessScore={readinessScore} readinessList={READINESS} profile={profile} />
      <OpportunitiesSection jobs={jobs} onSelectJob={setSelectedJob} />
      <PipelineSection stages={STAGES} applications={applications} />
      
      <JobDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}

export default PlacementsPage;