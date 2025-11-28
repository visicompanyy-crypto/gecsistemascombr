import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, subscription, loading, subscriptionLoading } = useAuth();
  const queryClient = useQueryClient();
  const previousUserIdRef = useRef<string | null>(null);

  // Clear cache when user changes (security: prevent data leakage between users)
  useEffect(() => {
    const currentUserId = user?.id ?? null;
    
    if (previousUserIdRef.current !== null && 
        previousUserIdRef.current !== currentUserId) {
      console.log('User changed, clearing query cache for security');
      queryClient.clear();
    }
    
    previousUserIdRef.current = currentUserId;
  }, [user?.id, queryClient]);

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Require active subscription to access dashboard
  if (!subscription?.subscribed) {
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
}
