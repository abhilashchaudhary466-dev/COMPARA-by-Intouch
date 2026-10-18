/**
 * Nexus Write — Authoritative Python Text-Analysis Engine Code
 * Pure, beginner-friendly Python code implementing all required concepts:
 * Strings, Lists, Sets, Dictionaries, Loops, Functions, If/Elif/Else, Calculations.
 */

export const PYTHON_ENGINE_SOURCE = `"""
=============================================================================
COMPARA: EXPLAINABLE WRITING & COMPARISON INTELLIGENCE ENGINE
=============================================================================
Educational Python Text-Analysis Reference Implementation.
Designed for students to learn Python fundamentals through real text processing.

CONCEPTS DEMONSTRATED:
1. Strings & String Manipulation (str.lower(), str.strip(), str.replace())
2. Lists & Sequences (indexing, slicing, list comprehensions, sorting)
3. Sets & Set Operations (set(), set.intersection(), set difference)
4. Dictionaries & Frequency Counting (dict[key] = count, dict.items())
5. Loops (for loops, while conditions, iterating over data structures)
6. Functions (def, parameters, return values, docstrings)
7. Conditional Logic (if / elif / else branching)
8. Arithmetic & Percentage Calculations (round(), division by zero checks)
=============================================================================
"""

import re
import json

# ---------------------------------------------------------------------------
# 1. STOP WORDS & LEXICONS (Python Sets & Dictionaries)
# ---------------------------------------------------------------------------
# Concept: Sets provide O(1) membership lookup, perfect for filtering.
STOP_WORDS = {
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'and', 'or', 'but', 'if', 'because', 'as', 'until', 'while', 'of', 'at',
    'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through',
    'to', 'from', 'in', 'out', 'on', 'off', 'over', 'under', 'then', 'once',
    'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both',
    'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
    'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
    'just', 'should', 'now', 'this', 'that', 'these', 'those', 'it', 'its',
    'they', 'them', 'their', 'we', 'us', 'our', 'you', 'your', 'he', 'him'
}

# Concept: Dictionaries map keys (words) to values (suggestions or descriptions).
FILLER_WORDS = {
    'very': 'Consider replacing with a stronger descriptive adjective or omitting.',
    'really': 'Often adds little value; consider omitting for crisper tone.',
    'basically': 'Can sound informal or condescending; try fundamentally or in essence.',
    'actually': 'Usually redundant; sentences are often stronger without it.',
    'just': 'Weakens the authority of your statement; consider omitting.',
    'quite': 'Weak qualifier; choose an exact descriptor instead.',
    'perhaps': 'Shows uncertainty; use deliberate phrasing for academic assertions.',
    'maybe': 'Informal hedge; consider potentially or conceivably.',
    'literally': 'Often used incorrectly for emphasis; avoid unless strictly factual.'
}

VAGUE_WORDS = {
    'thing': 'Replace with the exact object, concept, or parameter.',
    'stuff': 'Specify the actual materials, evidence, or concepts.',
    'good': 'Use precise adjectives like beneficial, rigorous, or exemplary.',
    'bad': 'Use accurate terms like detrimental, defective, or unfavorable.',
    'nice': 'Overly colloquial; consider pleasant, well-mannered, or graceful.',
    'big': 'Quantify or use substantial, expansive, or comprehensive.',
    'small': 'Quantify or use minute, minimal, or compact.',
    'many': 'Quantify with numbers or state numerous, multiple, or abundant.',
    'some': 'Specify the exact group or proportion where possible.'
}


# ---------------------------------------------------------------------------
# 2. STRING CLEANING & TOKENIZATION
# ---------------------------------------------------------------------------
def clean_text(text: str) -> str:
    """
    Concept: String manipulation and regular expressions.
    Cleans raw text by stripping leading/trailing whitespace and normalizing spaces.
    """
    if not isinstance(text, str):
        return ""
    # Strip whitespace and collapse multiple whitespace into single space
    cleaned = text.strip()
    cleaned = re.sub(r'\\s+', ' ', cleaned)
    return cleaned


def tokenize_words(text: str) -> list:
    """
    Concept: Lists and regex tokenization.
    Extracts individual alphanumeric words converted to lowercase.
    """
    if not text:
        return []
    # Find all words containing letters, numbers, or internal apostrophes
    words = re.findall(r"\\b[a-zA-Z0-9']+\\b", text.lower())
    return words


def split_sentences(text: str) -> list:
    """
    Concept: Strings, regular expressions, and lists.
    Splits text on sentence boundaries (. ! ?) while handling whitespace.
    """
    if not text or not text.strip():
        return []
    # Split by period, exclamation, question mark followed by whitespace or end
    raw_sentences = re.split(r'(?<=[.!?])\\s+', text.strip())
    # Filter out empty or whitespace-only items using list comprehension
    sentences = [s.strip() for s in raw_sentences if s.strip()]
    return sentences


# ---------------------------------------------------------------------------
# 3. BASIC METRICS COUNTING
# ---------------------------------------------------------------------------
def count_words(words: list) -> int:
    """Concept: Built-in len() function on lists."""
    return len(words)


def count_sentences(sentences: list) -> int:
    """Concept: Built-in len() function on lists."""
    return len(sentences)


def count_paragraphs(text: str) -> int:
    """
    Concept: Splitting strings by double line breaks to count paragraphs.
    """
    if not text.strip():
        return 0
    paras = [p.strip() for p in text.split('\\n') if p.strip()]
    return len(paras)


def calculate_average_word_length(words: list) -> float:
    """
    Concept: Arithmetic, loops, and zero-division safeguard.
    Returns the average character count of words.
    """
    if not words:
        return 0.0
    total_letters = sum(len(w) for w in words)
    return round(total_letters / len(words), 2)


def calculate_average_sentence_length(words: list, sentences: list) -> float:
    """
    Concept: Arithmetic division and rounding.
    Returns average word count per sentence.
    """
    if not sentences:
        return 0.0
    return round(len(words) / len(sentences), 2)


# ---------------------------------------------------------------------------
# 4. FREQUENCY COUNTING & DICTIONARIES
# ---------------------------------------------------------------------------
def count_word_frequency(words: list) -> dict:
    """
    Concept: Dictionaries and loops.
    Counts the occurrence of every word in the provided list.
    """
    frequency_dict = {}
    for word in words:
        if word in frequency_dict:
            frequency_dict[word] += 1
        else:
            frequency_dict[word] = 1
    return frequency_dict


def find_repeated_words(frequency_dict: dict, threshold: int = 3) -> list:
    """
    Concept: Dictionary iteration, filtering, and sorting.
    Identifies words appearing at or above the threshold (excluding stop words).
    """
    repeated = []
    for word, count in frequency_dict.items():
        # Exclude common stop words from repetition alarms
        if count >= threshold and word not in STOP_WORDS and len(word) > 2:
            repeated.append({'word': word, 'count': count})
    
    # Sort by count descending
    repeated.sort(key=lambda item: item['count'], reverse=True)
    return repeated


def find_filler_words(words: list) -> list:
    """
    Concept: Dictionary lookup inside a loop.
    Finds instances of known filler words.
    """
    found = {}
    for word in words:
        if word in FILLER_WORDS:
            found[word] = found.get(word, 0) + 1
            
    result = []
    for word, count in found.items():
        result.append({
            'word': word,
            'count': count,
            'suggestion': FILLER_WORDS[word]
        })
    return result


def find_vague_words(words: list) -> list:
    """
    Concept: Dictionary lookup and suggestion pairing.
    """
    found = {}
    for word in words:
        if word in VAGUE_WORDS:
            found[word] = found.get(word, 0) + 1
            
    result = []
    for word, count in found.items():
        result.append({
            'word': word,
            'count': count,
            'suggestion': VAGUE_WORDS[word]
        })
    return result


def find_long_sentences(sentences: list, threshold: int = 20) -> list:
    """
    Concept: List comprehensions, string splitting, and conditional logic.
    Identifies sentences that exceed the word threshold.
    """
    long_list = []
    for idx, sentence in enumerate(sentences, start=1):
        words_in_sentence = sentence.split()
        length = len(words_in_sentence)
        if length > threshold:
            long_list.append({
                'index': idx,
                'sentence': sentence,
                'word_count': length,
                'threshold': threshold,
                'advice': f"This sentence has {length} words, exceeding the {threshold}-word target."
            })
    return long_list


# ---------------------------------------------------------------------------
# 5. VOCABULARY DIVERSITY & SENTENCE VARIATION
# ---------------------------------------------------------------------------
def calculate_sentence_variation(sentences: list) -> dict:
    """
    Concept: Classifying items into categories and calculating percentages.
    Short: <= 12 words
    Medium: 13 to 22 words
    Long: > 22 words
    """
    if not sentences:
        return {'short': 0, 'medium': 0, 'long': 0, 'variety_score': 0}
        
    short_count = 0
    medium_count = 0
    long_count = 0
    
    for s in sentences:
        w_count = len(s.split())
        if w_count <= 12:
            short_count += 1
        elif w_count <= 22:
            medium_count += 1
        else:
            long_count += 1
            
    total = len(sentences)
    short_pct = round((short_count / total) * 100, 1)
    medium_pct = round((medium_count / total) * 100, 1)
    long_pct = round((long_count / total) * 100, 1)
    
    # Balance score: healthy writing mixes short, medium, and long
    categories_present = sum(1 for c in [short_count, medium_count, long_count] if c > 0)
    variety_score = min(100, categories_present * 30 + 10)
    
    return {
        'short': short_count,
        'medium': medium_count,
        'long': long_count,
        'short_pct': short_pct,
        'medium_pct': medium_pct,
        'long_pct': long_pct,
        'variety_score': variety_score
    }


def calculate_vocabulary_diversity(words: list) -> dict:
    """
    Concept: Sets, list filtering, and percentage formula:
    (unique meaningful words / total meaningful words) * 100
    """
    meaningful_words = [w for w in words if w not in STOP_WORDS]
    
    if not meaningful_words:
        return {
            'percentage': 0.0,
            'category': 'LOW',
            'explanation': 'No meaningful content words found to evaluate.'
        }
        
    unique_meaningful = set(meaningful_words)
    diversity_pct = round((len(unique_meaningful) / len(meaningful_words)) * 100, 1)
    
    if diversity_pct >= 75.0:
        category = 'HIGH'
    elif diversity_pct >= 50.0:
        category = 'MODERATE'
    else:
        category = 'LOW'
        
    explanation = f"Vocabulary diversity is {category.lower()} because {diversity_pct}% of meaningful words are unique."
    
    return {
        'total_meaningful': len(meaningful_words),
        'unique_meaningful': len(unique_meaningful),
        'percentage': diversity_pct,
        'category': category,
        'explanation': explanation
    }


# ---------------------------------------------------------------------------
# 6. READABILITY & WRITING QUALITY (Explainable Formulas)
# ---------------------------------------------------------------------------
def calculate_readability(avg_sentence_len: float, avg_word_len: float, long_sentence_ratio: float) -> dict:
    """
    Concept: Transparent student-friendly heuristic formula.
    Not an opaque formula: clearly penalizes overly convoluted sentences.
    """
    base_score = 100
    penalties = 0
    factors = []
    
    if avg_sentence_len > 25:
        penalties += 25
        factors.append("High average sentence length (>25 words) reduces flow.")
    elif avg_sentence_len > 18:
        penalties += 10
        factors.append("Moderate average sentence length.")
    else:
        factors.append("Optimal average sentence length (under 18 words).")
        
    if avg_word_len > 6.2:
        penalties += 15
        factors.append("Higher density of polysyllabic words.")
        
    if long_sentence_ratio > 0.30:
        penalties += 20
        factors.append("More than 30% of sentences exceed 20 words.")
        
    score = max(20, min(100, base_score - penalties))
    
    if score >= 85:
        category = "EXCELLENT"
    elif score >= 70:
        category = "GOOD"
    elif score >= 50:
        category = "MODERATE"
    else:
        category = "NEEDS IMPROVEMENT"
        
    return {
        'score': score,
        'category': category,
        'factors': factors
    }


def calculate_writing_quality(clarity: int, readability: int, vocabulary: int, 
                              sentence_variety: int, repetition: int, structure: int) -> dict:
    """
    Concept: Weighted average arithmetic:
    Overall = (Clarity*0.20 + Readability*0.20 + Vocab*0.15 + Variety*0.15 + Repetition*0.15 + Structure*0.15)
    """
    overall = int(round(
        clarity * 0.20 +
        readability * 0.20 +
        vocabulary * 0.15 +
        sentence_variety * 0.15 +
        repetition * 0.15 +
        structure * 0.15
    ))
    return {
        'overall': overall,
        'clarity': clarity,
        'readability': readability,
        'vocabulary': vocabulary,
        'sentence_variety': sentence_variety,
        'repetition': repetition,
        'structure': structure
    }


# ---------------------------------------------------------------------------
# 7. COMPARISON & EDUCATIONAL SIMILARITY (Set Operations)
# ---------------------------------------------------------------------------
def calculate_similarity(passage_a_words: list, passage_b_words: list) -> dict:
    """
    Concept: Set theory operations: Intersection (setA & setB) and Union (setA | setB).
    Jaccard-like meaningful vocabulary overlap.
    NOTE: Educational similarity estimate ONLY. Does NOT claim plagiarism detection.
    """
    # 1. Filter out stop words using set differences
    meaningful_a = {w for w in passage_a_words if w not in STOP_WORDS and len(w) > 2}
    meaningful_b = {w for w in passage_b_words if w not in STOP_WORDS and len(w) > 2}
    
    if not meaningful_a or not meaningful_b:
        return {
            'similarity_percentage': 0.0,
            'shared_words': [],
            'unique_a': list(meaningful_a),
            'unique_b': list(meaningful_b),
            'excluded_stop_words': list(STOP_WORDS.intersection(set(passage_a_words) | set(passage_b_words))),
            'explanation': "Insufficient meaningful words for comparison."
        }
        
    # 2. Set intersection (shared meaningful terms)
    shared_words = meaningful_a.intersection(meaningful_b)
    
    # 3. Set union (total unique meaningful vocabulary across both passages)
    all_meaningful = meaningful_a.union(meaningful_b)
    
    similarity_pct = round((len(shared_words) / len(all_meaningful)) * 100, 1)
    
    unique_to_a = sorted(list(meaningful_a - shared_words))
    unique_to_b = sorted(list(meaningful_b - shared_words))
    shared_list = sorted(list(shared_words))
    
    # 4. Excluded common stop words present in the texts
    excluded = sorted(list(STOP_WORDS.intersection(set(passage_a_words) | set(passage_b_words))))
    
    explanation = (
        f"Meaningful vocabulary overlap is {similarity_pct}% based on "
        f"{len(shared_list)} shared words out of {len(all_meaningful)} combined distinct concepts."
    )
    
    return {
        'similarity_percentage': similarity_pct,
        'shared_words': shared_list,
        'unique_a': unique_to_a,
        'unique_b': unique_to_b,
        'excluded_stop_words': excluded,
        'explanation': explanation
    }


# ---------------------------------------------------------------------------
# 8. TONE HEURISTIC ANALYSIS
# ---------------------------------------------------------------------------
def analyze_tone(text: str, words: list) -> dict:
    """
    Concept: Transparent heuristic signals without black-box AI.
    Counts presence of formal, academic, emotional, or informal markers.
    """
    text_lower = text.lower()
    signals = []
    
    academic_markers = {'hypothesize', 'methodology', 'correlation', 'framework', 'empirical', 'theoretical'}
    formal_markers = {'furthermore', 'moreover', 'consequently', 'subsequently', 'nevertheless'}
    informal_markers = {'yeah', 'gonna', 'wanna', 'kinda', 'cool', 'awesome', 'dude', 'ok'}
    persuasive_markers = {'must', 'imperative', 'undeniable', 'crucial', 'essential', 'urgent'}
    
    word_set = set(words)
    
    acad_matches = word_set.intersection(academic_markers)
    form_matches = word_set.intersection(formal_markers)
    inf_matches = word_set.intersection(informal_markers)
    pers_matches = word_set.intersection(persuasive_markers)
    
    if len(acad_matches) >= 2:
        primary = "ACADEMIC"
        confidence = 85
        signals.append(f"Contains research terminology: {', '.join(acad_matches)}")
    elif len(form_matches) >= 1:
        primary = "FORMAL"
        confidence = 80
        signals.append(f"Uses formal transition discourse markers: {', '.join(form_matches)}")
    elif len(pers_matches) >= 2:
        primary = "PERSUASIVE"
        confidence = 75
        signals.append(f"Employs urgent emphasis vocabulary: {', '.join(pers_matches)}")
    elif len(inf_matches) >= 1 or "'" in text:
        primary = "INFORMAL"
        confidence = 70
        signals.append(f"Includes casual expressions or contractions: {', '.join(inf_matches)}")
    else:
        primary = "NEUTRAL"
        confidence = 65
        signals.append("Balanced vocabulary with neutral informational characteristics.")
        
    return {
        'primary_tone': primary,
        'confidence': confidence,
        'signals': signals
    }


# ---------------------------------------------------------------------------
# 9. GENERATE INSIGHTS & FORMATTED REPORT
# ---------------------------------------------------------------------------
def generate_insights(metrics: dict) -> list:
    """
    Concept: Generating dynamic educational observations from calculated values.
    """
    insights = []
    if metrics['diversity_pct'] >= 75:
        insights.append(f"Vocabulary diversity is high ({metrics['diversity_pct']}%), signaling broad word choice.")
    else:
        insights.append(f"Vocabulary diversity is moderate ({metrics['diversity_pct']}%); consider synonyms for frequent terms.")
        
    if metrics['long_sentence_count'] > 0:
        insights.append(f"{metrics['long_sentence_count']} sentences exceed the configured long-sentence threshold.")
    else:
        insights.append("All sentences remain within the concise target length.")
        
    if metrics['top_repeated']:
        top_word = metrics['top_repeated'][0]['word']
        top_count = metrics['top_repeated'][0]['count']
        insights.append(f"The word '{top_word}' appears {top_count} times; review if deliberate emphasis is intended.")
        
    return insights


def generate_report(passage_text: str) -> dict:
    """
    Concept: Pipeline coordinator function running the complete analysis.
    """
    cleaned = clean_text(passage_text)
    words = tokenize_words(cleaned)
    sentences = split_sentences(cleaned)
    
    w_count = count_words(words)
    s_count = count_sentences(sentences)
    p_count = count_paragraphs(cleaned)
    avg_w_len = calculate_average_word_length(words)
    avg_s_len = calculate_average_sentence_length(words, sentences)
    
    freq = count_word_frequency(words)
    repeated = find_repeated_words(freq)
    fillers = find_filler_words(words)
    vagues = find_vague_words(words)
    long_sents = find_long_sentences(sentences)
    
    variation = calculate_sentence_variation(sentences)
    diversity = calculate_vocabulary_diversity(words)
    
    readability = calculate_readability(
        avg_s_len, avg_w_len,
        len(long_sents) / s_count if s_count > 0 else 0
    )
    
    quality = calculate_writing_quality(
        clarity=max(40, 100 - len(fillers) * 5 - len(vagues) * 5),
        readability=readability['score'],
        vocabulary=int(diversity['percentage']),
        sentence_variety=variation['variety_score'],
        repetition=max(40, 100 - len(repeated) * 8),
        structure=80 if p_count > 1 else 65
    )
    
    tone = analyze_tone(cleaned, words)
    
    insights = generate_insights({
        'diversity_pct': diversity['percentage'],
        'long_sentence_count': len(long_sents),
        'top_repeated': repeated
    })
    
    return {
        'status': 'SUCCESS',
        'word_count': w_count,
        'sentence_count': s_count,
        'paragraph_count': p_count,
        'avg_word_length': avg_w_len,
        'avg_sentence_length': avg_s_len,
        'vocabulary_diversity': diversity,
        'repeated_words': repeated,
        'filler_words': fillers,
        'vague_words': vagues,
        'long_sentences': long_sents,
        'sentence_variety': variation,
        'readability': readability,
        'writing_quality': quality,
        'tone': tone,
        'insights': insights,
        'disclaimer': (
            "Educational text-analysis tool. Similarity and quality results use "
            "simple, explainable rules and should NOT be interpreted as professional "
            "plagiarism detection or academic integrity evaluation."
        )
    }

if __name__ == '__main__':
    sample = (
        "Artificial intelligence presents extraordinary opportunities for modern students. "
        "However, basically students must learn how systems actually operate under the hood. "
        "Transparent algorithms and explainable code help ensure that technology remains clear, "
        "ethical, and genuinely beneficial for everyone."
    )
    result = generate_report(sample)
    print(json.dumps(result, indent=2))
`;
