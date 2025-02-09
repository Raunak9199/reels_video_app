import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Video, { IVideo, VIDEO_DIMENSIONS } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    if (!videos || videos.length === 0) {
      return NextResponse.json(
        { message: "No videos found", video: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Videos fetched successfully", video: videos },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching videos", video: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body: IVideo = await req.json();
    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const videoData = {
      ...body,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        qulaity: body.transformation?.qulaity ?? 100,
      },
    };

    const newVid = await Video.create(videoData);

    return NextResponse.json(
      { message: "Video uploaded successfully", video: newVid },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error uploading video" },
      { status: 500 }
    );
  }
}
