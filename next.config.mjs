import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // ผูก alias "@/..." ให้ชี้รากโปรเจกต์ (สอดคล้องกับ paths ใน tsconfig)
    config.resolve.alias['@'] = root
    return config
  },
}

export default nextConfig
