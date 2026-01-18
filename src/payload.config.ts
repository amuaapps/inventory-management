import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { config } from './config';

export default buildConfig({
  serverURL: config.serverUrl,
  admin: {
    user: 'users',
  },
  collections: [],
  editor: lexicalEditor({}),
  secret: config.payloadSecret,
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: config.mongodbUri,
  }),
});
