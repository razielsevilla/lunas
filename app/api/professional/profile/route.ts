export async function GET(): Promise<Response> {
  return Response.json(
    { error: 'Not implemented yet: GET /api/professional/profile' },
    { status: 501 }
  );
}
