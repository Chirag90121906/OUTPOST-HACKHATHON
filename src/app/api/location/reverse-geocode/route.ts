import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

const coordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export async function POST(request: Request) {
  const session = await requireSession(["STUDENT", "ADMIN"]);
  if (!session) return fail("Unauthorized", 401);

  const parsed = coordinateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Location coordinates are invalid.", 400);

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(parsed.data.latitude));
  url.searchParams.set("lon", String(parsed.data.longitude));
  url.searchParams.set("zoom", "10");
  url.searchParams.set("addressdetails", "1");

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en",
        "User-Agent": `GRANTLY scholarship platform (${process.env.APP_URL || "http://localhost:3000"})`,
      },
      signal: AbortSignal.timeout(7000),
      cache: "no-store",
    });
  } catch {
    return fail("The location lookup service is unavailable. Enter your city and state manually.", 502);
  }

  if (!response.ok) {
    return fail("Could not look up this location. Enter your city and state manually.", 502);
  }

  const result = await response.json().catch(() => null);
  const address = result?.address;
  const city = address?.city ?? address?.town ?? address?.village ?? address?.municipality ?? address?.county;
  const state = address?.state;
  if (typeof city !== "string" && typeof state !== "string") {
    return fail("No city or state could be identified. Enter your location manually.", 404);
  }

  return ok({
    city: typeof city === "string" ? city : "",
    state: typeof state === "string" ? state : "",
  });
}
