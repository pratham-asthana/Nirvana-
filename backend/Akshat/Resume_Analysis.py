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
    stemmed_words = [ps.stem(w) for w in word_tokens if w.lower() not in stop_words]
    stemmed_words = ",".join(stemmed_words)
    stemmed_words = stemmed_words.lower()
    return stemmed_words

def Keyword_Extraction_Resume(text):
    from keybert import KeyBERT
    kw_model = KeyBERT(model="all-MiniLM-L6-v2")  # Lightweight & fast embedding model

    keywords = kw_model.extract_keywords(
        text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=20
    )
    skills = [kw for doc in keywords for kw, _ in doc]
    return skills

def Keyword_Extraction_JD(text):
    from keybert import KeyBERT
    kw_model = KeyBERT(model="all-MiniLM-L6-v2")  # Lightweight & fast embedding model

    keywords = kw_model.extract_keywords(
        text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=15
    )
    skills = [kw for doc in keywords for kw, _ in doc]
    return skills

# pip install rake-nltk

def extract_keywords_rake_resume(text, top_k=20):
    from rake_nltk import Rake
    r = Rake(min_length=1, max_length=3)  # n-grams 1..3
    r.extract_keywords_from_text(text)
    ranked = r.get_ranked_phrases()  # best → worst
    return ranked[:top_k]

def extract_keywords_rake_JD(text, top_k=15):
    from rake_nltk import Rake
    r = Rake(min_length=1, max_length=3)  # n-grams 1..3
    r.extract_keywords_from_text(text)
    ranked = r.get_ranked_phrases()  # best → worst
    return ranked[:top_k]


def Matching_Missing(Resume_Skills, JD_Skills):
    # Find overlaps and missing skills
    matched_skills = list(set(Resume_Skills) & set( JD_Skills))
    missing_skills = list(set(JD_Skills) - set(Resume_Skills))
    other_skills = list(set(Resume_Skills) - set(JD_Skills))
    return [matched_skills, missing_skills, other_skills]

def ATS(Skills):
    Matched_Skills = Skills[0]
    Missing_Skills = Skills[1]
    Other_Skills = Skills[2]
    Required_Skills = len(Matched_Skills) + len(Missing_Skills)
    Skill_Match_Score = len(Matched_Skills)/Required_Skills
    Other_Skills_Score = len(Other_Skills)/Required_Skills
    ATS = (Skill_Match_Score*0.7) + (Other_Skills_Score*0.3)
    ATS = ATS*100
    return ATS

# Use Mistral AI and Ollama