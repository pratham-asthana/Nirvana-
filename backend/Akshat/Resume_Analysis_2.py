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
    stemmed_words = [ps.stem(w) for w in word_tokens if w.lower() not in stop_words]
    stemmed_words = ",".join(stemmed_words)
    stemmed_words = stemmed_words.lower()
    stemmed_words = list(stemmed_words)
    return stemmed_words

def extract_skills(text, JD_Skills):
    text = text.lower()
    return [skill for skill in JD_Skills if skill in text]

def ATS_Calculation(Matched_Skills):
    