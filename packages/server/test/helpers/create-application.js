import {cp} from 'fs/promises';
import {join, resolve} from 'path';

import {createWorkspace} from '@flecks/core/build/testing';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

export const templateDefaultPath = 'template';

export async function createApplication(template = templateDefaultPath) {
  const workspace = await createWorkspace();
  await cp(resolve(join(FLECKS_CORE_ROOT, 'test'), template), workspace, {recursive: true});
  return workspace;
}
