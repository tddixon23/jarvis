import { NextRequest, NextResponse } from "next/server";
import { chat, Message } from "@/lib/jarvis";

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await chat(messages, (chunk) => {
            controller.enqueue(encoder.encode(chunk));
          });
        } catch (err) {
          console.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
