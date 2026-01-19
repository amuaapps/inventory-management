import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config';
import { Users } from './collections/Users';
import { Products } from './collections/Products';
import { stubEmailAdapter } from './email/stub-email-adapter';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: config.serverUrl,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Amua Apps Inventory',
    },
    components: {
      graphics: {
        Icon: '@/components/Icon',
        Logo: '@/components/Logo',
      },
      beforeNavLinks: ['@/components/CustomAdminCSS'],
    },
  },
  collections: [Users, Products],
  editor: lexicalEditor(),
  email: stubEmailAdapter,
  secret: config.payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: config.mongodbUri,
  }),
});
