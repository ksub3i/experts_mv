/**
 * Formats a booked consultation for display. Times are always shown in Maldives
 * time (where the team and the call are), whatever the visitor's device is set to.
 * Only the display changes — the instant comes straight from Cal.com's ISO times.
 */
export const MALDIVES_TZ = "Indian/Maldives";
export const MALDIVES_LABEL = "Maldives time (GMT+5)"; // no daylight saving in the Maldives

const dateFormat = (timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "long", day: "numeric", month: "long", year: "numeric" });
const timeFormat = (timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone, hour: "numeric", minute: "2-digit", hour12: true });

export type AppointmentDisplay = {
  date: string;
  time: string;
  timezone: string;
  /** The start in the visitor's own timezone — only when their clock differs from Maldives time. */
  local: string | null;
};

export function formatAppointment(
  startTime: string | undefined,
  endTime: string | undefined,
  viewerTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
): AppointmentDisplay | null {
  const start = startTime ? new Date(startTime) : null;
  if (!start || Number.isNaN(start.getTime())) return null;
  const end = endTime ? new Date(endTime) : null;

  const time = timeFormat(MALDIVES_TZ);
  const date = dateFormat(MALDIVES_TZ).format(start);
  const startLabel = time.format(start);

  // Same wall-clock date and time as Malé (e.g. another GMT+5 zone) → no extra line needed.
  const sameClock =
    dateFormat(viewerTimeZone).format(start) === date && timeFormat(viewerTimeZone).format(start) === startLabel;

  return {
    date,
    time: end && !Number.isNaN(end.getTime()) ? `${startLabel} – ${time.format(end)}` : startLabel,
    timezone: MALDIVES_LABEL,
    local: sameClock
      ? null
      : new Intl.DateTimeFormat("en-GB", {
          timeZone: viewerTimeZone,
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        }).format(start),
  };
}
