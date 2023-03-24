import { PostModelType } from './post'

export interface DraftModuleType extends PostModelType {
  user: never
}
