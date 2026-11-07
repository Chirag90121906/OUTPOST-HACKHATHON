const nationwideLocations = new Set([
  "all india",
  "india",
  "nationwide",
  "pan india",
  "pan-india",
  "all states",
  "any state",
]);

export function scholarshipMatchesState(
  eligibleStates: string | null | undefined,
  state: string,
) {
  const requestedState = state.trim().toLowerCase();
  if (!requestedState || !eligibleStates?.trim()) return true;

  const locations = eligibleStates
    .split(/[,;|/\n]/)
    .map((location) => location.trim().toLowerCase())
    .filter(Boolean);

  return (
    locations.some((location) => nationwideLocations.has(location)) ||
    locations.includes(requestedState)
  );
}
