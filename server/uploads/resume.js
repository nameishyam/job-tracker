import supabase from "../utils/supabaseClient.js";

export async function uploadResume(file, userId) {
  const filePath = `${userId}/resume-${Date.now()}.pdf`;
  const { error } = await supabase.storage
    .from("resumes")
    .upload(filePath, file.data, {
      upsert: false,
      contentType: file.mimetype,
    });
  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error(error.message);
  }
  const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function cleanupOldResumes(userId, keep) {
  const { data, error } = await supabase.storage.from("resumes").list(userId, {
    sortBy: { column: "updated_at", order: "desc" },
  });
  if (error) {
    console.error("List error:", error);
    throw error;
  }
  if (!data || data.length <= keep) return;
  const filesToDelete = data
    .slice(keep)
    .map((file) => `${userId}/${file.name}`);
  const { error: deleteError } = await supabase.storage
    .from("resumes")
    .remove(filesToDelete);
  if (deleteError) {
    console.error("Delete error:", deleteError);
    throw deleteError;
  }
}
