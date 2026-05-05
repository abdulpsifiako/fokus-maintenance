import DashboardPage from "../../../../components/admin/dashboardPage";
import AdminLayout from "../../../layouts/adminLayout";

function Dashboard(){
    return(
        <>
        <div className="mb-10">
            <DashboardPage/>
        </div>
        </>
    )
}

Dashboard.getLayout = function getLayout(page){
    return<AdminLayout>{page}</AdminLayout>
}

export default Dashboard;