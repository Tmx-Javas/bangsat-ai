export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json; charset=utf-8"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.method !== "POST") {
      return Response.json(
        { error: "Gunakan metode POST." },
        { status: 405, headers: cors }
      );
    }

    try {
      const body = await request.json();
      const question = String(body.message || "").trim();

      if (!question || question.length > 4000) {
        return Response.json(
          { error: "Pesan kosong atau terlalu panjang." },
          { status: 400, headers: cors }
        );
      }

      const url = new URL("https://api.azbry.com/api/ai/claude");
      url.searchParams.set("q", question);

      const response = await fetch(url.toString());
      const data = await response.json();

      const answer =
        data.result ||
        data.response ||
        data.answer ||
        data.message ||
        data.content ||
        data.text;

      if (!response.ok || !answer) {
        return Response.json(
          { error: "API Claude gagal memberikan jawaban." },
          { status: 502, headers: cors }
        );
      }

      return Response.json({ answer }, { headers: cors });
    } catch {
      return Response.json(
        { error: "Terjadi kesalahan saat memproses pesan." },
        { status: 500, headers: cors }
      );
    }
  }
};