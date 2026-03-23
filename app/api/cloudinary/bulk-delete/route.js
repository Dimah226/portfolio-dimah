// app/api/cloudinary/bulk-delete/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name:  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { publicIds } = await req.json();
    if (!publicIds?.length) return NextResponse.json({ error: 'publicIds manquants' }, { status: 400 });

    const result = await cloudinary.api.delete_resources(publicIds);
    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
