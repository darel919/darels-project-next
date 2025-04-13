import ErrorState from "@/components/ErrorState";

export default function UnauthorizedPage() {
  return (
    <ErrorState 
      message="Unauthorized" 
      actionText="Return to Home"
      actionDesc="You are not authorized to access this path."
      action="home"
    />
  );
}