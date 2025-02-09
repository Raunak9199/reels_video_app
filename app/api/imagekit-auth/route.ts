import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

/**
 * Returns the authentication parameters for ImageKit.
 * This endpoint is used to get the authentication parameters needed to upload
 * images to ImageKit.
 *
 * @returns {Promise<NextResponse>} A NextResponse with the authentication
 * parameters.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Imagekit Authentication Failed" },
      { status: 500 }
    );
  }
}
