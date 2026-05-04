import { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import crypto from "crypto";

export async function POST(request: NextRequest) {
	const text = await request.text();

	const signature = crypto
		.createHmac("sha256", process.env.UMBRACO_REVALIDATE_SECRET || "")
		.update(text)
		.digest("hex");

	const trusted = Buffer.from(`sha256=${signature}`, "ascii");
	const untrusted = Buffer.from(
		request.headers.get("x-hub-signature-256") || "",
		"ascii",
	);

	if (!crypto.timingSafeEqual(trusted, untrusted)) {
		return new Response("Invalid signature.", { status: 400 });
	}

	revalidatePath("/", "layout");
	revalidateTag("content", "max");

	return new Response("Success!", { status: 200 });
}
