export async function GET(): Promise<Response> {
  return Response.json(
    { error: 'Not implemented yet: GET /api/professional/dashboard' },
    { status: 501 }
  );
}
