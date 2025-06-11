//api/delete/[id]/route.js
import { updateSheetData } from "../../config";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(request, { params }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // console.log(`🗑️ User ${user.name} deleting item ${params.id}`);

  try {
    if (!id) {
      return NextResponse.json(
        { message: "File ID is required" },
        { status: 400 }
      );
    }
    console.log("Received DELETE request for file ID:", user.name, id);
    const softdatele = await updateSheetData(
      "personnel!G" + (Number(id) + 1) + ":H" + (Number(id) + 1),
      [[new Date().toISOString(), user.name]]
    );
    if (!softdatele) {
      return NextResponse.json(
        { message: 'File not found or already deleted' },
        { status: 404 }
      );
    }

    // ส่งข้อความยืนยันการลบไฟล์
    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // console.error('API Error:', error);
    return NextResponse.json(
      { message: "Error deleting file", error: error.message },
      { status: 500 }
    );
  }
}
