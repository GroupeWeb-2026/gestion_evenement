"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Upload, X } from "lucide-react";

interface Speaker {
  id: string;
  fullName: string;
  photo: string | null;
  bio: string | null;
  externalLinks: string | null;
}

export default function EditSpeakerPage() {
  const router = useRouter();
  const params = useParams();
  const speakerId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    photo: "",
    bio: "",
    externalLinks: "",
  });

  useEffect(() => {
    const fetchSpeaker = async () => {
      const res = await fetch(`/api/admin/speakers/${speakerId}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          fullName: data.fullName,
          photo: data.photo || "",
          bio: data.bio || "",
          externalLinks: data.externalLinks || "",
        });
        if (data.photo) setImagePreview(data.photo);
      }
      setInitialLoading(false);
    };
    fetchSpeaker();
  }, [speakerId]);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return false;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB");
      return false;
    }
    
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });
      
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, photo: data.url }));
        toast.success("Image téléchargée avec succès");
        return true;
      } else {
        const error = await res.json();
        toast.error(error.error || "Erreur lors du téléchargement");
        setImagePreview(null);
        return false;
      }
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
      setImagePreview(null);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/speakers/${speakerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      toast.success("Speaker modifié avec succès");
      router.push("/admin/speakers");
    } catch {
      toast.error("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-gray-500">Chargement...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/speakers" className="text-brand-600 hover:underline">
            ← Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Modifier le speaker</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom complet *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Photo</label>
            
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {imagePreview && (
              <div className="mt-2 mb-3">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-32 h-32 rounded-full object-cover border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, photo: "" });
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Supprimer l'image
                </button>
              </div>
            )}
            
            <div className="relative">
              <input
                type="url"
                value={formData.photo}
                onChange={(e) => {
                  setFormData({ ...formData, photo: e.target.value });
                  if (e.target.value) {
                    setImagePreview(e.target.value);
                  }
                }}
                placeholder="URL de l'image ou cliquez sur l'icône pour télécharger"
                className="w-full p-2 pr-10 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleIconClick}
                disabled={uploading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-600 transition-colors disabled:opacity-50"
                title="Télécharger une image depuis votre appareil"
              >
                <Upload className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Entrez une URL d'image ou cliquez sur l'icône 📤 pour télécharger une image depuis votre appareil
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Liens externes</label>
            <input
              type="url"
              value={formData.externalLinks}
              onChange={(e) => setFormData({ ...formData, externalLinks: e.target.value })}
              placeholder="https://..."
              className="w-full p-2 border rounded-lg"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full btn bg-brand-600 text-white disabled:opacity-50"
          >
            {loading ? "Modification..." : "Modifier le speaker"}
          </button>
        </form>
      </main>
    </div>
  );
}