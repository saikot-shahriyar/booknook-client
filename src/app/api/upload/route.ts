import type { NextRequest } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

/** Maximum accepted cover-image size: 5 MB. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return Response.json(
        { success: false, message: "Authentication required to upload images." },
        { status: 401 }
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return Response.json(
        { success: false, message: "Image upload is not configured. Please contact support." },
        { status: 500 }
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return Response.json(
        { success: false, message: "No image file provided." },
        { status: 400 }
      );
    }

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { success: false, message: "No image file provided." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(
        { success: false, message: "Please select an image file." },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return Response.json(
        { success: false, message: "Image files must be 5 MB or smaller." },
        { status: 400 }
      );
    }

    const uploadForm = new FormData();
    uploadForm.append("image", file);

    const imgbbRes = await fetch(`${IMGBB_UPLOAD_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      body: uploadForm,
    });

    if (!imgbbRes.ok) {
      let message = `Image upload failed with status ${imgbbRes.status}.`;
      try {
        const body: unknown = await imgbbRes.json();
        const parsed =
          body as { message?: unknown; error?: { message?: unknown } } | null;
        const candidates = [parsed?.message, parsed?.error?.message];
        const errorMessage = candidates.find(
          (candidate): candidate is string =>
            typeof candidate === "string" && candidate.length > 0
        );
        if (errorMessage) {
          message = errorMessage;
        }
      } catch {
        // Non-JSON error bodies keep the generic message.
      }
      return Response.json({ success: false, message }, { status: 502 });
    }

    const imgbbBody: unknown = await imgbbRes.json();
    const imageUrl = (imgbbBody as { data?: { url?: unknown } } | null)?.data?.url;

    if (typeof imageUrl !== "string" || !imageUrl) {
      return Response.json(
        { success: false, message: "Image upload failed. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
      message: "Image uploaded successfully.",
      data: { url: imageUrl },
    });
  } catch (error) {
    console.error("ImgBB upload failed:", error);
    return Response.json(
      { success: false, message: "Image upload failed. Please try again." },
      { status: 500 }
    );
  }
}
