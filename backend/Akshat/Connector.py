# File which is the intermediate for the Main file and the files in this particular folder
# API will be called to this python file. And then it will be connected in that manner.

# API called for Resume Analysis with the pdf_path and JD
def API_Resume_Analysis(pdf_path, JD):
    from Resume_Analysis import text_from_pdf, OCR, resume_analyser
    Extracted_text = text_from_pdf(pdf_path)
    Analysis = resume_analyser(Extracted_text, JD)
    return Analysis

#API called for Question Generation with JD, and Resume_Analysis 
def API_Question_Generation(JD, Resume_Analysis):
    from Question_Gen import KeyBERT_Func
    Prompt = KeyBERT_Func()