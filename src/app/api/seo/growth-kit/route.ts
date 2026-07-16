import { SEO_WEEKLY_PLAYBOOK } from "@/lib/seoWeeklyPlaybook";
import { SHORT_FORM_DEMO_SCRIPTS, DIRECTORY_LISTINGS } from "@/lib/marketingDistribution";

/** Growth ops payloads for marketing + SEO cadence. */
export async function GET() {
  return Response.json({
    weeklySeo: SEO_WEEKLY_PLAYBOOK,
    shortFormScripts: SHORT_FORM_DEMO_SCRIPTS,
    directories: DIRECTORY_LISTINGS,
  });
}
