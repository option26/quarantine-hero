import { AskForHelpCollectionEntry } from './AskForHelpCollectionEntry'
import { CollectionName } from '../enum/CollectionName';

export interface DeletedCollectionEntry extends AskForHelpCollectionEntry {
  collectionName: CollectionName
}
