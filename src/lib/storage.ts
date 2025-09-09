// Copyright (c) 2024 Napulita
import { supabase } from './supabase'
import { generateUniqueFilename } from './utils'

export async function uploadReportPhoto(
  file: File,
  reportId: number,
  kind: 'before' | 'after'
): Promise<string> {
  const filename = generateUniqueFilename(file.name)
  const filePath = `reports/${reportId}/${kind}/${filename}`
  
  const { error } = await supabase.storage
    .from('reports')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) {
    throw new Error(`Failed to upload photo: ${error.message}`)
  }
  
  // Get public URL
  const { data } = supabase.storage
    .from('reports')
    .getPublicUrl(filePath)
  
  return data.publicUrl
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const filename = generateUniqueFilename(file.name)
  const filePath = `avatars/${userId}/${filename}`
  
  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })
  
  if (error) {
    throw new Error(`Failed to upload avatar: ${error.message}`)
  }
  
  // Get public URL
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)
  
  return data.publicUrl
}

export function getStorageUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}
