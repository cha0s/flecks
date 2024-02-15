import {cp} from 'fs/promises';
import {join} from 'path';

import {createWorkspace} from '@flecks/core/build/testing';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

export const templateDefaultPath = join(FLECKS_CORE_ROOT, 'test', 'template');

export async function createApplication(template = templateDefaultPath) {
  const workspace = await createWorkspace();
  await cp(template, workspace, {recursive: true});
  return workspace;
}
