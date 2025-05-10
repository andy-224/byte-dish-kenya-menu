
import AdminLayout from "@/components/admin/AdminLayout";
import FeedbackViewer from "@/components/admin/FeedbackViewer";

const FeedbackPage = () => {
  return (
    <AdminLayout 
      title="Customer Feedback" 
      subtitle="View and analyze customer feedback"
    >
      <FeedbackViewer />
    </AdminLayout>
  );
};

export default FeedbackPage;
