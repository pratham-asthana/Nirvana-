# Resume Analysis

def OCR(pdf_path):   #This is extraction of text using OCR. Will only be used if simple extraction doesn't work
    import pytesseract
    from pdf2image import convert_from_path
    try:
        images = convert_from_path(pdf_path)
        for image in images:
            page_text = pytesseract.image_to_string(image)
            text += page_text + "\n"
        return text
    except Exception as e:
        print(f"Text extraction failed: {e}")

#This function is used to extract text from pdf. This is simple extraction without OCR
def text_from_pdf(pdf_path):
    import pdfplumber
    text=""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
        if text.strip():
            return text.strip()
    except Exception as e:
        OCR(pdf_path)

def clean_text(text):
    import string
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = text.lower()
    return text

def Tokens(text):
    import nltk
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize
    from nltk.stem import PorterStemmer
    ps = PorterStemmer()
    stop_words = set(stopwords.words('english'))
    word_tokens = word_tokenize(text)
    # stemmed_words = [ps.stem(w) for w in word_tokens if w.lower() not in stop_words]
    # stemmed_words = [ps.stem(w) for w in word_tokens]
    # stemmed_words = list(stemmed_words)
    word_tokens = " ".join(word_tokens)
    # return stemmed_words
    return word_tokens

def Matching_Skills(Resume_Skills, JD_Skills):
    count = 0
    for i in Resume_Skills:
        if i in JD_Skills:
            count +=1
        else:
            pass
    return count

def extraction(text):
    from sklearn.feature_extraction.text import TfidfVectorizer

    # TF-IDF keyword extraction
    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1,2), max_features=100)
    X = vectorizer.fit_transform([text])

    keywords = vectorizer.get_feature_names_out()
    return(list(keywords))

def keybert(text):
    from keybert import KeyBERT
    kw_model = KeyBERT()
    keywords = kw_model.extract_keywords(text, top_n=15)
    return keywords

def Matching(resume_keywords, jd_keywords):
    resume_kw = [kw for kw, score in resume_keywords]
    jd_kw = [kw for kw, score in jd_keywords]
    resume_set = set(resume_kw)
    jd_set = set(jd_kw)
    Set = (resume_set, jd_set)
    return Set

def ATS_Calculation(Count, JD_Skills):
    JD_len = len(JD_Skills)
    ATS = Count/JD_len
    ATS = ATS*100
    return ATS

def ATS_Calculation_2(Count, JD_Skills, Resume_Skills):
    JD_len = len(JD_Skills)
    recall = Count / JD_len  # How much of JD covered
    precision = Count / len(Resume_Skills) # How relevant resume is

    # F1-like scoring (balanced relevance + coverage)
    ATS = (0.6 * recall + 0.4 * precision) * 100
    return round(ATS, 2)

def ATS_Calculation_3(Set):
    resume_set, jd_set = Set
    common = resume_set & jd_set

    if not resume_set or not jd_set:
        print("Match Score: 0%")
        print("Matched Keywords:", common)
        return 0

    Precision = len(common) / len(resume_set)
    Recall = len(common) / len(jd_set)
    if Precision + Recall == 0:
        match_score = 0
    else:
        match_score = (2 * Precision * Recall) / (Precision + Recall)

    match_score *= 100
    print("Match Score:", round(match_score, 2), "%")
    print("Matched Keywords:", common)
    return match_score

def bow_match_score(resume_text, jd_text):
    from sklearn.feature_extraction.text import CountVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    vectorizer = CountVectorizer(stop_words="english")

    vectors = vectorizer.fit_transform([resume_text, jd_text])

    similarity = cosine_similarity(vectors[0], vectors[1])[0][0]

    similarity = round(similarity * 100, 2)
    print("ATS_BOW:", similarity)
    return similarity

def ATS_Avg(Ats1, Ats2, Ats3):
    Ats1 = Ats1 * (1/10)
    Ats2 = Ats2 * (1/10)
    Ats3 = Ats3 * (8/10)
    ATS = (Ats1 + Ats2 + Ats3)
    return ATS

# 1. Synonym Expansion
def expand_keywords(text):
    from nltk.corpus import wordnet
    words = text.split()
    expanded = set(words)
    for w in words:
        for syn in wordnet.synsets(w):
            for lemma in syn.lemmas():
                expanded.add(lemma.name().lower())
    return list(expanded)

# 2. Phrase Detection (n-grams)
def get_phrases(text, ngram_range=(2,3)):
    from sklearn.feature_extraction.text import CountVectorizer
    vectorizer = CountVectorizer(ngram_range=ngram_range, stop_words="english").fit([text])
    return vectorizer.get_feature_names_out()

# 3. Weighted Score
def weighted_score(resume_terms, jd_terms):
    matches = set(resume_terms) & set(jd_terms)
    score = 0
    for m in matches:
        if len(m.split()) > 1:  # phrase
            score += 2
        else:  # single word
            score += 1
    return (score / (len(jd_terms)+1)) * 100

# 4. Semantic Similarity
def semantic_similarity(resume_text, jd_text):
    from sentence_transformers import SentenceTransformer, util
    model = SentenceTransformer("all-MiniLM-L6-v2")
    embeddings = model.encode([resume_text, jd_text], convert_to_tensor=True)
    sim = util.pytorch_cos_sim(embeddings[0], embeddings[1]).item()
    return sim * 100

#  Combine everything
def Ats_Enhanced(resume_text, jd_text):
    # Expanded terms
    resume_terms = expand_keywords(resume_text) + list(get_phrases(resume_text))
    jd_terms = expand_keywords(jd_text) + list(get_phrases(jd_text))

    # Weighted lexical score
    lexical_score = weighted_score(resume_terms, jd_terms)

    # Semantic score
    semantic_score = semantic_similarity(resume_text, jd_text)

    # Final ATS: weighted average
    # final_score = (0.6 * lexical_score) + (0.4 * semantic_score)
    # print("ATS_Enhanced:", final_score)
    # return final_score
    print("ATS_Enhanced:", semantic_score)
    return semantic_score