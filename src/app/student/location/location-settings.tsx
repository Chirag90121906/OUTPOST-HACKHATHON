"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleHelp, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

type LocationPermissionState = "checking" | "prompt" | "granted" | "denied" | "unavailable";

export function LocationSettings({ initialCity, initialState }: { initialCity: string; initialState: string }) {
  const [city, setCity] = useState(initialCity);
  const [state, setState] = useState(initialState);
  const [permission, setPermission] = useState<LocationPermissionState>("checking");
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!window.isSecureContext) {
      setPermission("unavailable");
      return;
    }

    if (!("geolocation" in navigator)) {
      setPermission("unavailable");
      return;
    }

    if (!navigator.permissions?.query) {
      setPermission("prompt");
      return;
    }

    let activeStatus: PermissionStatus | undefined;
    let mounted = true;
    navigator.permissions.query({ name: "geolocation" }).then((status) => {
      if (!mounted) return;
      setPermission(status.state);
      activeStatus = status;
      activeStatus.addEventListener("change", onPermissionChange);
    }).catch(() => setPermission("prompt"));
    function onPermissionChange() {
      if (activeStatus) setPermission(activeStatus.state);
    }
    return () => {
      mounted = false;
      activeStatus?.removeEventListener("change", onPermissionChange);
    };
  }, []);

  async function saveLocation(nextCity: string, nextState: string) {
    const response = await fetch("/api/profile/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: nextCity, state: nextState }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Unable to save your location.");
    }
    setCity(result.data.location.city ?? "");
    setState(result.data.location.state ?? "");
  }

  function useCurrentLocation() {
    if (!window.isSecureContext) {
      setPermission("unavailable");
      setMessage("Current location requires a secure HTTPS connection. Enter your city and state manually.");
      return;
    }

    if (!("geolocation" in navigator)) {
      setPermission("unavailable");
      setMessage("This browser does not support location services. Enter your city and state manually.");
      return;
    }

    setLoading(true);
    setMessage("");
    navigator.geolocation.getCurrentPosition(async (position) => {
      setPermission("granted");
      try {
        const response = await fetch("/api/location/reverse-geocode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        });
        const result = await response.json();
        if (!response.ok || !result.ok) {
          throw new Error(result.error || "Unable to identify your city and state.");
        }
        await saveLocation(result.data.city, result.data.state);
        setShowPrompt(false);
        setMessage("Your city and state were saved. Precise coordinates were not stored.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to save your location. Enter it manually.");
      } finally {
        setLoading(false);
      }
    }, (error) => {
      setLoading(false);
      if (error.code === error.PERMISSION_DENIED) {
        setPermission("denied");
        setMessage("Location access was denied. Allow it in your browser’s site settings, or enter your location manually.");
      } else if (error.code === error.TIMEOUT) {
        setMessage("The location request timed out. Try again or enter your location manually.");
      } else {
        setPermission("unavailable");
        setMessage("Your location is unavailable. Check that location services are enabled, or enter it manually.");
      }
    }, { enableHighAccuracy: false, maximumAge: 60_000, timeout: 12_000 });
  }

  async function saveManualLocation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await saveLocation(city.trim(), state.trim());
      setShowPrompt(false);
      setMessage("Preferred location saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save your location.");
    } finally {
      setLoading(false);
    }
  }

  async function clearLocation() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/profile/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clear: true }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Unable to clear saved location.");
      setCity("");
      setState("");
      setMessage("Saved city and state cleared.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to clear saved location.");
    } finally {
      setLoading(false);
    }
  }

  const permissionLabel = permission === "checking"
    ? "Checking browser setting…"
    : permission === "granted"
      ? "Permission Granted"
      : permission === "denied"
        ? "Permission Denied"
        : permission === "unavailable"
          ? "Location Unavailable"
          : "Location Not Enabled";

  return (
    <div className="space-y-6">
      {showPrompt && permission !== "granted" && (
        <Card className="overflow-hidden border-secondary/15 bg-gradient-to-br from-primary to-secondary p-5 text-white sm:p-7">
          <div className="flex items-start gap-4">
            <span className="rounded-2xl bg-accent/15 p-3 text-accent"><MapPin size={22} /></span>
            <div className="min-w-0 flex-1">
              <h2 className="font-heading text-xl font-semibold">Enable Location Access</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                Allow GRANTLY to use your current location for a one-time city and state lookup, so you can find regional opportunities. Your precise coordinates are sent to OpenStreetMap for this lookup only and are not saved.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button onClick={useCurrentLocation} disabled={loading}>
                  <MapPin size={16} />{loading ? "Finding location…" : "Use My Current Location"}
                </Button>
                <Button variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10" onClick={() => document.getElementById("manual-location")?.scrollIntoView({ behavior: "smooth" })}>
                  Enter Location Manually
                </Button>
                <Button variant="ghost" className="text-white/75 hover:bg-white/10 hover:text-white" onClick={() => setShowPrompt(false)}>
                  Not Now
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-secondary/10 p-2.5 text-secondary"><ShieldCheck size={20} /></span>
            <div>
              <h2 className="font-heading text-lg font-semibold">Permission status</h2>
              <p className="text-sm text-muted">{permissionLabel}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            Location access is optional and is only requested when you choose “Use My Current Location.” GRANTLY does not continuously track you. If access is denied, change it in your browser’s site settings or use manual entry.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={useCurrentLocation} disabled={loading}>
              <MapPin size={16} />{loading ? "Finding location…" : city || state ? "Update My Location" : "Use Current Location"}
            </Button>
            {permission === "denied" && <p className="self-center text-xs text-muted">To re-enable: open the lock/site-controls icon beside the address bar and allow Location.</p>}
          </div>
        </Card>

        <Card id="manual-location" className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-accent/20 p-2.5 text-secondary"><MapPin size={20} /></span>
            <div>
              <h2 className="font-heading text-lg font-semibold">Preferred location</h2>
              <p className="text-sm text-muted">Used to find scholarships available in your region.</p>
            </div>
          </div>
          <form onSubmit={saveManualLocation} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="location-city">City</Label><Input id="location-city" value={city} onChange={(event) => setCity(event.target.value)} maxLength={100} autoComplete="address-level2" placeholder="e.g. Ahmedabad" /></div>
              <div><Label htmlFor="location-state">State</Label><Input id="location-state" value={state} onChange={(event) => setState(event.target.value)} maxLength={100} autoComplete="address-level1" placeholder="e.g. Gujarat" /></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={loading || (!city.trim() && !state.trim())}>{loading ? "Saving…" : "Save Preferred Location"}</Button>
              {(city || state) && <Button type="button" variant="outline" onClick={clearLocation} disabled={loading}>Clear Saved Location</Button>}
            </div>
          </form>
        </Card>
      </div>

      <Card className="flex gap-3 p-5 text-sm leading-6 text-muted sm:p-6">
        <CircleHelp className="mt-0.5 shrink-0 text-secondary" size={18} />
        <p><strong className="text-foreground">Privacy:</strong> GRANTLY stores only the city and state you choose to save. Current-location lookup uses your coordinates once to find those place names; coordinates are not stored in your profile. You can edit or clear your saved location at any time.</p>
      </Card>
      <p className="text-xs text-muted">
        Location lookup provided by <a className="underline underline-offset-2 hover:text-secondary" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>.
      </p>

      {message && (
        <p className="flex items-start gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground" role="status">
          <CheckCircle2 className="mt-0.5 shrink-0 text-secondary" size={17} />{message}
        </p>
      )}
    </div>
  );
}
