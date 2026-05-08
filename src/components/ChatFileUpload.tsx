import React, { useRef, useState } from "react";
import { http } from "../api/http";

type UploadedMeta = {
  filename: string;
  extracted_text?: string | null;
  file_url?: string | null;
};

export default function ChatFileUpload({
  chatId,
  onComplete,
}: {
  chatId: string;
  onComplete?: (items: UploadedMeta[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  function openPicker() {
    inputRef.current?.click();
  }

  function onFilesPicked(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list) return;
    setFiles(Array.from(list));
  }

  async function upload() {
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      const { data } = await http.post(`/chat/chats/${chatId}/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const attachments = (data?.data?.attachments || []).map((a: any) => ({
        filename: a.filename,
        extracted_text: a.extracted_text,
        file_url: a.file_url,
      }));
      setFiles([]);
      onComplete?.(attachments);
    } catch (err) {
      console.error("Upload failed", err);
      throw err;
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={onFilesPicked}
        style={{ display: "none" }}
      />
      <button type="button" onClick={openPicker} disabled={uploading}>
        📎 Attach
      </button>
      <button
        type="button"
        onClick={upload}
        disabled={uploading || files.length === 0}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      <div style={{ display: "flex", gap: 8 }}> 
        {files.map((f) => (
          <div key={f.name} style={{ fontSize: 12 }}>
            {f.name}
          </div>
        ))}
      </div>
    </div>
  );
}
