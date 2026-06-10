import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-west-1",
});

export async function POST(request: NextRequest) {
  try {
    // Aquí podrías validar la sesión de administrador
    // const session = await getAdminSession();
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fileName, fileType, provider } = await request.json();

    if (!fileName || !fileType || !provider) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos (fileName, fileType, provider)" },
        { status: 400 }
      );
    }

    if (!fileName.endsWith('.xls') && !fileName.endsWith('.xlsx')) {
        return NextResponse.json(
            { error: "Solo se admiten archivos Excel (.xls, .xlsx)" },
            { status: 400 }
          );
    }

    // Aseguramos que el nombre del archivo contiene la marca para que la Lambda sepa procesarlo
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const s3Key = `${provider}-${Date.now()}-${cleanFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.UPLOADS_BUCKET_NAME || "UploadsBucketPlaceholder",
      Key: s3Key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({ uploadUrl, key: s3Key });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Error interno al generar URL de subida" },
      { status: 500 }
    );
  }
}
