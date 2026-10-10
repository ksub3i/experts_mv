// Online enquiries are paused: this endpoint never stored or delivered them.
// Any old or cached copy of the form now gets a clear error instead of a false "received".
export async function POST() {
  return Response.json(
    { error: "Online enquiries are temporarily unavailable. Please call us on +960 402 2420 or +960 914 2236." },
    { status: 503 },
  );
}
