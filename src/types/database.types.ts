export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            anfitriones: {
                Row: {
                    id: string
                    created_at: string
                    nombre: string
                    email: string | null
                    telefono: string | null
                    avatar_url: string | null
                    instagram_handle: string | null
                    evidencia_seguidores_url: string | null
                    estado_cuenta: 'pendiente' | 'aprobado' | 'rechazado'
                }
                Insert: {
                    id?: string
                    created_at?: string
                    nombre: string
                    email?: string | null
                    telefono?: string | null
                    avatar_url?: string | null
                    instagram_handle?: string | null
                    evidencia_seguidores_url?: string | null
                    estado_cuenta?: 'pendiente' | 'aprobado' | 'rechazado'
                }
                Update: {
                    id?: string
                    created_at?: string
                    nombre?: string
                    email?: string | null
                    telefono?: string | null
                    avatar_url?: string | null
                    instagram_handle?: string | null
                    evidencia_seguidores_url?: string | null
                    estado_cuenta?: 'pendiente' | 'aprobado' | 'rechazado'
                }
                Relationships: []
            }
            eventos: {
                Row: {
                    id: string
                    created_at: string
                    nombre: string
                    fecha: string
                    lugar: string | null
                    estado: 'borrador' | 'publicado' | 'finalizado'
                    imagen_url: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    nombre: string
                    fecha: string
                    lugar?: string | null
                    estado?: 'borrador' | 'publicado' | 'finalizado'
                    imagen_url?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    nombre?: string
                    fecha?: string
                    lugar?: string | null
                    estado?: 'borrador' | 'publicado' | 'finalizado'
                    imagen_url?: string | null
                }
                Relationships: []
            }
            evento_anfitrion: {
                Row: {
                    id: string
                    created_at: string
                    evento_id: string
                    anfitrion_id: string
                    estado: 'pendiente' | 'confirmado' | 'rechazado' | 'ingresado'
                    access_token: string
                    cupo_invitados: number
                    invitados_registrados: number
                    last_seen_at: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    evento_id: string
                    anfitrion_id: string
                    estado?: 'pendiente' | 'confirmado' | 'rechazado' | 'ingresado' | 'revision'
                    access_token?: string
                    cupo_invitados?: number
                    invitados_registrados?: number
                    last_seen_at?: string | null
                    evidencia_url?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    evento_id?: string
                    anfitrion_id?: string
                    estado?: 'pendiente' | 'confirmado' | 'rechazado' | 'ingresado' | 'revision'
                    access_token?: string
                    cupo_invitados?: number
                    invitados_registrados?: number
                    last_seen_at?: string | null
                    evidencia_url?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "evento_anfitrion_anfitrion_id_fkey"
                        columns: ["anfitrion_id"]
                        referencedRelation: "anfitriones"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "evento_anfitrion_evento_id_fkey"
                        columns: ["evento_id"]
                        referencedRelation: "eventos"
                        referencedColumns: ["id"]
                    }
                ]
            }
            invitados_anfitrion: {
                Row: {
                    id: string
                    created_at: string
                    evento_anfitrion_id: string
                    nombre_completo: string
                    rut_dni: string | null
                    estado: 'en_lista' | 'ingresado'
                }
                Insert: {
                    id?: string
                    created_at?: string
                    evento_anfitrion_id: string
                    nombre_completo: string
                    rut_dni?: string | null
                    estado?: 'en_lista' | 'ingresado'
                }
                Update: {
                    id?: string
                    created_at?: string
                    evento_anfitrion_id?: string
                    nombre_completo?: string
                    rut_dni?: string | null
                    estado?: 'en_lista' | 'ingresado'
                }
                Relationships: [
                    {
                        foreignKeyName: "invitados_anfitrion_evento_anfitrion_id_fkey"
                        columns: ["evento_anfitrion_id"]
                        referencedRelation: "evento_anfitrion"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_: string]: never
        }
        Functions: {
            [_: string]: never
        }
        Enums: {
            [_: string]: never
        }
        CompositeTypes: {
            [_: string]: never
        }
    }
}
