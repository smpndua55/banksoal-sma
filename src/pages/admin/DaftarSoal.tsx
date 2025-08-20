import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface SoalItem {
  id: number;
  judul_soal: string;
  mata_pelajaran: string;
  kelas: string;
  semester: string;
  file_url: string;
  file_name: string;
}

const DaftarSoal: React.FC = () => {
  const [soalList, setSoalList] = useState<SoalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    fetchSoal();
  }, []);

  // Ambil daftar soal dari tabel Supabase
  const fetchSoal = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("soal").select("*");
    if (error) {
      console.error("Error fetching soal:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat daftar soal",
      });
      setLoading(false);
      return;
    }
    setSoalList(data || []);
    setLoading(false);
  };

  // Fungsi download file
  const handleDownload = async (fileUrl: string, fileName: string, id: number) => {
    try {
      setDownloading(id);
      console.log("Starting download for:", fileName);

      // Jika bucket public → langsung buka di tab baru
      if (fileUrl.includes("/object/public/")) {
        window.open(fileUrl, "_blank");
        setDownloading(null);
        return;
      }

      // Ambil path relatif dari URL Supabase
      const match = fileUrl.match(/soal-files\/(.+)$/);
      if (!match) throw new Error("Gagal parsing file path");
      const filePath = match[1]; // contoh: "ujian-123/matematika.pdf"

      // Buat signed URL untuk private bucket
      const { data, error } = await supabase.storage
        .from("soal-files")
        .createSignedUrl(filePath, 60);

      if (error || !data?.signedUrl) {
        throw new Error(error?.message || "Gagal membuat signed URL");
      }

      // Fetch file dari signed URL
      const response = await fetch(data.signedUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const blob = await response.blob();

      // Trigger download dengan Blob
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = urlBlob;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(urlBlob);

      toast({
        title: "Berhasil",
        description: `Soal "${fileName}" berhasil diunduh`,
      });
    } catch (error: any) {
      console.error("Download error:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengunduh file. Silakan coba lagi.",
      });
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return <p className="text-center py-4">Memuat daftar soal...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {soalList.map((soal) => (
        <Card key={soal.id} className="shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {soal.judul_soal}
            </CardTitle>
            <p className="text-sm text-gray-500">
              {soal.mata_pelajaran} | Kelas {soal.kelas} | {soal.semester}
            </p>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <span className="truncate">{soal.file_name}</span>
            <Button
              onClick={() =>
                handleDownload(soal.file_url, soal.file_name, soal.id)
              }
              variant="outline"
              disabled={downloading === soal.id}
            >
              {downloading === soal.id ? "Mengunduh..." : "Download"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DaftarSoal;
