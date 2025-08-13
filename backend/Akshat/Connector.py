# File which is the intermediate for the Main file and the files in this particular folder
# API will be called to this python file. And then it will be connected in that manner.

# API called for Resume Analysis with the pdf_path and JD
def API_Resume_Analysis(Extracted_text, JD):
    from Resume_Analysis import text_from_pdf, OCR, Tokens, clean_text, Keyword_Extraction_Resume, Keyword_Extraction_JD, Matching_Missing, ATS
    #Extracted_text = text_from_pdf(pdf_path)
    Extracted_text = clean_text(Extracted_text)
    JD = clean_text(JD)
    Extracted_text = Tokens(Extracted_text)
    JD = Tokens(JD)
    Resume_Skills = Keyword_Extraction_Resume(Extracted_text)
    JD_Skills = Keyword_Extraction_JD(JD)
    Skills = Matching_Missing(Resume_Skills, JD_Skills)
    ATS_Score = ATS(Skills)
    print(ATS_Score)

#API called for Question Generation with JD, and Resume_Analysis 
def API_Question_Generation(JD, Resume_Analysis):
    from Question_Gen import KeyBERT_Func
    Prompt = KeyBERT_Func()