import { withPayload } from '@payloadcms/next/withPayload';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
};

export default withPayload(nextConfig, {
  configPath: path.resolve(dirname, './src/payload.config.ts'),
});
