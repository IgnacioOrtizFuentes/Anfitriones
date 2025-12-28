"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function submitHostApplication(formData: FormData) {
    const supabase = await createClient();

    const nombre = formData.get("nombre") as string;
    const email = formData.get("email") as string;
    const telefono = formData.get("telefono") as string;
    const instagram = formData.get("instagram") as string;
    const evidencia = formData.get("evidencia") as File;

    if (!nombre || !instagram || !evidencia) {
        return { error: "Faltan campos obligatorios" };
    }

    // 1. Upload Evidence
    const fileExt = evidencia.name.split('.').pop();
    const fileName = `applications/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(fileName, evidencia);

    if (uploadError) {
        return { error: "Error subiendo imagen: " + uploadError.message };
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('evidence')
        .getPublicUrl(fileName);

    // 2. Create Host Record (Pending State)
    const { error: insertError } = await supabase
        .from("anfitriones")
        .insert({
            nombre,
            email: email || null,
            telefono: telefono || null,
            instagram_handle: instagram,
            evidencia_seguidores_url: publicUrl,
            estado_cuenta: 'pendiente'
        });

    if (insertError) {
        return { error: "Error enviando solicitud: " + insertError.message };
    }

    return { success: true };
}
