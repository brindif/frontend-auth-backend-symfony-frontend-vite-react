import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function RouteChangeListener({
  onPathChange,
}: {
  onPathChange: (pathname: string) => void;
}) {
  const location = useLocation();

  useEffect(() => {
    onPathChange(location.pathname);
  }, [location.pathname, onPathChange]);

  return null;
}
