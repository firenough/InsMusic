import type { ParsedLyricLine } from '../types';

/**
 * Parse LRC format lyrics into structured array
 * Supports translations marked with [翻译] section
 */
export const parseLyrics = (lrc: string): ParsedLyricLine[] => {
    const timeRegex = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?]/;
    const lines = lrc.split(/\r?\n/);

    // Check if there's a translation section
    const translationMarkerIndex = lines.findIndex(line =>
        line.trim() === '[翻译]' || line.trim() === '[翻譯]' || line.trim().toLowerCase() === '[translation]'
    );

    const hasTranslationSection = translationMarkerIndex !== -1;

    // Separate main lyrics and translations
    const mainLines = hasTranslationSection ? lines.slice(0, translationMarkerIndex) : lines;
    const translationLines = hasTranslationSection ? lines.slice(translationMarkerIndex + 1) : [];

    // Parse time string to seconds
    const parseTime = (match: RegExpMatchArray): number => {
        const mins = Number(match[1]);
        const secs = Number(match[2]);
        const ms = match[3] ? Number(match[3].padEnd(3, '0')) : 0;
        return mins * 60 + secs + ms / 1000;
    };

    // Parse main lyrics into array with time
    const mainLyricsArray: { time: number; text: string }[] = [];

    mainLines.forEach((line) => {
        const match = line.match(timeRegex);
        if (!match) return;

        const content = line.replace(timeRegex, '').trim();
        if (!content) return;

        const time = parseTime(match);
        mainLyricsArray.push({ time, text: content });
    });

    // Sort main lyrics by time
    mainLyricsArray.sort((a, b) => a.time - b.time);

    // Parse translations into array with time
    const translationsArray: { time: number; text: string }[] = [];

    translationLines.forEach((line) => {
        const match = line.match(timeRegex);
        if (!match) return;

        const content = line.replace(timeRegex, '').trim();
        // Skip empty translations or placeholder translations
        if (!content || content === '//' || content === '///' || content === '/') return;

        const time = parseTime(match);
        translationsArray.push({ time, text: content });
    });

    // Sort translations by time
    translationsArray.sort((a, b) => a.time - b.time);

    // Match translations to main lyrics using fuzzy time matching
    // Allow up to 0.5 second difference for matching
    const TIME_TOLERANCE = 0.5;

    return mainLyricsArray.map(({ time, text }) => {
        // Find the closest translation within tolerance
        let bestMatch: string | undefined;
        let bestDiff = TIME_TOLERANCE + 1;

        for (const trans of translationsArray) {
            const diff = Math.abs(trans.time - time);
            if (diff < bestDiff && diff <= TIME_TOLERANCE) {
                bestDiff = diff;
                bestMatch = trans.text;
            }
            // If we've passed the time window, no need to continue
            if (trans.time > time + TIME_TOLERANCE) break;
        }

        return {
            time,
            text,
            translation: bestMatch,
        };
    });
};

/**
 * Find the active lyric index based on current playback time
 */
export const findActiveLyricIndex = (lyrics: ParsedLyricLine[], currentTime: number): number => {
    if (!lyrics.length) return -1;

    let currentIdx = 0;
    for (let i = 0; i < lyrics.length; i++) {
        if (currentTime >= lyrics[i].time) {
            currentIdx = i;
        } else {
            break;
        }
    }
    return currentIdx;
};
