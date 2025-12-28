"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadEvidence(formData: FormData) {
    const supabase = await createClient();
    const file = formData.get("file") as File;
    const hostId = formData.get("hostId") as string;

    if (!file || !hostId) return { error: "Faltan datos" };

    // 1. Upload to Storage
    const fileExt = file.name.split('.').pop();
    const filePath = `${hostId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase
        .storage
        .from('evidence')
        .upload(filePath, file);

    if (uploadError) {
        console.error("Storage Error:", uploadError);
        return { error: "Error al guardar en Storage. ¿Creaste el bucket 'evidence'?" };
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase
        .storage
        .from('evidence')
        .getPublicUrl(filePath);

    // 3. Update Host Record
    const { error: dbError } = await supabase
        .from("evento_anfitrion")
        .update({
            evidencia_url: publicUrl,
            estado: 'revision' // Cambiamos a estado 'En Revisión'
        })
        .eq("id", hostId);

    if (dbError) {
        console.error("DB Error:", dbError);
        return { error: "Error al actualizar base de datos" };
    }

    return { success: true };
}

export async function updateValidationStatus(hostId: string, status: 'confirmado' | 'rechazado', path: string) {
    const supabase = await createClient();

    // Si se rechaza, podríamos borrar la evidencia o dejarla como historial.
    // Por ahora solo cambiamos estado.

    const updateData: any = { estado: status };
    if (status === 'rechazado') {
        updateData.evidencia_url = null; // Reset para que suba otra
    }

    const { error } = await supabase
        .from("evento_anfitrion")
        .update(updateData)
        .eq("id", hostId);

    if (error) return { error: error.message };

    revalidatePath(path);
    return { success: true };
}
