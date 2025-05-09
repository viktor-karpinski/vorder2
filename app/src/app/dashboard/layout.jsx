import CalendarNavigation from "@/components/CalendarNavigation";
import Navigation from "@/components/Navigation";

const DashboardLayout = ({ children }) => {
  return (
    <div id="dashboard">
        <aside>
            <CalendarNavigation  />
        </aside>
        
        <main>
            { children}
        </main>

        <aside>
            <CalendarNavigation  />
        </aside>
    </div>
  );
}

export default DashboardLayout;