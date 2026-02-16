import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate as useNavigateNative, useNavigationType, useLocation } from "react-router-dom";
import { useWarnAboutChange } from "@refinedev/core";
import { useUnsavedConfirm } from "../Modal";

export function useNavigate() {
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const { showUnsavedConfirm } = useUnsavedConfirm();
  const navigationType = useNavigationType();
  const location = useLocation();
  const [nextLocation, setNextLocation] = useState<string|null>(null);
  const warnWhenRef = useRef(warnWhen);

  const navigateNative = useNavigateNative();

  useEffect(() => {
    if (warnWhenRef.current === warnWhen) return
    warnWhenRef.current = warnWhen;
  }, [warnWhen]);

  useEffect(() => {
    if (warnWhen || !nextLocation || nextLocation === location.pathname) return;
    navigateNative(nextLocation);
    setNextLocation(null);
  }, [warnWhen, nextLocation]);

  return useCallback((pathname: string) => {
    if (!warnWhenRef.current && navigationType !== 'REPLACE') {
      navigateNative(pathname);
      setNextLocation(null);
      return;
    }
    setNextLocation(pathname);
    showUnsavedConfirm(
      () => setWarnWhen(false),
      () => setNextLocation(null),
    );
  }, [setNextLocation]);
}