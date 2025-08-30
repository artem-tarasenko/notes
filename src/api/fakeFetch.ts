// Simple fake fetch with delay
export async function fakeFetch(
  url: string,
  options: RequestInit
): Promise<Response> {
  // Simulate network delay (2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(`✅ Fake Fetch: ${options.method || "GET"} ${url}`, options.body);

  // Return a mock Response object
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    json: async () => ({
      success: true,
      data: JSON.parse(options.body as string),
    }),
  } as Response;
}

