import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// ANAQIA_MOCK=1 swaps the real Supabase client for an in-memory one (tests only).
const mock = process.env.ANAQIA_MOCK === '1' && {
  name: 'mock-supabase',
  enforce: 'pre',
  async resolveId(source, importer) {
    if (!importer || !source.endsWith('supabase.js')) return null
    const r = await this.resolve(source, importer, { skipSelf: true })
    return r && r.id.endsWith(path.join('src', 'lib', 'supabase.js')) ? path.resolve('tests/mock-supabase.js') : null
  },
}

export default defineConfig({
  plugins: [react(), mock].filter(Boolean),
  base: './',
})
