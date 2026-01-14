import supabase from "../utils/supabaseClient.js";

export async function uploadAvatar(file, userId) {
  const filePath = `${userId}/avatar-${Date.now()}.png`;

  const { error } = await supabase.storage
    .from("profiles")
    .upload(filePath, file.data, {
      upsert: false,
      contentType: file.mimetype,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("profiles").getPublicUrl(filePath);

  return data.publicUrl;
}

export async function cleanupOldAvatars(userId, keep) {
  const { data, error } = await supabase.storage.from("profiles").list(userId, {
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
    .from("profiles")
    .remove(filesToDelete);

  if (deleteError) {
    console.error("Delete error:", deleteError);
    throw deleteError;
  }
}
