interface IVocabMetaData {
  easiness: number; // SM2 Easiness
  consecCorrectAnswers: number; // SM2; Korrekte Antworten "in a row"
  nextDueDate: number;
}

interface IVocab {
  // TODO: Support für mehr Kartenarten, wie Cloze?
  front: string;
  back: string;

  metadata: IVocabMetaData; // Metadaten für Scheduling
}

interface IVocabList {
  id: number;
  // "Language Mapping"
  from: string;
  to: string;

  // Name fo the List
  name: string;

  // Vocab items
  entries: IVocab[];
}
export { IVocab, IVocabMetaData, IVocabList };
