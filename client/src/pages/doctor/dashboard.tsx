
import { ChartAreaInteractive } from "@/components/common/chart-area-interactive"
import { SectionCards } from "@/components/common/section-cards"
import { DoctorTable } from "@/components/doctor/doctor-table"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { doctorChartCategories, doctorChartData, doctorStats } from "@/data/doctor"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards data={doctorStats}/>
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={doctorChartData} categories={doctorChartCategories} />
              </div>
              <DoctorTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
