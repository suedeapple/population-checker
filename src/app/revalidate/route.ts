import { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import crypto from "crypto";

export async function POST(request: NextRequest) {
	try {
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
			console.log("[Next.js] Invalid signature.", {
				trusted: trusted.toString("hex"),
				untrusted: untrusted.toString("hex"),
			});
			return new Response("Invalid signature.", {
				status: 400,
			});
		}

		const { contentPath, updateNavigation, updateLocalisation, isTrashed } =
			JSON.parse(text) as RevalidatePayload;

		if (isTrashed) {
			revalidatePath("/", "layout");
			revalidateTag("content", "max");
			console.log("revalidated all cache");
		}

		if (contentPath) {
			let url = removeLastSlash(contentPath);
			if (url === "") url = "/";
			revalidatePath("/", "layout");
			revalidatePath(url);
			revalidateTag("content", "max");
			console.log(`revalidated content path ${url}`);
		}


	} catch (error: any) {
		console.log(`Revalidate webhook error: ${error.message}`);
		return new Response(`Revalidate webhook error: ${error.message}`, {
			status: 400,
		});
	}

	return new Response("Success!", {
		status: 200,
	});
}

interface RevalidatePayload {
	contentPath: string;
	updateNavigation: boolean;
	updateLocalisation: boolean;
	isTrashed: boolean;
}

function removeLastSlash(url: string): string {
	if (url.endsWith("/")) {
		return url.slice(0, -1);
	}
	return url;
}