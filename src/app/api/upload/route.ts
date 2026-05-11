import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
    }
    
    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Seules les images sont autorisées" }, { status: 400 });
    }
    
    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 5MB)" }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Créer un nom unique
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Créer le dossier s'il n'existe pas
    await mkdir(uploadDir, { recursive: true });
    
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    
    // Retourner l'URL publique
    const imageUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: imageUrl });
    
  } catch (error) {
    console.error("Erreur upload:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}