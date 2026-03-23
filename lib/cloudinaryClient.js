export async function destroyCloudinary(publicId) {
  await fetch("/api/cloudinary/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  });
}
export async function bulkDestroyCloudinary(publicIds) {
  await fetch("/api/cloudinary/bulk-delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicIds }),
  });
}
