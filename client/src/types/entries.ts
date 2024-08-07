import { PaginationOutput, PaginationParams } from './pagination';
import { Optional, WithId } from './utils';

export type Term = {
  text: string;
  lang: string;
  audioUrl: string;
};

export type Occurrence = {
  start: number;
  end: number;
};

export type Example = {
  text: string;
  lang: string;
  audioUrl: string;
  occurrences: Occurrence[];
};

export type Definition = {
  text: string;
  lang: string;
};

export type Entry = {
  index: number;
  term: Term;
  definition: Definition;
  examples: Example[];
  priority: number;
};

export type TermExample = Omit<Entry, 'examples'> & {
  example: Example
  exampleIndex: number;
};

export interface NewEntryParams extends Omit<Entry, 'index'> { }
export interface AddEntryRequestTermParams extends Optional<Term, 'audioUrl'> { }
export interface AddEntryRequestExampleParams extends Optional<Example, 'audioUrl'> { }
export interface AddEntryRequestBody extends Optional<Omit<NewEntryParams, 'term' | 'examples'>, 'priority'> {
  term: AddEntryRequestTermParams;
  examples?: AddEntryRequestExampleParams[];
}
export interface UpdateEntryParams extends Partial<Entry> { }
export interface UpdateEntryRequestBody extends Partial<AddEntryRequestBody & { index: number; }> { }
export interface ListEntriesParams extends PaginationParams { }
export interface AddEntryResponseBody extends WithId<Entry> { }
export interface RetrieveEntryResponseBody extends WithId<Entry> { }
export interface UpdateEntryResponseBody extends WithId<Entry> { }
export interface ListEntriesResponseBody {
  data: WithId<Entry>[];
  pagination: PaginationOutput;
}