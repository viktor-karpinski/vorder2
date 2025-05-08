import CalendarNavigation from "@/components/CalendarNavigation";

const DashboardLayout = ({ children }) => {
  return (
    <div id="dashboard">
        <aside>
            <CalendarNavigation  />
        </aside>
        <main>
            { children}
        </main>
    </div>
  );
}

export default DashboardLayout;