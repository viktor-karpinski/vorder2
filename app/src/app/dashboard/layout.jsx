import CalendarNavigation from "@/components/CalendarNavigation";
import Navigation from "@/components/Navigation";

const DashboardLayout = ({ children }) => {
  return (
    <div id="dashboard">
        <aside className="side-box">
            <CalendarNavigation  />
        </aside>

        <main>
            { children}
        </main>
    </div>
  );
}

export default DashboardLayout;