# File which is the intermediate for the Main file and the files in this particular folder
# API will be called to this python file. And then it will be connected in that manner.

# API called for Resume Analysis with the pdf_path and JD
def API_NLP(Extracted_text, JD, difficulty):
    from Resume_Analysis import Tokens, clean_text, Keyword_Extraction_Resume, Keyword_Extraction_JD, Matching_Missing, ATS
    #Extracted_text = text_from_pdf(pdf_path)
    Extracted_text = clean_text(Extracted_text)
    JD = clean_text(JD)
    Extracted_text = Tokens(Extracted_text)
    JD = Tokens(JD)
    Resume_Skills = Keyword_Extraction_Resume(Extracted_text)
    JD_Skills = Keyword_Extraction_JD(JD)
    Skills = Matching_Missing(Resume_Skills, JD_Skills)
    ATS_Score = ATS(Skills)
    # Resume Analysis Done

    # Question Generation
    from Question_Gen import Ques_Gen
    Questions = Ques_Gen(difficulty, Skills[0], Skills[1], Skills[2])

    Analysis = {
        "Extracted_text" : Extracted_text,
        "JD" : JD,
        "Resume_Skills" : Resume_Skills,
        "JD_Skills" : JD_Skills,
        "Skills" : Skills,
        "ATS_Score" : ATS_Score,
        "Questions" : Questions
    }
    return Analysis

def API_QNA(User_Answer_Audio, Question):
    from Correctness_Analysis import Answer_Analysis
    from STT import Speech_To_Text
    User_Answer = Speech_To_Text(User_Answer_Audio)
    # Measure = Answer_Analysis(User_Answer, Question)
    # return Measure
    return User_Answer