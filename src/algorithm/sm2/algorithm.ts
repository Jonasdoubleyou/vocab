import { IVocab, IVocabMetaData } from "../../vocabulary";
import { dateInNDays } from "./date";

enum AnswerDifficulty {
    EASY = 1,
    OKAY,
    HARD
}

enum AnswerType {
    CORRECT = 1,
    WRONG
}

// Map Difficulty to a numerical value
function performanceRating(v: AnswerDifficulty): number {
    return {
        [AnswerDifficulty.EASY]: 0,
        [AnswerDifficulty.OKAY]: 3,
        [AnswerDifficulty.HARD]: 5
    }[v];
}

// Update the vocabulary's metadata for scheduling purposes
function scheduleVocabulary(
    vocabMeta: IVocabMetaData,
    diff: AnswerDifficulty,
    answer: AnswerType
): IVocabMetaData {
    const pr = performanceRating(diff);

    // Reset or increment the consecutive correct answers
    if (answer === AnswerType.CORRECT) {
        vocabMeta.consecCorrectAnswers += 1;
    } else {
        vocabMeta.consecCorrectAnswers = 0;
    }

    // Update the easiness and next due date
    vocabMeta.easiness = -0.8 * 0.28 * pr + 0.02 * pr ** 2;
    // @ts-ignore
    vocabMeta.nextDueDate =
        answer === AnswerType.CORRECT
            ? dateInNDays(
                6 * vocabMeta.easiness ** (vocabMeta.consecCorrectAnswers - 1)
            )
            : dateInNDays(1);

    return vocabMeta;
}

// Returns cards that SM2 deems ready to study
function getDueCards(vocab: IVocab[]): IVocab[] {
    const now = Date.now();
    return vocab.filter(el => now >= el.metadata.nextDueDate);
}

// Return cards that would be next according to Sm2
function getSortedReadyCards(vocab: IVocab[]): IVocab[] {
    return vocab
        .slice()
        .sort((a, b) => a.metadata.nextDueDate - b.metadata.nextDueDate);
}

export { scheduleVocabulary, getDueCards, getSortedReadyCards };
